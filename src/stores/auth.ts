import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/utils/axios'

interface RegisterData {
  firstName: string
  lastName: string
  userName: string
  password: string
}

interface ApiResponse<T = any> {
  data?: T
  error?: string
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const currentUser = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const initAuth = () => {
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('current_user')

    if (token && user) {
      isAuthenticated.value = true
      currentUser.value = user
    }
  }

  initAuth()

  const login = async (username: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('/login', {
        username,
        password,
      })

      if (response.data) {
        isAuthenticated.value = true
        currentUser.value = response.data.user.username || response.data.user.name
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('current_user', response.data.user.username || response.data.user.name)

        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message || 'Ошибка при входе'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (
    firstName: string,
    lastName: string,
    userName: string,
    password: string
  ): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const registerData: RegisterData = {
        firstName,
        lastName,
        userName,
        password,
      }

      const response = await axios.post('/register', registerData)

      if (response.data) {
        if (response.data.token && response.data.user) {
          isAuthenticated.value = true
          currentUser.value = response.data.user.username || response.data.user.name
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('current_user', response.data.user.username || response.data.user.name)
        }

        return true
      }

      return false
    } catch (err: any) {
      error.value = err.message || 'Ошибка при регистрации'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (err) {
      console.error('Ошибка при логауте:', err)
    } finally {
      isAuthenticated.value = false
      currentUser.value = null
      error.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user')
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  }
})
