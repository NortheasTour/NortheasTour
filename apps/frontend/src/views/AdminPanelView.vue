<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Painel do Administrador</h1>

    <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mb-8">
      🚀 <strong>Coming Soon:</strong> Gráficos Estatísticos Avançados de Acessos e Uso da Plataforma.
    </div>

    <div class="bg-white rounded shadow-sm border p-6">
      <h2 class="text-xl font-bold mb-4">Roteiros "Em Análise"</h2>
      
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-100 border-b">
            <th class="p-3">Título do Roteiro</th>
            <th class="p-3">Criador</th>
            <th class="p-3">Ações Rápidas</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="p-3">Culinária Seridoense</td>
            <td class="p-3">Turista_01</td>
            <td class="p-3 space-x-2">
              <button class="bg-green-500 text-white px-3 py-1 rounded text-sm">Aprovar (Publicar)</button>
              <button class="bg-red-500 text-white px-3 py-1 rounded text-sm">Rejeitar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>