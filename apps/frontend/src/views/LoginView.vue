<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
            <label for="name" class="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input id="name" v-model="form.name" type="text" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="Ex: João Emanuel" />
          </div>

          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input id="email-address" v-model="form.email" type="email" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="seu@email.com" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <input id="password" v-model="form.password" type="password" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="••••••••" />
          </div>

          <div v-if="!isLogin">
            <label for="codigoguia" class="block text-sm font-medium text-gray-700">Código de Guia (Opcional)</label>
            <input id="codigoguia" v-model="form.codigoguia" type="text" class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="Se você for guia, insira o código aqui" />
          </div>
        </div>

        <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <div>
          <button type="submit" :disabled="isLoading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50">
            {{ isLoading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar Conta') }}
          </button>
        </div>
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
      // Montamos o payload apenas com os dados obrigatórios
      const payload: Record<string, string> = {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password
      }

      // Se o utilizador preencheu o código de guia, nós enviamos na requisição
      // (Se o seu DTO no NestJS estiver esperando "codigo_guia" ou "codigo", mude aqui a chave)
      if (form.value.codigoguia.trim() !== '') {
        payload.codigoguia = form.value.codigoguia.trim()
      }

      await authStore.register(payload)
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      // O NestJS mostrará erro se o código de guia for inválido, por exemplo.
      errorMessage.value = error.response.data.message || 'Erro interno no servidor.'
    } else {
      errorMessage.value = 'Não foi possível conectar com a API do NortheasTour.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>