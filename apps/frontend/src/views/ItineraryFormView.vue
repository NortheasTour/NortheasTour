<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-teal-700">Criar Novo Roteiro</h1>

    <form @submit.prevent="submitItinerary" class="bg-white shadow-xl rounded-2xl p-8 space-y-6">
      <div>
        <label class="block font-medium mb-2">Título do Roteiro</label>
        <input v-model="form.title" required type="text"
               class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500" />
      </div>

      <div>
        <label class="block font-medium mb-2">Descrição</label>
        <textarea v-model="form.description" required rows="4"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500"></textarea>
      </div>

      <div>
        <label class="block font-medium mb-3">Selecione os Pontos Turísticos</label>
        <div class="max-h-80 overflow-auto border rounded-xl p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-3">
          <label v-for="p in places" :key="p.id" class="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded-lg">
            <input type="checkbox" :value="p.id" v-model="form.placeIds" class="w-5 h-5 accent-teal-600" />
            <span class="font-medium">{{ p.name }} <span class="text-gray-500 text-sm">({{ p.city }})</span></span>
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-4 pt-4">
        <button type="button" @click="$router.back()" class="px-8 py-3 border rounded-lg">Cancelar</button>
        <button type="submit" :disabled="loading || form.placeIds.length === 0"
                class="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50">
          {{ loading ? 'Criando...' : 'Criar Roteiro' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { api } from '../services/api'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const places = ref<any[]>([])

const form = ref({
  title: '',
  description: '',
  placeIds: [] as string[],
  userId: '' as string
})

onMounted(async () => {
  form.value.userId = authStore.user?.id || ''

  if (!form.value.userId) {
    alert("Erro: ID do usuário não encontrado. Faça login novamente.")
    router.push('/login')
    return
  }

  try {
    const res = await api.get('/places?limit=100')
    places.value = res.data.data || res.data
  } catch (e) {
    console.error(e)
  }
})

const submitItinerary = async () => {
  if (!form.value.userId) {
    alert("Erro: Usuário não identificado")
    return
  }

  loading.value = true

  try {
    await api.post('/itineraries', form.value)
    alert('Roteiro criado com sucesso!')
    router.push('/')
  } catch (err: any) {
    console.error(err)
    alert(err.response?.data?.message || 'Erro ao criar roteiro')
  } finally {
    loading.value = false
  }
}
</script>