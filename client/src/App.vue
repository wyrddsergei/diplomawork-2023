<template>
  <header>
    <NavBar
      v-if="!['signin', 'signup', 'createarticle', 'editor', 'notfound'].includes($route.name)"
    />
  </header>
  <RouterView />
  <FooterComponent
    v-if="
      !['signin', 'signup', 'admin', 'createarticle', 'editor', 'notfound'].includes($route.name)
    "
  />
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import FooterComponent from './components/FooterComponent.vue'
</script>
