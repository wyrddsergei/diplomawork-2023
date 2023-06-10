<template>
  <div class="not-found">
    <h1 class="not-found__title">404</h1>
    <p class="not-found__message">Oops! The page you're looking for doesn't exist.</p>
    <router-link to="/" class="not-found__link">Go back to Home</router-link>
  </div>
</template>

<style lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

.not-found__title {
  font-size: 6rem;
  color: #333;
  margin-bottom: 2rem;
}

.not-found__message {
  font-size: 2rem;
  color: #777;
  margin-bottom: 2rem;
}

.not-found__link {
  font-size: 1.2rem;
  color: #fff;
  background-color: #007bff;
  padding: 1rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.not-found__link:hover {
  background-color: #0056b3;
}
</style>
