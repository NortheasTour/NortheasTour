<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-teal-900">
          {{ isLogin ? 'Entrar no NortheasTour' : 'Criar Nova Conta' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <button @click="toggleMode" class="font-medium text-teal-600 hover:text-teal-500">
            {{ isLogin ? 'registre-se agora' : 'entre na sua conta existente' }}
          </button>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          
          <div v-if="!isLogin">
            <label class="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input v-model="form.name" type="text" required
                   class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">E-mail</label>
            <input v-model="form.email" type="email" required
                   class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Senha</label>
            <input v-model="form.password" type="password" required
                   class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
          </div>

          <!-- Campo de Código de Guia -->
          <div v-if="!isLogin">
            <label class="block text-sm font-medium text-gray-700">
              Código de Guia (opcional - para ser Guia)
            </label>
            <input v-model="form.codigoguia" type="text" placeholder="018365"
                   class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
            <p class="text-xs text-gray-500 mt-1">Use <strong>018365</strong> para virar Guia</p>
          </div>
        </div>

        <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50">
          {{ isLoading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar Conta') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isLogin = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  codigoguia: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
  form.value.password = ''
  if (isLogin.value) {
    form.value.name = ''
    form.value.codigoguia = ''
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    if (isLogin.value) {
      await authStore.login({
        email: form.value.email,
        password: form.value.password
      })
    } else {
      const payload: any = {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        password: form.value.password
      }

      // Envia o código somente se foi preenchido
      if (form.value.codigoguia?.trim()) {
        payload.codigoguia = form.value.codigoguia.trim()
      }

      await authStore.register(payload)
    }
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.response?.data?.message || 
                        error.message || 
                        'Erro ao processar solicitação. Verifique os dados.'
  } finally {
    isLoading.value = false
  }
}
</script>