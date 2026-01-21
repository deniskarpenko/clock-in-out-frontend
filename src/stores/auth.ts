import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const currentUser = ref<string | null>(null)

  const token = localStorage.getItem('auth_token')
  const user = localStorage.getItem('current_user')

  if (token && user) {
    isAuthenticated.value = true
    currentUser.value = user
  }

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      isAuthenticated.value = true
      currentUser.value = username

      // Сохраняем в localStorage
      localStorage.setItem('auth_token', 'fake-jwt-token')
      localStorage.setItem('current_user', username)

      return true
    }
    return false
  }

  const register = (firstName: string, lastName: string, userName: string, password: string): boolean => {
    return true
  }

  const logout = () => {
    isAuthenticated.value = false
    currentUser.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user')
  }

  return {
    isAuthenticated,
    currentUser,
    login,
    logout
  }
})
