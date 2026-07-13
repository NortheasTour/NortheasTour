<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-teal-800">Explorar Roteiros do Nordeste</h1>
    
    <div class="flex space-x-4 mb-8">
      <button class="bg-teal-600 text-white px-4 py-2 rounded font-semibold">Todos</button>
      <button class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Culinária</button>
      <button class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Histórico</button>
      <button class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Natureza</button>
    </div>

    <div v-if="isLoading" class="text-gray-500 font-semibold text-lg">
      Carregando roteiros incríveis...
    </div>

    <div v-else-if="error" class="text-red-500 font-semibold text-lg">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="itinerary in itineraries" 
        :key="itinerary.id" 
        class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
      >
        <div class="h-40 bg-teal-100 flex items-center justify-center text-teal-800 font-bold">
          📍 Roteiro NortheasTour
        </div>
        <div class="p-4">
          <span class="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Publicado</span>
          <h2 class="text-xl font-bold mb-2 text-gray-800">{{ itinerary.title }}</h2>
          <p class="text-gray-600 mb-4 line-clamp-2">
            {{ itinerary.description || 'Sem descrição fornecida pelo autor.' }}
          </p>
          <router-link :to="`/itineraries/${itinerary.id}`" class="text-teal-600 font-bold hover:underline">
            Ver Roteiro Completo →
          </router-link>
        </div>
      </div>
      
      <div v-if="itineraries.length === 0" class="col-span-3 text-center py-10 text-gray-500">
        Nenhum roteiro encontrado. Seja o primeiro a criar um!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../services/api'

// Tipagem baseada no Prisma Schema do Backend
interface Itinerary {
  id: string
  title: string
  description: string | null
  userId: string
}

const itineraries = ref<Itinerary[]>([])
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await api.get('/itineraries')
    itineraries.value = response.data
  } catch (err) {
    error.value = 'Falha ao conectar com o servidor para buscar roteiros.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>