<template>
  <a class="blog-block-preview" :href="postUrl">
    <img class="blog-block-preview-image" href="" v-bind:src="getImageUrl(cover_url)" />
    <div class="blog-block-preview-text">{{ formattedTime }}</div>
    <div class="blog-block-preview-text">by {{ authorInfo.username }}</div>

    <div class="blog-block-preview-text blog-block-preview-title">
      {{ title }}
    </div>

    <div class="blog-block-preview-text">{{ filteredContent(content) }}</div>
    <div class="hashtag-container">
      <transition-group name="slide">
        <a
          v-for="category in categories"
          :key="category"
          class="hashtag"
          :href="'/articles/?search=' + category"
          >{{ category }}</a
        >
      </transition-group>
    </div>
  </a>
</template>

<script>
import { formatDistanceToNow, parseISO } from 'date-fns'

export default {
  name: 'ArticlePostPreview',
  props: ['id', 'cover_url', 'created_by', 'date', 'title', 'content', 'categories'],
  data() {
    return {
      postUrl: '',
      authorInfo: {}
    }
  },
  computed: {
    formattedTime() {
      const postTime = parseISO(this.date)
      return formatDistanceToNow(postTime, { addSuffix: true })
    }
  },
  mounted() {
    this.fetchAuthorInfo()
    this.postUrl = '/article/' + this.id
  },
  methods: {
    getImageUrl(filename) {
      return `http://localhost:4000/uploads/${filename}`
    },
    async fetchAuthorInfo() {
      try {
        const response = await fetch(`http://localhost:4000/api/users/${this.created_by}`)
        const data = await response.json()
        this.authorInfo = data
      } catch (error) {
        console.error(error)
      }
    },
    filteredContent(htmlContent) {
      // Create a temporary element to parse the HTML string
      const tempElement = document.createElement('div')
      tempElement.innerHTML = htmlContent

      return tempElement.textContent
    }
  }
}
</script>
