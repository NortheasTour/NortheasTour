<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <nav class="bg-teal-700 text-white p-4 flex justify-between items-center shadow-md">
    <div class="font-bold text-xl cursor-pointer" @click="router.push('/')">
      NortheasTour
    </div>
    <div class="flex gap-4 items-center">
      <router-link to="/" class="hover:text-teal-200">Explorar Locais</router-link>
      
      <template v-if="!authStore.isAuthenticated">
        <router-link to="/login" class="hover:text-teal-200">Entrar</router-link>
      </template>
      
      <template v-else>
        <router-link to="/roteiros" class="hover:text-teal-200">Meus Roteiros</router-link>
        <router-link to="/roteiros/new" class="hover:text-teal-200">Criar Roteiro</router-link>
        
        <template v-if="authStore.isGuia">
          <router-link to="/places/new" class="hover:text-teal-200">Registrar Local</router-link>
          <router-link to="/users" class="hover:text-teal-200">Ver Utilizadores</router-link>
        </template>
        
        <router-link to="/profile" class="hover:text-teal-200">Editar Perfil</router-link>
        <button @click="handleLogout" class="hover:text-red-300 transition">Sair</button>
        
        <div class="ml-4 px-3 py-1 bg-teal-800 rounded text-sm font-semibold">
          Olá, {{ authStore.user?.name }} ({{ authStore.user?.role === 'GUIA' ? 'Guia' : 'Turista' }})
        </div>
      </template>
    </div>
  </nav>
</template>