<template>
  <div class="article-list-container">
    <a href="/">Home</a>
    <h1 id="list-name">Article List</h1>

    <a href="/editor" class="add-article-link">+ Add Article</a>
    <div class="table-container">
      <table id="article-list">
        <thead class="has-shadow">
          <tr>
            <th>IMAGE</th>
            <th>TITLE</th>
            <th>AUTHOR</th>
            <th>PUBLISHED</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post._id">
            <td class="blog-image">
              <img :src="'http://localhost:4000/uploads/' + post.coverImage" alt="" />
            </td>
            <td>{{ post.title }}</td>
            <td>{{ authenticatedUser.username }}</td>
            <td>{{ formatDate(post.createdAt) }}</td>
            <td class="action-btns">
              <div class="delete-btn" @click="deletePost(post._id)">
                <img
                  src="https://static-00.iconduck.com/assets.00/trash-icon-462x512-njvey5nf.png"
                  alt="delete"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { formatDistanceToNow, parseISO } from 'date-fns'

export default {
  setup() {
    const posts = ref([])
    const store = useStore()
    const authenticatedUser = computed(() => store.state.user)
    const myId = authenticatedUser.value._id

    const fetchPostsByUser = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/posts?user=${myId}`)
        if (response.ok) {
          const data = await response.json()
          posts.value = data.posts
        } else {
          console.log('Error fetching posts:', response.statusText)
        }
      } catch (error) {
        console.log('Error fetching posts:', error)
      }
    }

    const formatDate = (date) => {
      const postTime = parseISO(date)
      return formatDistanceToNow(postTime, { addSuffix: true })
    }

    const deletePost = async (postId) => {
      try {
        const response = await fetch(`http://localhost:4000/api/posts/${postId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          // Remove the deleted post from the posts array
          posts.value = posts.value.filter((post) => post._id !== postId)
        } else {
          console.log('Error deleting post:', response.statusText)
        }
      } catch (error) {
        console.log('Error deleting post:', error)
      }
    }

    onMounted(() => {
      fetchPostsByUser()
    })

    return {
      posts,
      authenticatedUser,
      formatDate,
      deletePost
    }
  }
}
</script>

<style scoped>
.add-article-link {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  text-decoration: none;
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
}
</style>
