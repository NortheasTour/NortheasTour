import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'GUIA'
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  const init = () => {
    const token = localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('user')
    if (token) accessToken.value = token
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {}
    }
  }
  init()

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isGuia = computed(() => user.value?.role === 'GUIA')

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      
      console.log("🔍 Resposta completa do login:", response.data)

      const { access_token, user: loggedUser } = response.data

      const userData: User = {
        id: loggedUser?.id || '',
        name: loggedUser?.name || credentials.email.split('@')[0],
        email: credentials.email,
        role: loggedUser?.role || 'USER'   // ← Aqui pega o role real do backend
      }

      accessToken.value = access_token
      user.value = userData

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))

      console.log("✅ Usuário logado como:", userData.role)
      router.push('/')
    } catch (err: any) {
      console.error(err)
      throw err
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await api.post('/users/cadastrar', userData)
      console.log("Resposta do cadastro:", response.data)
      await login({ email: userData.email, password: userData.password })
    } catch (err: any) {
      console.error(err)
      throw err
    }
  }

  const logout = () => {
    user.value = null
    accessToken.value = null
    localStorage.clear()
    router.push('/login')
  }

  return { 
    user, 
    isAuthenticated, 
    isGuia, 
    login, 
    register, 
    logout 
  }
})