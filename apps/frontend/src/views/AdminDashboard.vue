<script setup lang="ts">
import { computed, ref } from 'vue'

type ReviewStatus = 'Em Análise' | 'Publicado' | 'Rascunho' | 'Rejeitado'

type PendingRoute = {
  id: number
  title: string
  author: string
  city: string
  submittedAt: string
  status: ReviewStatus
  notes: string
}

const routes = ref<PendingRoute[]>([
  {
    id: 11,
    title: 'Caminho do Caranguejo',
    author: 'Equipe NT',
    city: 'Mossoró - RN',
    submittedAt: '06/07/2026',
    status: 'Em Análise',
    notes: 'Precisando validar geolocalização e capa principal.',
  },
  {
    id: 12,
    title: 'Roteiro das Águas Claras',
    author: 'Romulo C.',
    city: 'João Pessoa - PB',
    submittedAt: '07/07/2026',
    status: 'Em Análise',
    notes: 'Revisão de conteúdo e confirmação de pontos associados.',
  },
  {
    id: 13,
    title: 'Experiência Serra da Capivara',
    author: 'Cauã M.',
    city: 'São Raimundo Nonato - PI',
    submittedAt: '07/07/2026',
    status: 'Rascunho',
    notes: 'Aguardando envio final do anexo e descrição expandida.',
  },
])

const queue = computed(() => routes.value.filter((item) => item.status === 'Em Análise'))

function approveRoute(id: number) {
  routes.value = routes.value.map((item) => (item.id === id ? { ...item, status: 'Publicado' } : item))
}

function rejectRoute(id: number) {
  routes.value = routes.value.map((item) => (item.id === id ? { ...item, status: 'Rejeitado' } : item))
}
</script>

<template>
  <section class="admin-layout">
    <header class="admin-hero">
      <div>
        <span class="eyebrow">Painel do administrador</span>
        <h1>Filas de validação de roteiros e pontos turísticos.</h1>
        <p>
          O painel concentra aprovações rápidas e deixa explícito o status atual de cada envio.
        </p>
      </div>

      <div class="stats-panel">
        <article>
          <strong>{{ queue.length }}</strong>
          <span>itens em análise</span>
        </article>
        <article>
          <strong>{{ routes.filter((item) => item.status === 'Publicado').length }}</strong>
          <span>publicados</span>
        </article>
        <article class="coming-soon">
          <span class="badge">Funcionalidade em Análise</span>
          <span>Gráficos, métricas avançadas e exportação de PDF.</span>
        </article>
      </div>
    </header>

    <section class="content-card">
      <div class="section-title">
        <h2>Fila de revisão</h2>
        <span class="badge subtle">Somente registros em análise</span>
      </div>

      <div class="review-grid">
        <article v-for="item in queue" :key="item.id" class="review-card">
          <header>
            <div>
              <span class="status-pill">{{ item.status }}</span>
              <h3>{{ item.title }}</h3>
            </div>
            <strong>{{ item.city }}</strong>
          </header>

          <p>{{ item.notes }}</p>

          <dl>
            <div>
              <dt>Autor</dt>
              <dd>{{ item.author }}</dd>
            </div>
            <div>
              <dt>Enviado em</dt>
              <dd>{{ item.submittedAt }}</dd>
            </div>
          </dl>

          <div class="actions-row">
            <button type="button" class="approve-button" @click="approveRoute(item.id)">Aprovar (Publicar)</button>
            <button type="button" class="reject-button" @click="rejectRoute(item.id)">Rejeitar</button>
          </div>
        </article>
      </div>

      <div v-if="queue.length === 0" class="empty-state">
        <h3>Nenhum item aguardando revisão.</h3>
        <p>Quando novos envios chegarem, eles serão exibidos aqui com ações rápidas.</p>
      </div>
    </section>

    <section class="content-card">
      <div class="section-title">
        <h2>Visão geral da base</h2>
        <span class="badge subtle">Resumo local</span>
      </div>

      <div class="list-overview">
        <article v-for="item in routes" :key="`${item.id}-${item.status}`" class="overview-row">
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.city }} · {{ item.author }}</p>
          </div>
          <span class="status-chip">{{ item.status }}</span>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.admin-layout {
  display: grid;
  gap: 1.2rem;
}

.admin-hero,
.content-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 26px;
  background: rgba(9, 18, 31, 0.78);
  backdrop-filter: blur(18px);
}

.admin-hero {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  padding: 1.8rem;
}

.admin-hero h1,
.section-title h2,
.review-card h3 {
  margin: 0.4rem 0 0.6rem;
}

.admin-hero p,
.review-card p,
.overview-row p,
.empty-state p {
  color: #9fb0c6;
}

.stats-panel {
  display: grid;
  gap: 0.85rem;
  min-width: 300px;
}

.stats-panel article,
.coming-soon,
.empty-state {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
}

.stats-panel strong {
  display: block;
  font-size: 1.8rem;
}

.badge,
.badge.subtle,
.status-pill,
.status-chip {
  width: fit-content;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.badge {
  background: rgba(69, 170, 197, 0.14);
  color: #8fe3fb;
}

.badge.subtle,
.status-chip {
  background: rgba(255, 255, 255, 0.08);
  color: #dfe8f4;
}

.content-card {
  padding: 1.5rem;
}

.section-title,
.review-card header,
.overview-row,
.actions-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.review-grid,
.list-overview {
  display: grid;
  gap: 1rem;
}

.review-card {
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.status-pill {
  display: inline-flex;
  background: rgba(251, 191, 36, 0.14);
  color: #fde68a;
}

dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 0;
}

dt {
  color: #7e90a7;
  font-size: 0.82rem;
}

dd {
  margin: 0.2rem 0 0;
  font-weight: 600;
}

.actions-row button {
  padding: 0.85rem 1rem;
  border-radius: 16px;
  color: #eef4fb;
}

.approve-button {
  background: rgba(74, 222, 128, 0.16);
}

.reject-button {
  background: rgba(248, 113, 113, 0.16);
}

.overview-row {
  padding: 1rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 1024px) {
  .admin-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .section-title,
  .review-card header,
  .overview-row,
  .actions-row,
  dl {
    flex-direction: column;
    align-items: flex-start;
    grid-template-columns: 1fr;
  }
}
</style>