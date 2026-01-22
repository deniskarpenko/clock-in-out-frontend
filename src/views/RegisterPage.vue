<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TextInput from "@/components/TextInput.vue";

const router = useRouter()
const authStore = useAuthStore()

interface UserForm {
  username: string
  password: string
  firstName: string
  lastName: string
  avatar?: string
}

const form = reactive<UserForm>({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  avatar: ''
})

const error = ref('')

const handleRegister = async () => {
  error.value = ''

  if (!form.firstName || !form.lastName) {
    error.value = 'Enter first and last name'
    return
  }

  if (!form.username || !form.password) {
    error.value = 'Enter login and password'
    return
  }

  const success = await authStore.register(form)

  if (success) {
    router.push('/')
  } else {
    error.value = 'Registration failed. Try again'
  }
}

const resetForm = () => {
  Object.assign(form, {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    avatar: ''
  })
}
</script>
<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Registration</h1>

      <form @submit.prevent="handleRegister">
        <div class="input-row">
          <TextInput
            label="First Name"
            v-model="form.firstName"
          />
          <TextInput
            label="Last Name"
            v-model="form.lastName"
          />
        </div>

        <div class="input-row mt">
          <TextInput
            label="Username"
            v-model="form.username"
          />
        </div>

        <div class="input-row mt">
          <TextInput
            label="Password"
            v-model="form.password"
            type="password"
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" class="btn-login mt">Register</button>
      </form>
    </div>
  </div>
</template>
<style>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e7f1f1 0%, #53afea 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
}

.register-card h1 {
  margin: 0 0 30px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.input-row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -7.5px;
  margin-right: -7.5px;
}

.input-row > * {
  flex: 1 0 0%;
  padding-left: 7.5px;
  padding-right: 7.5px;
}

.mt {
  margin-top: 8px;
}

.btn-login {
  width: 100%;
  padding: 14px 24px;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-login::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: left 0.5s ease;
}

.btn-login:hover::before {
  left: 100%;
}

.btn-login:hover {
  background: #2563eb;
}
</style>
