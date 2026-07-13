<template>
  <div class="max-w-6xl mx-auto p-6" v-if="place">
    <button 
      @click="$router.back()" 
      class="mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium">
      ← Voltar aos Locais
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Informações -->
      <div class="lg:col-span-8 space-y-8">
        <div>
          <h1 class="text-4xl font-bold text-gray-900">{{ place.name }}</h1>
          <div class="flex items-center gap-4 mt-4">
            <span class="bg-teal-100 text-teal-700 px-5 py-2 rounded-full text-sm font-semibold">
              {{ place.category }}
            </span>
            <span class="text-gray-600 text-lg">{{ place.city }}</span>
          </div>
        </div>

        <p class="text-lg text-gray-700 leading-relaxed">{{ place.description }}</p>

        <!-- Mapa -->
        <div class="bg-white rounded-2xl overflow-hidden border shadow">
          <div class="p-4 border-b bg-gray-50">
            <h3 class="font-semibold text-lg">Localização no Mapa</h3>
          </div>
          <div id="map" class="h-[460px]"></div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-4">
        <div class="bg-white p-6 rounded-2xl shadow sticky top-6">
          <h3 class="font-semibold mb-4">Informações</h3>
          <div class="space-y-4 text-sm">
            <div>
              <span class="text-gray-500">Coordenadas:</span><br>
              <span class="font-mono">{{ place.latitude?.toFixed(5) }}, {{ place.longitude?.toFixed(5) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import { placesService } from '../services/places'

const route = useRoute()
const place = ref<any>(null)

onMounted(async () => {
  try {
    const id = route.params.id as string
    place.value = await placesService.getById(id)
    
    // Aguarda o DOM atualizar
    await nextTick()
    initMap()
  } catch (err) {
    console.error("Erro ao carregar local:", err)
  }
})

const initMap = () => {
  if (!place.value) return

  const mapElement = document.getElementById('map')
  if (!mapElement) {
    console.error("Elemento #map não encontrado")
    return
  }

  const map = L.map('map').setView(
    [place.value.latitude, place.value.longitude], 
    15
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  L.marker([place.value.latitude, place.value.longitude])
    .addTo(map)
    .bindPopup(`<strong>${place.value.name}</strong><br>${place.value.city}`)
    .openPopup()
}
</script>