import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type UserRole = 'TURISTA' | 'ADMIN'

type AuthSession = {
  token: string
  role: UserRole
  name: string
  email: string
}

type Credentials = {
  name: string
  email: string
  password: string
  role: UserRole
}

const STORAGE_KEY = 'northeasTour.auth'

function readSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function persistSession(session: AuthSession | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

function createMockToken(email: string, role: UserRole) {
  return `jwt.${role.toLowerCase()}.${btoa(email)}.${Date.now()}`
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<AuthSession | null>(readSession())

  const token = computed(() => session.value?.token ?? '')
  const role = computed(() => session.value?.role ?? null)
  const name = computed(() => session.value?.name ?? '')
  const email = computed(() => session.value?.email ?? '')
  const isAuthenticated = computed(() => Boolean(session.value?.token))
  const isAdmin = computed(() => session.value?.role === 'ADMIN')
  const isTourist = computed(() => session.value?.role === 'TURISTA')
  const roleLabel = computed(() => {
    if (session.value?.role === 'ADMIN') return 'ADMIN / GUIA LOCAL'
    if (session.value?.role === 'TURISTA') return 'TURISTA'
    return 'Visitante'
  })

  function setSession(nextSession: AuthSession | null) {
    session.value = nextSession
    persistSession(nextSession)
  }

  function signIn(credentials: Credentials) {
    const nextSession: AuthSession = {
      token: createMockToken(credentials.email, credentials.role),
      role: credentials.role,
      name: credentials.name.trim() || credentials.email.split('@')[0] || 'Usuário',
      email: credentials.email.trim().toLowerCase(),
    }

    setSession(nextSession)
    return nextSession
  }

  function register(credentials: Credentials) {
    return signIn(credentials)
  }

  function logout() {
    setSession(null)
  }

  return {
    session,
    token,
    role,
    name,
    email,
    isAuthenticated,
    isAdmin,
    isTourist,
    roleLabel,
    signIn,
    register,
    logout,
  }
})