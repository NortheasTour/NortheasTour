<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-teal-700">Cadastrar Ponto Turístico</h1>
    
    <form @submit.prevent="submitPlace" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <div>
          <label class="block font-semibold">Nome do Local</label>
          <input v-model="form.name" type="text" class="w-full border p-2 rounded" required />
        </div>

        <div>
          <label class="block font-semibold">Cidade</label>
          <input v-model="form.city" type="text" class="w-full border p-2 rounded" required placeholder="Ex: Natal" />
        </div>
        
        <div>
          <label class="block font-semibold">Categoria</label>
          <select v-model="form.category" class="w-full border p-2 rounded" required>
            <option value="Natureza">Natureza</option>
            <option value="Histórico">Histórico</option>
            <option value="Culinária">Culinária</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold">Descrição</label>
          <textarea v-model="form.description" class="w-full border p-2 rounded" rows="3" required></textarea>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-gray-500">Latitude</label>
            <input :value="form.latitude" type="number" step="any" readonly class="w-full border p-2 bg-gray-100 rounded text-gray-500" />
          </div>
          <div>
            <label class="block font-semibold text-gray-500">Longitude</label>
            <input :value="form.longitude" type="number" step="any" readonly class="w-full border p-2 bg-gray-100 rounded text-gray-500" />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading" 
          class="bg-teal-600 text-white px-6 py-3 rounded w-full font-bold hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {{ isLoading ? 'Salvando...' : 'Salvar Ponto Turístico' }}
        </button>
        
        <p v-if="message" :class="{'text-green-600': isSuccess, 'text-red-600': !isSuccess}" class="mt-2 font-semibold">
          {{ message }}
        </p>
      </div>

      <div class="flex flex-col">
        <label class="block font-semibold mb-2">Selecione o local exato no mapa (Restrito ao RN):</label>
        <div id="map" class="h-96 w-full border-2 border-teal-300 rounded shadow-sm z-0"></div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { api } from '../services/api'

// Definição de estados
const isLoading = ref(false)
const message = ref('')
const isSuccess = ref(false)

const form = ref({
  name: '',
  description: '',
  city: '',
  category: 'Natureza',
  latitude: null as number | null,
  longitude: null as number | null,
})

// Referências para o Leaflet
let map: L.Map | null = null
let marker: L.Marker | null = null

onMounted(() => {
  // Limites do Rio Grande do Norte para restringir o mapa
  const rnBounds = L.latLngBounds(L.latLng(-6.9, -38.6), L.latLng(-4.8, -34.9))

  map = L.map('map', {
    center: [-5.7944, -36.5],
    zoom: 8,
    maxBounds: rnBounds,
    maxBoundsViscosity: 1.0
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    minZoom: 7
  }).addTo(map)

  map.on('click', (e: L.LeafletMouseEvent) => {
    form.value.latitude = parseFloat(e.latlng.lat.toFixed(6))
    form.value.longitude = parseFloat(e.latlng.lng.toFixed(6))

    if (marker) {
      marker.setLatLng(e.latlng)
    } else {
      marker = L.marker(e.latlng).addTo(map!)
    }
  })
})

// Limpeza de memória ao sair da página
onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})

const submitPlace = async () => {
  if (!form.value.latitude || !form.value.longitude) {
    message.value = 'Por favor, clique no mapa para definir as coordenadas.'
    isSuccess.value = false
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    // Envio dos dados como JSON, conforme escopo definido
    await api.post('/places', {
      name: form.value.name,
      description: form.value.description,
      city: form.value.city,
      category: form.value.category,
      latitude: form.value.latitude,
      longitude: form.value.longitude
    })
    
    isSuccess.value = true
    message.value = 'Local cadastrado com sucesso!'
    
    // Reset do formulário após sucesso
    form.value = { name: '', description: '', city: '', category: 'Natureza', latitude: null, longitude: null }
    if (marker && map) map.removeLayer(marker)
    marker = null
  } catch (error: any) {
    isSuccess.value = false
    message.value = error.response?.data?.message || 'Erro ao cadastrar local. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Garante que o mapa tenha uma altura visível */
#map {
  min-height: 400px;
}
</style>