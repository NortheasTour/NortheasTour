<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-teal-700">Usuários Cadastrados</h1>

    <div v-if="loading" class="text-center py-10">Carregando usuários...</div>

    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-4 text-left">Nome</th>
            <th class="px-6 py-4 text-left">E-mail</th>
            <th class="px-6 py-4 text-left">Função</th>
            <th class="px-6 py-4 text-left">Criado em</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">{{ user.name }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span :class="user.role === 'GUIA' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                    class="px-3 py-1 rounded-full text-sm font-medium">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ new Date(user.createdAt).toLocaleDateString('pt-BR') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../services/api'

const users = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/users')
    users.value = res.data
  } catch (err) {
    console.error(err)
    alert('Erro ao carregar usuários')
  } finally {
    loading.value = false
  }
})
</script>