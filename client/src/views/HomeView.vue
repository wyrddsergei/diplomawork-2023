<template>
  <div>
    <div class="blog-block">
      <div class="greeting-message" v-if="auth">{{ message }}</div>
      <div class="blog-block-title">
        <div class="latest-title">Latest</div>
        <a href="/articles">View more</a>
      </div>
      <div v-if="articles" class="blog-block-grid">
        <ArticlePostPreview
          v-for="article in articles.slice(0, 8)"
          :key="article._id"
          :id="article._id"
          :created_by="article.createdBy"
          :date="article.createdAt"
          :title="article.title"
          :cover_url="article.coverImage"
          :content="article.contents"
          :categories="article.categories"
        />
      </div>
      <div v-if="!articles">Nothing here :/</div>
    </div>
  </div>

  <FooterImage />
</template>

<script>
import ArticlePostPreview from '../components/ArticlePostPreview.vue'
import FooterImage from '../components/FooterImage.vue'
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'HomeView',
  components: { ArticlePostPreview, FooterImage },
  setup() {
    const articles = ref([]) // Create a reactive reference
    const message = ref('You are not logged in') // Create a reactive reference
    const store = useStore()

    onMounted(() => {
      fetchLatestPosts()
    })

    const fetchLatestPosts = () => {
      fetch('http://localhost:4000/api/posts/')
        .then((response) => response.json())
        .then((data) => {
          articles.value = data.posts // Assign value to the reactive reference
        })
        .catch((error) => {
          console.error(error)
        })
    }

    const auth = computed(() => store.state.authenticated)

    if (auth.value) {
      const authenticatedUser = computed(() => store.state.user)
      message.value = `Welcome, ${authenticatedUser.value.username}!`
    }

    return {
      articles,
      message,
      fetchLatestPosts,
      auth
    }
  }
}
</script>

<style>
.greeting-message {
  font-size: 20px;
  margin-bottom: 12px;
}
</style>
