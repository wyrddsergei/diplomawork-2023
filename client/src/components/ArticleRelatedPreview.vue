<template>
  <div class="related-posts-grid slider fade">
    <a
      class="related-post-preview image"
      :href="'/article/' + post._id"
      v-for="(post, index) in posts"
      :key="index"
    >
      <img class="related-image" :src="getImageUrl(post.coverImage)" alt="" />

      <div class="related-text-container">
        <div class="related-text">{{ formattedTime(post.createdAt) }}</div>

        <div class="related-text related-title">
          {{ post.title }}
        </div>
        <div class="related-text">{{ filteredContent(post.contents) }}</div>
      </div>
    </a>
  </div>
</template>

<script>
import { formatDistanceToNow, parseISO } from 'date-fns'
export default {
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  methods: {
    getImageUrl(filename) {
      return `http://localhost:4000/uploads/${filename}`
    },
    formattedTime(date) {
      const postTime = parseISO(date)
      return formatDistanceToNow(postTime, { addSuffix: true })
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
