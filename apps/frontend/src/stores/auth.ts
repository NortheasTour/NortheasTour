import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ name: string; email: string } | null>(null)
  const token = ref<string | null>(localStorage.getItem('jwt_token') || null)
  const role = ref<'TURISTA' | 'ADMIN' | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function login(newToken: string, userData: any, userRole: 'TURISTA' | 'ADMIN') {
    token.value = newToken
    user.value = userData
    role.value = userRole
    localStorage.setItem('jwt_token', newToken)
  }

  function logout() {
    token.value = null
    user.value = null
    role.value = null
    localStorage.removeItem('jwt_token')
  }

  return { user, token, role, isAuthenticated, login, logout }
})