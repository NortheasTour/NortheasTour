<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const itineraries = ref<any[]>([]);
const loading = ref(true);
const errorMessage = ref('');
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  try {
    const { data } = await api.get('/itineraries');
    itineraries.value = data;
  } catch (error) {
    console.error('Falha ao buscar roteiros', error);
    errorMessage.value = 'Não foi possível carregar os roteiros. Atualize a página ou entre novamente.';
  } finally {
    loading.value = false;
  }
});

const filteredItineraries = computed(() => authStore.isGuia ? itineraries.value : itineraries.value.filter((itinerary) => itinerary.userId === authStore.user?.id));
</script>

<template>
  <div class="page-shell">
    <div class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Planejamento de viagem</p>
        <h1 class="section-title mt-2">{{ authStore.isGuia ? 'Roteiros em Geral' : 'Meus Roteiros' }}</h1>
        <p class="section-subtitle">{{ authStore.isGuia ? 'Acompanhe todos os roteiros criados na plataforma.' : 'Organize suas viagens e reveja seus destinos favoritos.' }}</p>
      </div>
      <button @click="router.push('/roteiros/new')" class="btn-primary">+ Criar roteiro</button>
    </div>

    <p v-if="loading" class="surface-card p-8 text-center text-slate-500">Carregando roteiros...</p>
    <p v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{{ errorMessage }}</p>
    <div v-else-if="filteredItineraries.length === 0" class="surface-card p-10 text-center">
      <p class="text-lg font-semibold text-slate-800">Nenhum roteiro encontrado</p>
      <p class="mt-2 text-sm text-slate-500">Comece criando um roteiro com os lugares que quer visitar.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <button v-for="roteiro in filteredItineraries" :key="roteiro.id" @click="router.push(`/roteiros/${roteiro.id}`)" class="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg">
        <div class="flex items-start justify-between gap-3">
          <h2 class="text-xl font-bold text-slate-900 group-hover:text-teal-700">{{ roteiro.title }}</h2>
          <span class="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">{{ roteiro.duracaoDias }} dias</span>
        </div>
        <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{{ roteiro.description || 'Sem descrição adicionada.' }}</p>
        <p v-if="authStore.isGuia" class="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">Criado por: <span class="font-medium text-slate-700">{{ roteiro.user?.name ?? 'Usuário não identificado' }}</span></p>
      </button>
    </div>
  </div>
</template>
