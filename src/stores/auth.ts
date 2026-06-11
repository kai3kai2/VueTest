import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser } from '@/types'

const STORAGE_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  const user = ref<AuthUser | null>(stored ? (JSON.parse(stored) as AuthUser) : null)

  const isAuthenticated = computed(() => user.value !== null)

  function login(email: string, remember: boolean) {
    user.value = { email }
    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { user, isAuthenticated, login, logout }
})
