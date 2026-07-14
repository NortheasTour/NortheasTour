<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../services/api';

const route = useRoute();
const router = useRouter();
const roteiro = ref<any>(null);

onMounted(async () => {
  try {
    const { data } = await api.get(`/itineraries/${route.params.id}`);
    roteiro.value = data;
  } catch (error) {
    console.error('Erro ao carregar roteiro', error);
  }
});
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto" v-if="roteiro">
    <h1 class="text-4xl font-bold text-teal-800 mb-4">{{ roteiro.title }}</h1>
    <p class="text-gray-700 mb-6">{{ roteiro.description }}</p>
    
    <h2 class="text-2xl font-semibold mb-4">Locais deste Roteiro</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div 
        v-for="place in roteiro.places" 
        :key="place.id"
        @click="router.push(`/places/${place.id}`)"
        class="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer transition"
      >
        <h3 class="font-bold text-lg">{{ place.name }}</h3>
        <p class="text-sm text-gray-500">{{ place.category }}</p>
      </div>
    </div>
  </div>
</template>