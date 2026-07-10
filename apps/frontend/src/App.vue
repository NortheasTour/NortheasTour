<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <NavigationMenu />
    
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// É obrigatório importar o componente aqui no script setup
import NavigationMenu from './components/NavigationMenu.vue'
</script>