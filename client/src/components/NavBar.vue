<template>
  <nav class="navbar main-header">
    <div class="navbar-left">
      <a class="site-name" href="/">TECHNOSUN</a>
      <input
        id="search-area-nav"
        type="text"
        placeholder="Search posts"
        v-model="searchQuery"
        @keyup.enter="searchPosts"
      />
    </div>

    <div>
      <a class="tab current-tab" href="/articles">Read all</a>
      <a v-if="auth" class="tab" href="/admin">Manage</a>
      <a v-if="!auth" class="tab" href="/signin">Sign in</a>
      <a v-if="auth" class="tab" href="/signin" @click="logout">Log out</a>
    </div>
  </nav>
  <ul class="navbar-categories" v-if="!['admin'].includes($route.name)">
    <li class="navbar-cat-item"><a href="/articles/?search=Tech">Tech</a></li>
    <li class="navbar-cat-item"><a href="/articles/?search=Science">Science</a></li>
    <li class="navbar-cat-item"><a href="/articles/?search=Life">Life</a></li>
    <li class="navbar-cat-item"><a href="/articles/?search=Entertainment">Entertainment</a></li>
    <li class="navbar-cat-item"><a href="/articles/?search=Guides">Guides</a></li>
    <li class="navbar-cat-item"><a href="/articles/?search=News">News</a></li>
    <li class="navbar-cat-item"><a href="/articles/?search=Travel">Travel</a></li>
    <li class="navbar-cat-item"><a href="/articles/?search=Deals">Deals</a></li>
  </ul>
</template>

<script>
import { computed, ref } from 'vue' // Import ref from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'NavBar',
  setup() {
    const store = useStore()
    const auth = computed(() => store.state.authenticated)
    const logout = async () => {
      await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
    }
    const searchQuery = ref('')

    const searchPosts = () => {
      const encodedSearchQuery = encodeURIComponent(searchQuery.value)
      window.location.href = `/articles/?search=${encodedSearchQuery}`
    }

    return {
      auth,
      logout,
      searchQuery,
      searchPosts
    }
  }
}
</script>
