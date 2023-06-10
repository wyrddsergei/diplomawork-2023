<template>
  <div id="login-reg-container">
    <div class="col-50 col-s-0 logo-bg"><div class="auth-site-name">TECHNOSUN</div></div>
    <div class="col-50 col-s-100 action-form">
      <div>
        <div class="auth-site-name-small">TECHNOSUN</div>
        <h1 id="action-name">Create account</h1>
      </div>

      <form @submit.prevent="submit">
        <label for="login">Login</label>
        <input v-model="data.login" id="login" type="text" name="login" required />

        <label for="username">Username</label>
        <input v-model="data.username" id="username" type="text" name="username" required />

        <label for="email">Email</label>
        <input
          v-model="data.email"
          id="email"
          type="email"
          name="email"
          pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
          required
        />

        <label for="password">Password</label>
        <input
          v-model="data.password"
          id="password"
          type="password"
          name="password"
          minlength="8"
          required
        />

        <button type="submit">Create account</button>

        <!-- <a id="with-google" href="https://www.google.com" target="_blank">Sign up with Google</a> -->
      </form>

      <div id="link-to-action">
        <div>Already have an account?</div>
        <a href="/signin">Log In</a>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SignUp',
  setup() {
    const data = reactive({
      login: '',
      username: '',
      email: '',
      password: ''
    })
    const router = useRouter()

    const submit = async () => {
      await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      await router.push('/signin')
    }

    return {
      data,
      submit
    }
  }
}
</script>
