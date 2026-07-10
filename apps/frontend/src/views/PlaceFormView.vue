<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Cadastrar Ponto Turístico</h1>
    
    <form @submit.prevent="submitPlace" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <div>
          <label class="block font-semibold">Nome do Local</label>
          <input v-model="form.name" type="text" class="w-full border p-2 rounded" required />
        </div>
        
        <div>
          <label class="block font-semibold">Categoria</label>
          <select v-model="form.category" class="w-full border p-2 rounded">
            <option value="Natureza">Natureza</option>
            <option value="Histórico">Histórico</option>
            <option value="Culinária">Culinária</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold">Foto de Capa</label>
          <input type="file" @change="handleFileUpload" accept="image/*" class="w-full border p-2 rounded" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold">Latitude</label>
            <input v-model="form.latitude" type="text" readonly class="w-full border p-2 bg-gray-100 rounded" />
          </div>
          <div>
            <label class="block font-semibold">Longitude</label>
            <input v-model="form.longitude" type="text" readonly class="w-full border p-2 bg-gray-100 rounded" />
          </div>
        </div>

        <button type="submit" class="bg-teal-600 text-white px-6 py-3 rounded w-full font-bold">Salvar Ponto Turístico</button>
      </div>

      <div>
        <label class="block font-semibold mb-2">Selecione o local exato no mapa (Restrito ao RN):</label>
        <div id="map" class="h-96 w-full border rounded z-0"></div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const form = ref({
  name: '',
  category: 'Natureza',
  latitude: '',
  longitude: '',
  image: null as File | null
})

let map: L.Map | null = null
let marker: L.Marker | null = null

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    form.value.image = target.files[0]
  }
}

onMounted(() => {
  // Limites geográficos estritos do Rio Grande do Norte [cite: 63]
  const rnBounds = L.latLngBounds(
    L.latLng(-6.9, -38.6), // Sudoeste
    L.latLng(-4.8, -34.9)  // Nordeste
  )

  map = L.map('map', {
    center: [-5.7944, -36.5], // Centro em Natal [cite: 63]
    zoom: 8,
    maxBounds: rnBounds,
    maxBoundsViscosity: 1.0 // Impede o usuário de arrastar para fora do estado
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    minZoom: 7
  }).addTo(map)

  // Captura dinâmica de coordenadas no clique 
  map.on('click', (e: L.LeafletMouseEvent) => {
    form.value.latitude = e.latlng.lat.toFixed(6)
    form.value.longitude = e.latlng.lng.toFixed(6)

    if (marker) {
      marker.setLatLng(e.latlng)
    } else {
      marker = L.marker(e.latlng).addTo(map!)
    }
  })
})

const submitPlace = () => {
  // Implementação futura do envio via form-data (Axios) para o backend NestJS
  console.log('Enviando dados...', form.value)
}
</script>