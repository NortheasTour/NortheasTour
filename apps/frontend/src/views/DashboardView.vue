<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Explorar Roteiros do Nordeste</h1>
    
    <div class="flex space-x-4 mb-8">
      <button class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Todos</button>
      <button class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Culinária</button>
      <button class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Histórico</button>
      <button class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Natureza</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="border rounded-lg overflow-hidden shadow-sm">
        <div class="h-40 bg-teal-100 flex items-center justify-center text-teal-800">
          Imagem do Roteiro
        </div>
        <div class="p-4">
          <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2 inline-block">Publicado</span>
          <h2 class="text-xl font-bold mb-2">Trilhas Potiguares</h2>
          <p class="text-gray-600 mb-4">Descubra as melhores rotas da natureza no RN.</p>
          <router-link :to="`/places/${i}`" class="text-teal-600 font-semibold hover:underline">Ver Detalhes</router-link>
        </div>
      </div>
    </div>
  </div>
</template>