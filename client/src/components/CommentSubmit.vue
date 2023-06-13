<template>
  <div>
    <h2>Comments ({{ comments.length }})</h2>
    <form @submit.prevent="submitComment" class="comment-form">
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
          <img class="comment-author-avatar" :src="comment.authorAvatar" alt="Author Avatar" />
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
            <div v-else class="comment-text">
              <p>{{ comment.content }}</p>
            </div>
            <div class="comment-actions">
              <small class="comment-timestamp">{{ formatTimestamp(comment.createdAt) }}</small>
              <button
                v-if="isAuthorizedToDelete(comment)"
                @click="deleteComment(comment._id)"
                class="comment-delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
.comment {
  list-style-type: none;
  margin-bottom: 20px;
}

.comment-content {
  display: flex;
}

.comment-author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.comment-details {
  flex-grow: 1;
}

.comment-author-info {
  display: flex;
  align-items: baseline;
}

.comment-author-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
  margin-right: 5px;
}

.comment-handle {
  margin-bottom: 5px;
  color: #555;
}

.comment-text,
.comment-long-text {
  margin-bottom: 5px;
  color: #333;
}

.comment-actions {
  display: flex;
  align-items: center;
}

.comment-timestamp {
  font-size: 12px;
  color: gray;
  margin-right: 10px;
}

.comment-delete-button {
  font-size: 12px;
  color: gray;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.comment-delete-button:hover {
  color: red;
}

.comment-form {
  margin-top: 20px;
}

.comment-input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.comment-input {
  resize: vertical;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

.comment-submit-button {
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.comment-submit-button:hover {
  background-color: #0d6ad0;
}

.comment-list {
  padding: 0;
}

.comment-show-more-button {
  background-color: transparent;
  color: gray;
  border: none;
  font-size: 12px;
  cursor: pointer;
}

.comment-show-more-button:hover {
  color: blue;
}

.comment-long-text p {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comment-show-more-button:focus {
  outline: none;
}
</style>

<script>
import { reactive } from 'vue'

export default {
  props: {
    postId: {
      type: String,
      required: true
    },
    authorId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [], // Your comments data
      newCommentContent: '', // Your new comment input value
      showFullComment: reactive({}) // Object to track expanded comments
    }
  },
  mounted() {
    this.fetchComments()
  },
  methods: {
    isCommentLong(comment) {
      return comment.content.length > 500 // Adjust the threshold as needed
    },
    getShortenedComment(comment) {
      return comment.content.substring(0, 500) + '...' // Adjust the length as needed
    },
    toggleFullComment(commentId) {
      this.showFullComment[commentId] = !this.showFullComment[commentId]
    },
    async fetchComments() {
      try {
        const response = await fetch(`http://localhost:4000/api/comments/${this.postId}`)
        const comments = await response.json()

        // Fetch user information for each comment
        const fetchUserPromises = comments.map(async (comment) => {
          try {
            const response = await fetch(`http://localhost:4000/api/users/${comment.authorId}`)
            const user = await response.json()
            comment.authorName = user.username
            comment.authorHandle = user.login
            comment.authorAvatar = user.profilePicture
          } catch (error) {
            console.error(`Failed to fetch user information for comment ${comment._id}:`, error)
          }
        })

        // Wait for all user information requests to complete
        await Promise.all(fetchUserPromises)

        // Filter out comments with non-existing users
        this.comments = comments.filter((comment) => comment.authorName && comment.authorHandle)
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      }
    },
    async fetchUserInformation(comment) {
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
            // Remove the comment with non-existing user
            this.comments = this.comments.filter((c) => c._id !== comment._id)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async submitComment() {
      try {
        const response = await fetch('http://localhost:4000/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            postId: this.postId,
            content: this.newCommentContent,
            authorId: this.authorId
          })
        })
        const newComment = await response.json()

        // Fetch user information for the new comment
        await this.fetchUserInformation(newComment)

        this.comments.push(newComment)
        this.newCommentContent = ''
      } catch (error) {
        console.error('Failed to create comment:', error)
      }
    },
    async deleteComment(commentId) {
      try {
        await fetch(`http://localhost:4000/api/comments/${commentId}`, {
          method: 'DELETE'
        })
        this.comments = this.comments.filter((comment) => comment._id !== commentId)
      } catch (error) {
        console.error('Failed to delete comment:', error)
      }
    },
    isAuthorizedToDelete(comment) {
      return comment.authorId === this.authorId
    },
    formatTimestamp(timestamp) {
      const currentDate = new Date()
      const targetDate = new Date(timestamp)
      const elapsedMilliseconds = currentDate - targetDate

      // Calculate the elapsed time in minutes, hours, or days
      if (elapsedMilliseconds < 60000) {
        // Less than a minute
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)
        return `${elapsedSeconds}s`
      } else if (elapsedMilliseconds < 3600000) {
        // Less than an hour
        const elapsedMinutes = Math.floor(elapsedMilliseconds / 60000)
        return `${elapsedMinutes}m`
      } else if (elapsedMilliseconds < 86400000) {
        // Less than a day
        const elapsedHours = Math.floor(elapsedMilliseconds / 3600000)
        return `${elapsedHours}h`
      } else {
        // More than a day
        const elapsedDays = Math.floor(elapsedMilliseconds / 86400000)
        return `${elapsedDays}d`
      }
    }
  }
}
</script>
