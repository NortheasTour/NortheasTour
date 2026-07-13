<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="col-span-2 space-y-6">
      <h1 class="text-4xl font-bold">Trilhas Potiguares</h1>
      <span class="bg-teal-100 text-teal-800 px-3 py-1 rounded">Natureza</span>
      
      <p class="text-lg text-gray-700">Uma viagem inesquecível pelas dunas e trilhas do Rio Grande do Norte.</p>

      <div class="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded flex items-center">
        <span class="mr-2">☁️</span>
        <strong>Previsão do Tempo em Tempo Real (Coming Soon - OpenWeatherMap)</strong>
      </div>

      <div>
        <h3 class="text-xl font-bold mb-2">Localização</h3>
        <div id="map-readonly" class="h-64 w-full bg-gray-200 rounded border flex justify-center items-center">
          <span class="text-gray-500">Mapa Leaflet Renderizado Aqui (Pin fixo nas coordenadas)</span>
        </div>
      </div>
      
      <div>
        <h3 class="text-xl font-bold mb-4">Avaliações (Reviews)</h3>
        <div class="bg-white p-4 border rounded shadow-sm">
          <p class="font-bold">João Silva <span class="text-yellow-500">⭐⭐⭐⭐⭐</span></p>
          <p class="text-gray-600">Lugar incrível! A vista é maravilhosa.</p>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <button class="w-full bg-teal-600 text-white py-3 rounded font-bold hover:bg-teal-700">Favoritar Roteiro</button>
      <button disabled class="w-full bg-gray-300 text-gray-500 py-3 rounded font-bold cursor-not-allowed">
        📄 Exportar Roteiro em PDF (Coming Soon)
      </button>
    </div>
  </div>
</template>