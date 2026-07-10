<template>
  <nav class="bg-teal-700 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold flex items-center gap-2">
        🗺️ NortheasTour
      </router-link>
      
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen" 
        class="md:hidden block focus:outline-none"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <div class="hidden md:flex space-x-6 items-center font-medium">
        
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/" class="hover:text-teal-200 transition">Home/Feed Público</router-link>
          <router-link to="/login" class="hover:text-teal-200 transition">Login</router-link>
          <router-link to="/login" class="bg-white text-teal-700 px-4 py-2 rounded shadow hover:bg-teal-50 transition">Criar Conta</router-link>
        </template>

        <template v-else-if="authStore.role === 'TURISTA'">
          <router-link to="/" class="hover:text-teal-200 transition">Feed de Roteiros</router-link>
          <router-link to="/my-itineraries" class="hover:text-teal-200 transition">Meus Roteiros</router-link>
          <router-link to="/itinerary/new" class="hover:text-teal-200 transition">Criar Roteiro</router-link>
          <button @click="handleLogout" class="bg-red-500 px-4 py-2 rounded hover:bg-red-600 shadow transition">Sair</button>
        </template>
        
        <template v-else-if="authStore.role === 'ADMIN'">
          <router-link to="/" class="hover:text-teal-200 transition">Feed Geral</router-link>
          <router-link to="/admin" class="hover:text-teal-200 transition">Painel do Administrador</router-link>
          <router-link to="/places/new" class="hover:text-teal-200 transition">Cadastrar Ponto Turístico</router-link>
          <button @click="handleLogout" class="bg-red-500 px-4 py-2 rounded hover:bg-red-600 shadow transition">Sair</button>
        </template>

      </div>
    </div>

    <div v-show="isMobileMenuOpen" class="md:hidden mt-4 flex flex-col space-y-3 pb-2 border-t border-teal-600 pt-4 font-medium">
        
        <template v-if="!authStore.isAuthenticated">
          <router-link @click="isMobileMenuOpen = false" to="/" class="block hover:text-teal-200">Home/Feed Público</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/login" class="block hover:text-teal-200">Login</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/login" class="block text-teal-200 font-bold">Criar Conta</router-link>
        </template>

        <template v-else-if="authStore.role === 'TURISTA'">
          <router-link @click="isMobileMenuOpen = false" to="/" class="block hover:text-teal-200">Feed de Roteiros</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/my-itineraries" class="block hover:text-teal-200">Meus Roteiros</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/itinerary/new" class="block hover:text-teal-200">Criar Roteiro</router-link>
          <button @click="handleLogout" class="text-left text-red-300 font-bold w-full">Sair</button>
        </template>

        <template v-else-if="authStore.role === 'ADMIN'">
          <router-link @click="isMobileMenuOpen = false" to="/" class="block hover:text-teal-200">Feed Geral</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/admin" class="block hover:text-teal-200">Painel do Administrador</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/places/new" class="block hover:text-teal-200">Cadastrar Ponto Turístico</router-link>
          <button @click="handleLogout" class="text-left text-red-300 font-bold w-full">Sair</button>
        </template>
        
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Certifique-se de que o caminho bate com a sua store

const authStore = useAuthStore()
const router = useRouter()
const isMobileMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  isMobileMenuOpen.value = false
  router.push('/login')
}
</script>