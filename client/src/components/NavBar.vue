<template>
  <nav class="navbar main-header">
    <div class="navbar-left">
      <a class="site-name" href="/">TECHNOSUN</a>
      <input id="search-area-nav" type="textarea" placeholder="Search posts" />
    </div>

    <div>
      <a class="tab current-tab" href="/">Home</a>
      <a class="tab" href="/articles">Articles</a>
      <a v-if="!auth" class="tab" href="/signin">Sign in</a>
      <a v-if="auth" class="tab" href="/signin" @click="logout">Log out</a>
    </div>
  </nav>
  <ul class="navbar-categories" v-if="!['admin'].includes($route.name)">
    <li class="navbar-cat-item"><a href="#">Tech</a></li>
    <li class="navbar-cat-item"><a href="#">Science</a></li>
    <li class="navbar-cat-item"><a href="#">Life</a></li>
    <li class="navbar-cat-item"><a href="#">Entertainment</a></li>
    <li class="navbar-cat-item"><a href="#">Guides</a></li>
    <li class="navbar-cat-item"><a href="#">News</a></li>
    <li class="navbar-cat-item"><a href="#">Travel</a></li>
    <li class="navbar-cat-item"><a href="#">Deals</a></li>
  </ul>
</template>

<script>
import { computed } from 'vue'
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
    return {
      auth,
      logout
    }
  }
}
</script>
