<template>
  <div>
    <h2>Comments ({{ comments.length }})</h2>
    <form v-if="auth" @submit.prevent="submitComment" class="comment-form">
      <div class="comment-input-container">
        <textarea
          v-model="newCommentContent"
          rows="3"
          required
          placeholder="Add a public comment..."
          class="comment-input"
        ></textarea>
      </div>
      <button type="submit" class="comment-submit-button">Comment</button>
    </form>
    <ul class="comment-list">
      <li v-for="comment in comments.slice().reverse()" :key="comment._id" class="comment">
        <div class="comment-content">
          <img
            class="comment-author-avatar"
            :src="getImageUrl(comment.authorAvatar)"
            alt="Author Avatar"
          />
          <div class="comment-details">
            <div class="comment-author-info">
              <p class="comment-author-name">{{ comment.authorName }}</p>
              <p class="comment-handle">@{{ comment.authorHandle }}</p>
            </div>
            <div v-if="isCommentLong(comment)" class="comment-long-text">
              <p v-if="!showFullComment[comment._id]">{{ getShortenedComment(comment) }}</p>
              <p v-else>{{ comment.content }}</p>
              <button @click="toggleFullComment(comment._id)" class="comment-show-more-button">
                {{ showFullComment[comment._id] ? 'Show Less' : 'Show More' }}
              </button>
            </div>
            <div v-if="!editingComments[comment._id]" class="comment-text">
              <p>{{ comment.content }}</p>
            </div>
            <div v-else class="comment-edit-interface">
              <textarea
                v-model="editingComments[comment._id].content"
                rows="3"
                class="comment-input"
              ></textarea>
              <button @click="updateComment(comment._id)" class="comment-update-button">
                Update
              </button>
              <button @click="cancelEditComment(comment._id)" class="comment-cancel-button">
                Cancel
              </button>
            </div>
            <div class="comment-actions">
              <small class="comment-timestamp">{{ formatTimestamp(comment.createdAt) }}</small>
              <button
                v-if="auth && isAuthorizedToDelete(comment)"
                @click="deleteComment(comment._id)"
                class="comment-delete-button"
              >
                Delete
              </button>
              <button
                v-if="auth && isAuthorizedToEdit(comment)"
                @click="editComment(comment._id)"
                class="comment-edit-button"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: ['postId'],
  setup(props) {
    const comments = reactive([])
    const newCommentContent = ref('')
    const showFullComment = reactive({})
    const store = useStore()
    const auth = computed(() => store.state.authenticated)
    const editingComments = reactive({})

    const isCommentLong = (comment) => {
      return comment.content.length > 500
    }

    const getShortenedComment = (comment) => {
      return comment.content.substring(0, 500) + '...'
    }

    const toggleFullComment = (commentId) => {
      showFullComment[commentId] = !showFullComment[commentId]
    }

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/comments/${props.postId}`)
        const commentsData = await response.json()

        const fetchUserPromises = commentsData.map(async (comment) => {
          try {
            const userResponse = await fetch(`http://localhost:4000/api/users/${comment.authorId}`)
            const user = await userResponse.json()
            comment.authorName = user.username
            comment.authorHandle = user.login
            comment.authorAvatar = user.profilePicture
          } catch (error) {
            console.error(`Failed to fetch user information for comment ${comment._id}:`, error)
          }
        })

        await Promise.all(fetchUserPromises)

        comments.push(
          ...commentsData.filter((comment) => comment.authorName && comment.authorHandle)
        )
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      }
    }

    const fetchUserInformation = async (comment) => {
      try {
        const response = await fetch(`http://localhost:4000/api/users/${comment.authorId}`)
        if (response.ok) {
          const user = await response.json()
          comment.authorName = user.username
          comment.authorHandle = user.login
          comment.authorAvatar = user.profilePicture
        } else {
          const statusText = response.statusText
          if (statusText !== 'Internal Server Error') {
            comments.splice(
              comments.findIndex((c) => c._id === comment._id),
              1
            )
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getImageUrl = (filename) => {
      return `http://localhost:4000/uploads/${filename}`
    }

    const submitComment = async () => {
      try {
        const authenticatedUser = computed(() => store.state.user)
        const myAuthorId = authenticatedUser.value._id

        const response = await fetch('http://localhost:4000/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            postId: props.postId,
            content: newCommentContent.value,
            authorId: myAuthorId
          })
        })
        const newComment = await response.json()

        await fetchUserInformation(newComment)

        comments.push(newComment)
        newCommentContent.value = ''
      } catch (error) {
        console.error('Failed to create comment:', error)
      }
    }

    const deleteComment = async (commentId) => {
      try {
        await fetch(`http://localhost:4000/api/comments/${commentId}`, {
          method: 'DELETE'
        })
        comments.splice(
          comments.findIndex((comment) => comment._id === commentId),
          1
        )
      } catch (error) {
        console.error('Failed to delete comment:', error)
      }
    }

    const editComment = async (commentId) => {
      try {
        const response = await fetch(`http://localhost:4000/api/comments/comment/${commentId}`)
        if (response.ok) {
          const comment = await response.json()
          const editableComment = {
            postId: comment._id,
            content: comment.content,
            originalContent: comment.content
          }

          // Set the comment as editing in the editingComments object
          editingComments[commentId] = editableComment
        } else {
          console.error('Failed to fetch comment:', response.status)
        }
      } catch (error) {
        console.error('Failed to edit comment:', error)
      }
    }

    const updateComment = async (commentId) => {
      try {
        const comment = editingComments[commentId]
        if (!comment) {
          console.error('Comment not found')
          return
        }

        const response = await fetch(`http://localhost:4000/api/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: comment.content
          })
        })

        if (!response.ok) {
          console.error('Failed to update comment:', response.status)
          return
        }

        // Update the corresponding comment in the comments array with the updated content
        const commentIndex = comments.findIndex((comment) => comment._id === commentId)
        if (commentIndex !== -1) {
          comments[commentIndex].content = comment.content
        }

        // Clear the editing state for the comment
        delete editingComments[commentId]
      } catch (error) {
        console.error('Failed to update comment:', error)
      }
    }

    const cancelEditComment = (commentId) => {
      // Clear the editing state for the comment
      delete editingComments[commentId]
    }
    const isAuthorizedToDelete = (comment) => {
      const authenticatedUser = computed(() => store.state.user)
      const myAuthorId = authenticatedUser.value._id
      return comment.authorId === myAuthorId
    }

    const isAuthorizedToEdit = (comment) => {
      const authenticatedUser = computed(() => store.state.user)
      const myAuthorId = authenticatedUser.value._id
      return comment.authorId === myAuthorId
    }

    const formatTimestamp = (timestamp) => {
      const currentDate = new Date()
      const targetDate = new Date(timestamp)
      const elapsedMilliseconds = currentDate - targetDate

      if (elapsedMilliseconds < 60000) {
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)
        return `${elapsedSeconds}s`
      } else if (elapsedMilliseconds < 3600000) {
        const elapsedMinutes = Math.floor(elapsedMilliseconds / 60000)
        return `${elapsedMinutes}m`
      } else if (elapsedMilliseconds < 86400000) {
        const elapsedHours = Math.floor(elapsedMilliseconds / 3600000)
        return `${elapsedHours}h`
      } else {
        const elapsedDays = Math.floor(elapsedMilliseconds / 86400000)
        return `${elapsedDays}d`
      }
    }

    onMounted(fetchComments)

    return {
      getImageUrl,
      editingComments,
      auth,
      comments,
      newCommentContent,
      showFullComment,
      isCommentLong,
      getShortenedComment,
      toggleFullComment,
      submitComment,
      deleteComment,
      editComment,
      isAuthorizedToDelete,
      isAuthorizedToEdit,
      formatTimestamp,
      updateComment,
      cancelEditComment
    }
  }
}
</script>

<style lang="scss">
$primary-color: #1877f2;
$secondary-color: #555;
$highlight-color: blue;
$delete-color: red;
$text-color: #333;
$gray-color: gray;
$comment-margin-bottom: 20px;
$avatar-size: 40px;
$avatar-border-radius: 50%;
$avatar-margin-right: 10px;
$input-border: 1px solid #ccc;
$input-padding: 8px;
$input-font-size: 14px;
$submit-button-padding: 8px 16px;
$show-more-button-font-size: 12px;
$show-more-button-focus-outline: none;

.comment {
  list-style-type: none;
  margin-bottom: $comment-margin-bottom;

  &-content {
    display: flex;

    & img.comment-author-avatar {
      object-fit: cover;
      width: $avatar-size;
      height: $avatar-size;
      border-radius: $avatar-border-radius;
      margin-right: $avatar-margin-right;
    }

    & .comment-details {
      flex-grow: 1;

      & .comment-author-info {
        display: flex;
        align-items: baseline;

        & .comment-author-name {
          font-weight: bold;
          margin-bottom: 5px;
          color: $text-color;
          margin-right: 5px;
        }

        & .comment-handle {
          margin-bottom: 5px;
          color: $secondary-color;
        }
      }

      & .comment-text,
      & .comment-long-text {
        margin-bottom: 5px;
        color: $text-color;
      }

      & .comment-actions {
        display: flex;
        align-items: center;

        & .comment-timestamp {
          font-size: 12px;
          color: $gray-color;
          margin-right: 10px;
        }

        & .comment-edit-button {
          font-size: 12px;
          color: $gray-color;
          background-color: transparent;
          border: none;
          cursor: pointer;

          &:hover {
            color: $primary-color;
          }
        }

        & .comment-delete-button {
          font-size: 12px;
          color: $gray-color;
          background-color: transparent;
          border: none;
          cursor: pointer;

          &:hover {
            color: $delete-color;
          }
        }
      }
    }
  }
}

.comment-form {
  margin-top: 20px;

  & .comment-input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    & .comment-input {
      resize: vertical;
      padding: $input-padding;
      border: $input-border;
      border-radius: 4px;
      font-size: $input-font-size;
      color: $text-color;
    }
  }

  & .comment-submit-button {
    background-color: $primary-color;
    color: white;
    border: none;
    padding: $submit-button-padding;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
}

.comment-list {
  padding: 0;

  & .comment-show-more-button {
    background-color: transparent;
    color: $gray-color;
    border: none;
    font-size: $show-more-button-font-size;
    cursor: pointer;

    &:hover {
      color: $highlight-color;
    }
  }

  & .comment-long-text {
    p {
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  & .comment-show-more-button:focus {
    outline: $show-more-button-focus-outline;
  }
}
</style>
