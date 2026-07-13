<template>
  <nav class="bg-teal-700 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold">NortheasTour</router-link>

      <div class="flex items-center gap-6">
        <router-link to="/" class="hover:text-teal-200">Início</router-link>

        <template v-if="isAuthenticated">
          <span class="text-sm">Olá, {{ userName }}</span>

          <!-- DEBUG: Mostra se é Guia -->
          <span v-if="isGuia" class="bg-green-500 text-white text-xs px-2 py-1 rounded">GUIA</span>

          <template v-if="isGuia">
            <router-link to="/places/new" class="hover:text-teal-200">+ Local</router-link>
            <router-link to="/itinerary/new" class="hover:text-teal-200">+ Roteiro</router-link>
            <router-link to="/admin/users" class="hover:text-teal-200">Usuários</router-link>
            <router-link to="/admin" class="bg-teal-800 px-4 py-2 rounded hover:bg-teal-900 font-medium">
              Painel Guia
            </router-link>
          </template>

          <button @click="logout" class="hover:text-red-300">Sair</button>
        </template>

        <router-link v-else to="/login" class="bg-white text-teal-700 px-5 py-2 rounded font-bold hover:bg-teal-100">
          Entrar
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

console.log('🔍 NavigationMenu - AuthStore:', {
  isAuthenticated: authStore.isAuthenticated,
  isGuia: authStore.isGuia,
  user: authStore.user
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isGuia = computed(() => authStore.isGuia)
const userName = computed(() => authStore.user?.name?.split(' ')[0] || 'Usuário')

const logout = () => {
  authStore.logout()
}
</script>