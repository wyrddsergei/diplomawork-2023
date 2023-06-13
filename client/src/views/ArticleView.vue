<template>
  <div id="home-page-container">
    <div class="article-content-container">
      <div class="article-content">
        <div class="article-text-wrapper">
          <div class="article-text">
            {{ article.contents }}
          </div>
          <div class="article-date">Posted {{ formatTimestamp(article.createdAt) }}</div>
        </div>
        <div class="article-author">
          <div class="article-author-wrapper">
            <img
              class="author-profile-pic"
              src="https://images.pexels.com/photos/5474028/pexels-photo-5474028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="profile-pic"
            />
            <div class="article-author-info">
              <div class="author-name">By {{ article.createdBy }}</div>
              <div class="author-occupation">Senior Technology Correspondent</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="related-posts">
      <div class="related-posts-wrapper">
        <div class="related-posts-title">Related Posts</div>

        <div class="related-posts-grid slider fade">
          <a class="related-post-preview image" href="/article" v-for="i in 3" :key="i">
            <img
              class="related-image"
              src="https://images.pexels.com/photos/2823936/pexels-photo-2823936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
            />

            <div class="related-text-container">
              <div class="related-text">01.01.2023</div>

              <div class="related-text related-title">
                Richird Norton photorealistic rendering as real photos
              </div>
              <div class="related-text">
                Progressively incentivize cooperative systems through technically sound
                functionalities. Credibly productivate seamless data with flexible schemas.
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <div class="comment-section">
      <CommentSubmit
        v-if="auth && article._id"
        :post-id="article._id"
        :author-id="authenticatedUser._id"
      />
      <!-- <h2>Comments ({{ comments.length }})</h2>
      <div class="comment-non-user" v-if="!auth">
        Want to engage in the conversation? <a href="/signin">Sign in or register!</a>
      </div>
      <div class="comment" v-for="comment in comments.slice().reverse()" :key="comment">
        <div class="comment-user-info" v-if="comment">
          <img
            class="comment-avatar"
            :src="comment.user ? comment.user.profilePicture : ''"
            :alt="comment.user ? comment.user.username : ''"
          />

          <div class="comment-name-time">
            <div class="comment-name">{{ comment.user ? comment.user.username : '' }}</div>
            <div class="comment-posted-on">{{ formatTimestamp(comment.createdAt) }}</div>
          </div>
        </div>

        <div class="comment-content">
          <div class="comment-text">
            {{ comment.content }}
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import CommentSubmit from '../components/CommentSubmit.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const article = ref('')
    const comments = ref([])
    const route = useRoute()
    const store = useStore()
    const auth = computed(() => store.state.authenticated)
    const authenticatedUser = computed(() => store.state.user)

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

    const fetchPost = () => {
      fetch(`http://localhost:4000/api/posts/${route.params.id}`)
        .then((response) => response.json())
        .then((data) => {
          article.value = data
        })
    }

    onMounted(() => {
      fetchPost()
    })
    return {
      article,
      comments,
      auth,
      formatTimestamp,
      authenticatedUser
    }
  },
  components: {
    CommentSubmit
  }
}
</script>
