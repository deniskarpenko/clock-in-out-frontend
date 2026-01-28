import axios, { AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:80'

const CONFIG = {
  TIMEOUT: 10000,
  CSRF_TIMEOUT: 5000,
  MAX_CSRF_RETRIES: 3,
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

let csrfInitialized = false
let csrfRetryCount = 0

const initCsrf = async (): Promise<void> => {
  if (csrfInitialized) {
    return
  }

  if (csrfRetryCount >= CONFIG.MAX_CSRF_RETRIES) {
    csrfRetryCount = 0
    throw new Error('The limit for attempts to obtain a CSRF token has been exceeded. Please check your connection to the server.')
  }

  try {
    csrfRetryCount++

    await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
      timeout: CONFIG.CSRF_TIMEOUT,
    })

    csrfInitialized = true
    csrfRetryCount = 0
  } catch (error) {
    console.error(`Error retrieving CSRF token (attempt ${csrfRetryCount}/${CONFIG.MAX_CSRF_RETRIES}):`, error)

    if (csrfRetryCount >= CONFIG.MAX_CSRF_RETRIES) {
      csrfRetryCount = 0
      throw new Error('Could not connect to the server. Please check your internet connection.')
    }

    throw error
  }
}

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config) => {
    if (!csrfInitialized && config.method !== 'get') {
      try {
        await initCsrf()
      } catch (error) {
        return Promise.reject(error)
      }
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
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    if (!originalRequest) {
      return Promise.reject(new Error('Network error. Please check your internet connection.'))
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject(new Error('The server response time has been exceeded.'))
    }

    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Network error. Please check your internet connection.'))
    }

    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        csrfInitialized = false
        await initCsrf()

        return axiosInstance(originalRequest)
      } catch (csrfError) {
        console.error('Failed to obtain a new CSRF token:', csrfError)
        return Promise.reject(new Error('Authentication error.'))
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user')
      return Promise.reject(new Error('Your session has expired. Please log in again.'))
    }

    if (error.response?.status === 422) {
      const errors = error.response.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0]
        const message = Array.isArray(firstError) ? firstError[0] : error.response.data?.message
        return Promise.reject(new Error(message || 'Data validation error'))
      }
      return Promise.reject(new Error(error.response.data?.message || 'Data validation error'))
    }

    return Promise.reject(error)
  }
)

export const resetCsrf = () => {
  csrfInitialized = false
  csrfRetryCount = 0
}

export default axiosInstance
