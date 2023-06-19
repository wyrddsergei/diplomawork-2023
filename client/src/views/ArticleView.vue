<template>
  <div id="home-page-container">
    <div class="article-content-container">
      <div class="article-content">
        <div class="article-text-wrapper">
          <div v-html="article.contents" class="article-text" />
          <div class="article-date">Posted {{ formatTimestamp(article.createdAt) }}</div>
        </div>
        <div class="article-author">
          <div class="article-author-wrapper">
            <img
              v-if="authorInfo"
              class="author-profile-pic"
              :src="'http://localhost:4000/uploads/' + authorInfo.profilePicture"
              alt="profile-pic"
            />
            <div class="article-author-info">
              <div class="author-name">By {{ authorInfo.username }}</div>
              <div class="author-occupation">Article Author</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="related-posts">
      <div class="related-posts-wrapper">
        <div class="related-posts-title">Related Posts</div>
        <ArticleRelatedPreview :posts="relatedPosts" />
      </div>
    </div>

    <div class="comment-section" v-if="article._id">
      <div class="comment-non-user" v-if="!auth">
        Want to engage in the conversation? <a href="/signin">Sign in or register!</a>
      </div>
      <CommentSubmit :postId="article._id" />
    </div>
  </div>
</template>

<script>
import ArticleRelatedPreview from '../components/ArticleRelatedPreview.vue'
import CommentSubmit from '../components/CommentSubmit.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const article = ref('')
    const authorInfo = ref('')
    const comments = ref([])
    const route = useRoute()
    const store = useStore()
    const auth = computed(() => store.state.authenticated)
    const relatedPosts = ref([])
    const loading = ref(false)

    const formatTimestamp = (timestamp) => {
      const currentDate = new Date()
      const targetDate = new Date(timestamp)
      const elapsedMilliseconds = currentDate - targetDate

      // Calculate the elapsed time in minutes, hours, or days
      if (elapsedMilliseconds < 60000) {
        // Less than a minute
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)
        return `${elapsedSeconds} seconds ago`
      } else if (elapsedMilliseconds < 3600000) {
        // Less than an hour
        const elapsedMinutes = Math.floor(elapsedMilliseconds / 60000)
        return `${elapsedMinutes} minutes ago`
      } else if (elapsedMilliseconds < 86400000) {
        // Less than a day
        const elapsedHours = Math.floor(elapsedMilliseconds / 3600000)
        return elapsedHours !== 1 ? `${elapsedHours} hours ago` : `${elapsedHours} hour ago`
      } else {
        // More than a day
        const elapsedDays = Math.floor(elapsedMilliseconds / 86400000)
        return `${elapsedDays} days ago`
      }
    }

    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/posts/${route.params.id}`)
        const data = await response.json()
        article.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const fetchRelatedPosts = async () => {
      try {
        loading.value = true

        // Check if article.value.categories exists before using it
        if (article.value && article.value.categories && article.value.categories.length > 0) {
          const relatedPostsResponse = await fetch(
            `http://localhost:4000/api/posts/?search=${article.value.categories[0]}&limit=3`
          )
          const relatedPostsData = await relatedPostsResponse.json()

          if (relatedPostsData.length > 0) {
            // Filter out the current page from the related posts
            const filteredPosts = relatedPostsData.filter((post) => post._id !== article.value._id)
            relatedPosts.value = filteredPosts
          } else {
            const allPostsResponse = await fetch('http://localhost:4000/api/posts/?limit=3')
            const allPostsData = await allPostsResponse.json()

            // Filter out the current page from all posts
            const filteredPosts = allPostsData.posts.filter(
              (post) => post._id !== article.value._id
            )
            relatedPosts.value = filteredPosts
          }
        } else {
          const allPostsResponse = await fetch('http://localhost:4000/api/posts/?limit=3')
          const allPostsData = await allPostsResponse.json()

          // Filter out the current page from all posts
          const filteredPosts = allPostsData.posts.filter((post) => post._id !== article.value._id)
          relatedPosts.value = filteredPosts
        }

        loading.value = false
      } catch (error) {
        console.error(error)
        loading.value = false
      }
    }

    const fetchAuthorInfo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/users/${article.value.createdBy}`)
        const data = await response.json()
        authorInfo.value = data
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(async () => {
      await fetchPost()
      await fetchRelatedPosts()
      await fetchAuthorInfo()
    })

    return {
      article,
      authorInfo,
      comments,
      auth,
      relatedPosts,
      formatTimestamp
    }
  },
  components: {
    CommentSubmit,
    ArticleRelatedPreview
  }
}
</script>
