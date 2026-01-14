<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="home-container">
     <p>User: <strong>{{ authStore.currentUser }}</strong></p>
    <button @click="handleLogout" class="btn-logout">Выйти</button>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 0.5rem;
  color: #666;
}

.btn-logout {
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
}
</style>
