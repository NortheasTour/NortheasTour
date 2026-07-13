<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Cadastrar Novo Ponto Turístico</h1>

    <form @submit.prevent="submit" class="bg-white shadow-xl rounded-2xl p-8 space-y-6">
      <div>
        <label class="block font-medium mb-1">Nome</label>
        <input v-model="form.name" required class="w-full border rounded-lg px-4 py-3" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium mb-1">Cidade</label>
          <input v-model="form.city" required class="w-full border rounded-lg px-4 py-3" />
        </div>
        <div>
          <label class="block font-medium mb-1">Categoria</label>
          <select v-model="form.category" required class="w-full border rounded-lg px-4 py-3">
            <option value="">Selecione</option>
            <option value="Praia">Praia</option>
            <option value="Natureza">Natureza</option>
            <option value="Histórico">Histórico</option>
            <option value="Culinária">Culinária</option>
            <option value="Aventura">Aventura</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block font-medium mb-1">Descrição</label>
        <textarea v-model="form.description" required rows="4" class="w-full border rounded-lg px-4 py-3"></textarea>
      </div>

      <div>
        <label class="block font-medium mb-2">Localização (Nordeste) - Clique no mapa</label>
        <div id="map" class="h-96 rounded-xl border"></div>
        <p class="text-xs text-gray-500 mt-2">O mapa está limitado ao Nordeste do Brasil</p>
      </div>

      <div class="flex gap-4">
        <button type="button" @click="$router.back()" class="flex-1 py-3 border rounded-lg">Cancelar</button>
        <button type="submit" :disabled="loading" class="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold">
          {{ loading ? 'Salvando...' : 'Cadastrar Local' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import { placesService } from '../services/places'

const router = useRouter()
const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  city: '',
  category: '',
  latitude: -5.8,
  longitude: -35.2
})

let map: any
let marker: any

onMounted(() => {
  // Limites aproximados do Nordeste
  map = L.map('map', {
    maxBounds: [
      [-2.0, -48.0],   // Norte
      [-18.0, -32.0]   // Sul
    ],
    maxBoundsViscosity: 1.0
  }).setView([-6.5, -38.0], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  marker = L.marker([form.value.latitude, form.value.longitude], { draggable: true }).addTo(map)

  marker.on('dragend', () => {
    const pos = marker.getLatLng()
    form.value.latitude = pos.lat
    form.value.longitude = pos.lng
  })

  map.on('click', (e: any) => {
    marker.setLatLng(e.latlng)
    form.value.latitude = e.latlng.lat
    form.value.longitude = e.latlng.lng
  })
})

const submit = async () => {
  loading.value = true
  try {
    await placesService.create(form.value)
    alert('Local cadastrado com sucesso!')
    router.push('/')
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erro ao salvar')
  } finally {
    loading.value = false
  }
}
</script>