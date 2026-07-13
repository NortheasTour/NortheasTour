<template>
  <nav class="bg-teal-700 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold">NortheasTour</router-link>
      
      <div class="flex items-center space-x-4">
        <router-link to="/">Início</router-link>

        <!-- Menu para utilizadores logados -->
        <template v-if="isAuthenticated">
          <span class="text-sm">Olá, {{ userName }}</span>
          
          <!-- Menu restrito para Guia -->
          <router-link v-if="isGuia" to="/admin" class="bg-teal-800 px-3 py-1 rounded">
            Painel Guia
          </router-link>
          
          <button @click="handleLogout" class="text-red-200 hover:text-white">
            Sair
          </button>
        </template>

        <!-- Menu para visitantes -->
        <router-link v-else to="/login" class="bg-white text-teal-700 px-4 py-2 rounded font-bold">
          Entrar
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

// Proteção: Usamos computed para evitar erro de null no setup
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Usamos optional chaining (?.) para prevenir erro se user for null
const userName = computed(() => authStore.user?.name || 'Visitante');

// Validação de papel com segurança
const isGuia = computed(() => authStore.user?.role === 'GUIA');

const handleLogout = () => {
  authStore.logout();
};
</script>