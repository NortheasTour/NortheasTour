<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">Criar Novo Roteiro</h1>
    
    <div class="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-gray-100 p-3 rounded">
      <span class="font-bold text-teal-600">Rascunho</span>
      <span>→</span>
      <span>Em Análise</span>
      <span>→</span>
      <span>Publicado</span>
    </div>

    <form class="space-y-6">
      <div>
        <label class="block font-semibold">Título do Roteiro</label>
        <input type="text" class="w-full border p-2 rounded" placeholder="Ex: Fim de semana em Pipa" />
      </div>
      
      <div>
        <label class="block font-semibold">Descrição da Experiência</label>
        <textarea class="w-full border p-2 rounded h-32"></textarea>
      </div>

      <div>
        <label class="block font-semibold mb-2">Pontos Turísticos Associados</label>
        <select class="w-full border p-2 rounded text-gray-500">
          <option>Selecione os locais cadastrados no RN...</option>
        </select>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="bg-teal-600 text-white px-6 py-2 rounded font-bold hover:bg-teal-700">
          Salvar como Rascunho
        </button>
      </div>
    </form>
  </div>
</template>