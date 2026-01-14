<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  error.value = ''

  if (!username.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }

  const success = authStore.login(username.value, password.value)

  if (success) {
    router.push('/')
  } else {
    error.value = 'Неверный логин или пароль'
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Enter to system</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Login:</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Login"
          />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Password"
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" class="btn-login">Enter</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.error {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-login:hover {
  background: #5568d3;
}
</style>
