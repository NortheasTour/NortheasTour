<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
    <div class="flex justify-between border-b mb-6 pb-2">
      <button :class="{'font-bold text-teal-600': isLogin}" @click="isLogin = true">Entrar</button>
      <button :class="{'font-bold text-teal-600': !isLogin}" @click="isLogin = false">Criar Conta</button>
    </div>

    <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
      <div class="bg-yellow-100 text-yellow-800 text-sm p-3 rounded mb-4">
        <strong>Modo de Teste:</strong> Use <b>admin</b> e senha <b>admin</b> para acessar como Administrador. Qualquer outro valor entra como Turista.
      </div>

      <div>
        <label class="block font-semibold">E-mail ou Usuário</label>
        <input v-model="form.email" type="text" class="w-full border p-2 rounded" required />
      </div>
      <div>
        <label class="block font-semibold">Senha</label>
        <input v-model="form.password" type="password" class="w-full border p-2 rounded" required />
      </div>
      <button type="submit" class="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">Acessar</button>
    </form>

    <form v-else @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block font-semibold">Nome Completo</label>
        <input v-model="form.name" type="text" class="w-full border p-2 rounded" required />
      </div>
      <div>
        <label class="block font-semibold">E-mail</label>
        <input v-model="form.email" type="email" class="w-full border p-2 rounded" required />
      </div>
      <p class="text-sm text-gray-500">A senha será gerada automaticamente e enviada ao seu e-mail.</p>
      <button type="submit" class="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">Cadastrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const isLogin = ref(true)
const form = ref({ name: '', email: '', password: '' })
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = () => {
  // 🚀 LÓGICA DE MOCK: Verifica se o usuário digitou admin/admin
  if (form.value.email === 'admin' && form.value.password === 'admin') {
    authStore.login('fake-jwt-admin-token', { name: 'Super Admin', email: 'admin@northeastour.com' }, 'ADMIN')
  } else {
    // Qualquer outra coisa loga como Turista
    authStore.login('fake-jwt-turista-token', { name: 'Turista Visitante', email: form.value.email }, 'TURISTA')
  }
  
  // Redireciona para o Feed Principal após logar
  router.push('/')
}

const handleRegister = () => {
  console.log('Persistindo via Axios...', { name: form.value.name, email: form.value.email })
  isLogin.value = true // Volta para a aba de login após "cadastrar"
}
</script>