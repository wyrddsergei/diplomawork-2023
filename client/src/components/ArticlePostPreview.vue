<template>
  <a class="blog-block-preview" :href="postUrl">
    <img class="blog-block-preview-image" href="" v-bind:src="cover_url" />
    <div class="blog-block-preview-text">{{ formattedTime }}</div>
    <div class="blog-block-preview-text">by {{ created_by }}</div>

    <div class="blog-block-preview-text blog-block-preview-title">
      {{ title }}
    </div>

    <div class="blog-block-preview-text">
      {{ content }}
    </div>
    <div class="hashtag-container">
      <transition-group name="slide">
        <span v-for="category in categories" :key="category" class="hashtag">{{ category }}</span>
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
      postUrl: ''
    }
  },
  computed: {
    formattedTime() {
      const postTime = parseISO(this.date)
      return formatDistanceToNow(postTime, { addSuffix: true })
    }
  },
  mounted() {
    this.postUrl = 'article/' + this.id
  }
}
</script>
