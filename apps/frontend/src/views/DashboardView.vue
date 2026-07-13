<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-teal-800">Locais do Nordeste</h1>
      <router-link v-if="isGuia" to="/places/new"
                   class="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 flex items-center gap-2">
        <span>+</span> Novo Local
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-12">Carregando locais...</div>
    <div v-else-if="error" class="text-red-500 text-center py-8">{{ error }}</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="place in places" :key="place.id" 
           class="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden">
        <div class="h-48 bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-5xl text-white">
          📍
        </div>
        <div class="p-6">
          <h3 class="font-bold text-xl mb-2">{{ place.name }}</h3>
          <p class="text-gray-600 line-clamp-2 mb-3">{{ place.description }}</p>
          <div class="flex justify-between text-sm">
            <span class="text-teal-600 font-medium">{{ place.city }}</span>
            <span class="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs">{{ place.category }}</span>
          </div>
          <router-link :to="`/places/${place.id}`" 
                       class="mt-4 inline-block text-teal-600 hover:text-teal-700 font-semibold">
            Ver no mapa →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { placesService } from '../services/places'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const places = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const isGuia = computed(() => authStore.isGuia)

onMounted(async () => {
  try {
    places.value = await placesService.getAll()
  } catch (err: any) {
    error.value = 'Erro ao carregar locais'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>