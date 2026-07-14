<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const places = ref<any[]>([]);
const router = useRouter();
const mapContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  try {
    const response = await api.get('/places');
    
    // O Axios guarda a resposta da API em 'response.data'.
    // Como o back-end paginou, os itens reais vêm dentro de 'data'.
    // Logo, o nosso array de locais é 'response.data.data'.
    places.value = response.data.data || response.data; 
    
    initMap();
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
  }
});

const initMap = () => {
  if (!mapContainer.value) return;
  
  // Limites estritos do Nordeste Brasileiro
  const bounds = L.latLngBounds(L.latLng(-18.5, -48.5), L.latLng(-1.0, -34.5));
  
  const map = L.map(mapContainer.value, {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 5
  }).setView([-5.7944, -36.5], 7); // Foco em Natal/RN

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  places.value.forEach(place => {
    if (place.latitude && place.longitude) {
      const marker = L.marker([place.latitude, place.longitude]).addTo(map);
      marker.bindPopup(`<b>${place.name}</b>`).on('click', () => {
        router.push(`/places/${place.id}`);
      });
    }
  });
};
</script>

<template>
  <div class="flex flex-col h-screen">
    <div ref="mapContainer" class="flex-grow z-0"></div>
    
    <div class="p-6 bg-white shadow-inner overflow-y-auto max-h-[40vh]">
      <h2 class="text-2xl font-bold mb-4">Explorar Locais</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div 
          v-for="place in places" 
          :key="place.id"
          @click="router.push(`/places/${place.id}`)"
          class="p-4 border rounded cursor-pointer hover:border-teal-500 transition"
        >
          <h3 class="font-bold">{{ place.name }}</h3>
          <p class="text-sm text-gray-500">{{ place.category }}</p>
        </div>
      </div>
    </div>
  </div>
</template>