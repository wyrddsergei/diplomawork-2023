<template>
  <div id="login-reg-container">
    <div class="col-50 col-s-0 logo-bg"><div class="auth-site-name">TECHNOSUN</div></div>
    <div class="col-50 col-s-100 action-form">
      <div>
        <div class="auth-site-name-small">TECHNOSUN</div>
        <h1 id="action-name">Log into your account</h1>
      </div>

      <form @submit.prevent="submit">
        <label for="login">Login</label>
        <input v-model="data.login" id="login" type="text" name="login" required />

        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="data.password"
          name="password"
          minlength="8"
          required
        />
        <button type="submit">Log In</button>
      </form>

      <div id="link-to-action">
        <div>Don't have an account?</div>
        <a href="/signup">Register</a>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SignIn',
  setup() {
    const data = reactive({
      login: '',
      password: ''
    })
    const router = useRouter()

    const submit = async () => {
      await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      })

      await router.push('/')
    }

    return {
      data,
      submit
    }
  }
}
</script>
