import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:80'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ВАЖНО: для отправки cookies с CSRF токеном
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

let csrfInitialized = false

const initCsrf = async () => {
  if (!csrfInitialized) {
    try {
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      })
      csrfInitialized = true
    } catch (error) {
      console.error('Error retrieving CSRF token:', error)
      throw error
    }
  }
}

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!csrfInitialized && config.method !== 'get') {
      await initCsrf()
    }

    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true

      csrfInitialized = false
      await initCsrf()

      return axiosInstance(originalRequest)
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user')
      window.location.href = '/login'
    }

    if (error.response?.status === 422) {
      const errors = error.response.data.errors
      if (errors) {
        const firstError = Object.values(errors)[0]
        error.message = Array.isArray(firstError) ? firstError[0] : error.response.data.message
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
