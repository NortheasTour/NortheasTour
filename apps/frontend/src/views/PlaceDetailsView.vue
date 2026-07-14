<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { api } from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const place = ref<any>(null);
const reviews = ref<any[]>([]);
const mapContainer = ref<HTMLElement | null>(null);
let mapInstance: L.Map | null = null;

const newReview = ref({ nota: 5, comentario: '' });

onMounted(async () => {
  try {
    const response = await api.get(`/places/${route.params.id}`);
    place.value = response.data.data ? response.data.data : response.data;
    const reviewsResponse = await api.get(`/reviews/place/${route.params.id}`);
    reviews.value = reviewsResponse.data;
    await nextTick();
    initMap();
  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
  }
});
const initMap = () => {
  if (!mapContainer.value || place.value?.latitude == null || place.value?.longitude == null) return;
  
  mapInstance = L.map(mapContainer.value).setView([place.value.latitude, place.value.longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
  L.marker([place.value.latitude, place.value.longitude]).addTo(mapInstance);
};

onBeforeUnmount(() => mapInstance?.remove());

const submitReview = async () => {
  try {
    const response = await api.post('/reviews', {
      rating: newReview.value.nota,
      comment: newReview.value.comentario,
      placeId: place.value.id,
    });

    // Ajuste: A extração segue a mesma lógica de segurança que aplicámos 
    // no GET, caso o NestJS envolva a resposta num objeto 'data'.
    const novaReview = response.data.data ? response.data.data : response.data;

    // Atualiza a lista reativa
    reviews.value.push(novaReview);
    
    // Reseta o formulário
    newReview.value.comentario = '';
    newReview.value.nota = 5; 
  } catch (error) {
    console.error('Erro ao enviar review:', error);
    alert('Não foi possível enviar a sua avaliação. Tente novamente.');
  }
};

const deletePlace = async () => {
  if (!place.value || !window.confirm(`Excluir "${place.value.name}"? Esta ação não pode ser desfeita.`)) return;

  try {
    await api.delete(`/places/${place.value.id}`);
    await router.push('/');
  } catch (error) {
    console.error('Erro ao excluir local:', error);
    alert('Não foi possível excluir este local.');
  }
};

</script>

<template>
  <div class="p-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8" v-if="place">
    <div>
      <h1 class="text-4xl font-bold mb-2">{{ place.name }}</h1>
      <span class="inline-block bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm mb-4">{{ place.category }}</span>
      <p class="text-gray-700 mb-6">{{ place.description }}</p>

      <div v-if="authStore.isGuia" class="flex gap-3 mb-6">
        <router-link :to="`/places/${place.id}/edit`" class="bg-teal-600 text-white px-4 py-2 rounded font-semibold hover:bg-teal-700">
          Editar local
        </router-link>
        <button @click="deletePlace" class="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700">
          Excluir local
        </button>
      </div>
      
      <h3 class="text-xl font-bold mt-8 mb-4">Avaliações</h3>
      <div v-if="reviews.length" class="space-y-4 mb-8">
        <div v-for="review in reviews" :key="review.id" class="p-4 bg-gray-50 rounded">
          <p class="font-bold">Nota: {{ review.rating }}/5</p>
          <p class="italic text-gray-600">"{{ review.comment }}"</p>
        </div>
      </div>
      <p v-else class="text-gray-500 mb-8">Nenhuma avaliação ainda.</p>
      
      <div v-if="authStore.isAuthenticated" class="border p-4 rounded bg-white shadow-sm">
        <h4 class="font-bold mb-2">Deixe a sua avaliação</h4>
        <form @submit.prevent="submitReview" class="flex flex-col gap-3">
          <input type="number" v-model="newReview.nota" min="1" max="5" class="border p-2 rounded w-24" placeholder="Nota" required />
          <textarea v-model="newReview.comentario" class="border p-2 rounded" rows="3" placeholder="O que achou deste local?" required></textarea>
          <button type="submit" class="bg-teal-600 text-white py-2 rounded font-semibold">Avaliar</button>
        </form>
      </div>
      <div v-else class="p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
        <router-link to="/login" class="underline font-semibold">Faça login para avaliar este local</router-link>
      </div>
    </div>
    
    <div class="h-96 w-full rounded shadow z-0" ref="mapContainer"></div>
  </div>
</template>
