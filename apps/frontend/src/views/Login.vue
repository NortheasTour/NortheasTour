<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { type UserRole, useAuthStore } from '@/stores/auth'

type Mode = 'login' | 'register'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const mode = ref<Mode>('login')
const loading = ref(false)
const message = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'TURISTA' as UserRole,
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isRegister = computed(() => mode.value === 'register')

function clearErrors() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
}

function validate() {
  clearErrors()

  if (isRegister.value && !form.name.trim()) errors.name = 'Informe seu nome.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'E-mail inválido.'
  if (form.password.length < 6) errors.password = 'A senha deve ter no mínimo 6 caracteres.'
  if (isRegister.value && form.password !== form.confirmPassword) {
    errors.confirmPassword = 'As senhas não conferem.'
  }

  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  loading.value = true
  message.value = ''

  window.setTimeout(() => {
    const payload = {
      name: form.name || form.email.split('@')[0] || 'Usuário',
      email: form.email,
      password: form.password,
      role: form.role,
    }

    if (isRegister.value) {
      auth.register(payload)
      message.value = 'Cadastro local concluído.'
    } else {
      auth.signIn(payload)
      message.value = 'Login concluído.'
    }

    loading.value = false
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    router.push(redirect || (auth.isAdmin ? '/admin/painel' : '/home'))
  }, 350)
}

function switchMode(nextMode: Mode) {
  mode.value = nextMode
  message.value = ''
  clearErrors()
}
</script>

<template>
  <section class="auth-layout">
    <aside class="hero-panel">
      <span class="eyebrow">Autenticação SPA</span>
      <h1>Entre ou crie sua conta para explorar o NortheasTour.</h1>
      <p>
        O estado autenticado é persistido localmente via Pinia para simular o fluxo completo da aplicação.
      </p>

      <div class="hero-points">
        <article>
          <strong>JWT</strong>
          <span>Persistência em localStorage</span>
        </article>
        <article>
          <strong>Roles</strong>
          <span>TURISTA e ADMIN</span>
        </article>
        <article>
          <strong>Guard</strong>
          <span>Rotas públicas e protegidas</span>
        </article>
      </div>

      <div class="coming-soon-box">
        <span class="badge">Coming Soon</span>
        <p>SSO, recuperação de senha e autenticação avançada serão adicionados depois.</p>
      </div>
    </aside>

    <section class="auth-shell">
      <div class="tabs">
        <button :class="{ active: mode === 'login' }" type="button" @click="switchMode('login')">Entrar</button>
        <button :class="{ active: mode === 'register' }" type="button" @click="switchMode('register')">Cadastrar</button>
      </div>

      <form class="auth-card" @submit.prevent="handleSubmit">
        <header>
          <span class="eyebrow">{{ isRegister ? 'Cadastro' : 'Login' }}</span>
          <h2>{{ isRegister ? 'Crie sua conta' : 'Acesse sua conta' }}</h2>
          <p>Validação local, UI limpa e integração pronta para back-end posterior.</p>
        </header>

        <div v-if="isRegister" class="field">
          <label for="name">Nome completo</label>
          <input id="name" v-model="form.name" type="text" placeholder="Seu nome" />
          <small v-if="errors.name">{{ errors.name }}</small>
        </div>

        <div class="field">
          <label for="email">E-mail</label>
          <input id="email" v-model="form.email" type="email" placeholder="voce@exemplo.com" />
          <small v-if="errors.email">{{ errors.email }}</small>
        </div>

        <div class="field-grid">
          <div class="field">
            <label for="password">Senha</label>
            <input id="password" v-model="form.password" type="password" placeholder="******" />
            <small v-if="errors.password">{{ errors.password }}</small>
          </div>

          <div v-if="isRegister" class="field">
            <label for="confirmPassword">Confirmar senha</label>
            <input id="confirmPassword" v-model="form.confirmPassword" type="password" placeholder="******" />
            <small v-if="errors.confirmPassword">{{ errors.confirmPassword }}</small>
          </div>
        </div>

        <div class="field">
          <label for="role">Perfil</label>
          <select id="role" v-model="form.role">
            <option value="TURISTA">Turista</option>
            <option value="ADMIN">Admin / Guia Local</option>
          </select>
        </div>

        <p v-if="message" class="message">{{ message }}</p>

        <button class="submit-button" type="submit" :disabled="loading">
          {{ loading ? 'Processando...' : isRegister ? 'Criar conta' : 'Entrar' }}
        </button>
      </form>
    </section>
  </section>
</template>

<style scoped>
.auth-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1.5rem;
}

.hero-panel,
.auth-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background: rgba(9, 18, 31, 0.78);
  backdrop-filter: blur(18px);
}

.hero-panel {
  padding: 2rem;
}

.hero-panel h1,
.auth-card h2 {
  margin: 0.5rem 0 0.75rem;
  line-height: 1.1;
}

.hero-panel p,
.auth-card p,
.message {
  color: #9fb0c6;
}

.hero-points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin: 1.4rem 0;
}

.hero-points article,
.coming-soon-box {
  padding: 1rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.hero-points strong,
.hero-points span {
  display: block;
}

.coming-soon-box {
  display: grid;
  gap: 0.5rem;
}

.badge {
  width: fit-content;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  background: rgba(69, 170, 197, 0.15);
  color: #8fe3fb;
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-shell {
  display: grid;
  gap: 1rem;
}

.tabs {
  display: inline-flex;
  width: fit-content;
  padding: 0.3rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
}

.tabs button {
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  color: #dfe8f4;
  background: transparent;
}

.tabs button.active {
  color: #08111d;
  background: linear-gradient(135deg, #45aac5, #f59e0b);
}

.auth-card {
  display: grid;
  gap: 1rem;
  padding: 1.8rem;
}

.field,
.field-grid {
  display: grid;
  gap: 0.45rem;
}

.field-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

label {
  font-weight: 600;
  color: #f3f7fb;
}

input,
select,
button {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

input,
select {
  width: 100%;
  padding: 0.95rem 1rem;
  color: #f6fbff;
  background: rgba(255, 255, 255, 0.05);
}

small {
  color: #fca5a5;
}

.submit-button {
  border: 0;
  padding: 1rem 1.15rem;
  font-weight: 700;
  color: #08111d;
  background: linear-gradient(135deg, #45aac5, #f59e0b);
}

@media (max-width: 960px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .hero-points,
  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>