<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const itineraries = ref<any[]>([]);
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  try {
    const { data } = await api.get('/itineraries');
    itineraries.value = data;
  } catch (error) {
    console.error('Falha ao buscar roteiros', error);
  }
});

const filteredItineraries = computed(() => {
  if (authStore.isGuia) return itineraries.value;
  return itineraries.value.filter(itinerary => itinerary.userId === authStore.user?.id);
});
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Roteiros</h1>
      <button @click="router.push('/roteiros/new')" class="bg-teal-600 text-white px-4 py-2 rounded">
        Criar Novo Roteiro
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="roteiro in filteredItineraries" 
        :key="roteiro.id" 
        @click="router.push(`/roteiros/${roteiro.id}`)"
        class="border rounded shadow-sm p-4 cursor-pointer hover:shadow-md transition"
      >
        <h2 class="text-xl font-bold mb-2">{{ roteiro.title }}</h2>
        <p class="text-gray-600 truncate">{{ roteiro.description }}</p>
        <span class="text-sm font-semibold text-teal-700 mt-2 block">{{ roteiro.duracaoDias }} dias</span>
      </div>
    </div>
  </div>
</template>