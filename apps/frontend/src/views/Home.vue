<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { listPlaces, type PlaceRecord } from '@/services/places'

type FeedCard = {
  id: string
  title: string
  city: string
  category: string
  description: string
  status: 'Publicado'
  points: string[]
  author: string
  duration: string
}

const seedFallback: FeedCard[] = [
  {
    id: 'seed-1',
    title: 'Rota das Falésias Douradas',
    city: 'Canoa Quebrada - CE',
    category: 'Natureza / Litoral',
    description: 'Percurso costeiro com pôr do sol, mirantes e paradas gastronômicas regionais.',
    status: 'Publicado',
    points: ['Falésias', 'Praia principal', 'Passeio de buggy'],
    author: 'Equipe NT',
    duration: '2 dias',
  },
  {
    id: 'seed-2',
    title: 'Circuito Histórico da Ribeira',
    city: 'Natal - RN',
    category: 'Cultura / Patrimônio',
    description: 'Um roteiro compacto com patrimônio cultural e vista para o litoral potiguar.',
    status: 'Publicado',
    points: ['Centro histórico', 'Fortaleza dos Reis Magos', 'Mercado artesanal'],
    author: 'Equipe NT',
    duration: '1 dia',
  },
]

const places = ref<FeedCard[]>(seedFallback)
const loading = ref(true)
const errorMessage = ref('')
const search = ref('')
const cityFilter = ref('Todas')
const categoryFilter = ref('Todas')
const page = ref(1)
const pageSize = 6

function normalizePlace(place: PlaceRecord): FeedCard {
  const category = place.category?.trim() || 'Categoria em análise'

  return {
    id: place.id,
    title: place.name,
    city: place.city,
    category,
    description: place.description || 'Descrição não informada.',
    status: 'Publicado',
    points: [
      category,
      place.city.split(' - ')[0] || place.city,
      place.latitude !== undefined && place.longitude !== undefined ? 'Coordenadas cadastradas' : 'Coordenadas pendentes',
    ],
    author: 'Cadastros da plataforma',
    duration: place.latitude !== undefined && place.longitude !== undefined ? '1 dia' : 'Em breve',
  }
}

async function loadPlaces() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await listPlaces()
    places.value = response.data.length > 0 ? response.data.map(normalizePlace) : seedFallback
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Falha ao carregar locais cadastrados.'
    places.value = seedFallback
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadPlaces()
})

const cities = computed(() => ['Todas', ...new Set(places.value.map((item) => item.city))])
const categories = computed(() => ['Todas', ...new Set(places.value.map((item) => item.category))])

const filteredPlaces = computed(() => {
  const q = search.value.trim().toLowerCase()

  return places.value.filter((item) => {
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)

    const matchesCity = cityFilter.value === 'Todas' || item.city === cityFilter.value
    const matchesCategory = categoryFilter.value === 'Todas' || item.category === categoryFilter.value

    return matchesSearch && matchesCity && matchesCategory && item.status === 'Publicado'
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPlaces.value.length / pageSize)))

const pagedPlaces = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredPlaces.value.slice(start, start + pageSize)
})

function setPage(nextPage: number) {
  page.value = Math.min(Math.max(nextPage, 1), totalPages.value)
}

function resetPage() {
  page.value = 1
}
</script>

<template>
  <section class="home-grid">
    <header class="hero-strip">
      <div>
        <span class="eyebrow">Feed principal</span>
        <h1>Locais turísticos cadastrados no backend.</h1>
        <p>
          A página abaixo consome <strong>GET /places</strong>, traz os registros persistidos e aplica filtros
          visuais e paginação local sobre os dados retornados.
        </p>
      </div>

      <div class="hero-metrics">
        <article>
          <strong>{{ filteredPlaces.length }}</strong>
          <span>locais visíveis</span>
        </article>
        <article>
          <strong>{{ totalPages }}</strong>
          <span>páginas</span>
        </article>
        <article class="coming-soon">
          <span class="badge">Coming Soon</span>
          <span>Favoritos, exportação PDF e avaliações avançadas.</span>
        </article>
      </div>
    </header>

    <p v-if="loading" class="status-banner">Carregando locais cadastrados...</p>
    <p v-else-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>

    <section class="filters-card">
      <label>
        Busca
        <input v-model="search" type="search" placeholder="Nome, cidade ou categoria" @input="resetPage" />
      </label>

      <label>
        Cidade
        <select v-model="cityFilter" @change="resetPage">
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </label>

      <label>
        Categoria
        <select v-model="categoryFilter" @change="resetPage">
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </label>
    </section>

    <section class="cards-grid">
      <article v-for="item in pagedPlaces" :key="item.id" class="itinerary-card">
        <div class="card-topline">
          <span class="badge success">{{ item.status }}</span>
          <span class="route-city">{{ item.city }}</span>
        </div>

        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>

        <dl class="meta-list">
          <div>
            <dt>Categoria</dt>
            <dd>{{ item.category }}</dd>
          </div>
          <div>
            <dt>Autor</dt>
            <dd>{{ item.author }}</dd>
          </div>
          <div>
            <dt>Duração</dt>
            <dd>{{ item.duration }}</dd>
          </div>
          <div>
            <dt>Pontos</dt>
            <dd>{{ item.points.length }}</dd>
          </div>
        </dl>

        <div class="points-list">
          <span v-for="point in item.points" :key="point">{{ point }}</span>
        </div>

        <footer class="card-actions">
          <RouterLink class="primary-link" :to="`/places/${item.id}`">Ver detalhes</RouterLink>
          <button type="button" class="secondary-button">Salvar</button>
        </footer>
      </article>
    </section>

    <footer class="pagination-bar">
      <span>Página {{ page }} de {{ totalPages }}</span>
      <div>
        <button type="button" :disabled="page === 1" @click="setPage(page - 1)">Anterior</button>
        <button type="button" :disabled="page === totalPages" @click="setPage(page + 1)">Próxima</button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.home-grid {
  display: grid;
  gap: 1.3rem;
}

.hero-strip,
.filters-card,
.itinerary-card,
.pagination-bar,
.status-banner {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 26px;
  background: rgba(9, 18, 31, 0.78);
  backdrop-filter: blur(18px);
}

.status-banner {
  margin: 0;
  padding: 0.9rem 1rem;
  color: #d9e5f2;
}

.status-banner.error {
  color: #fca5a5;
}

.hero-strip {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1rem;
  padding: 1.8rem;
}

.hero-strip h1,
.itinerary-card h2 {
  margin: 0.5rem 0 0.7rem;
}

.hero-strip p,
.itinerary-card p,
.route-city,
.pagination-bar {
  color: #9fb0c6;
}

.hero-metrics {
  display: grid;
  gap: 0.85rem;
}

.hero-metrics article,
.coming-soon {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
}

.hero-metrics strong {
  display: block;
  font-size: 1.8rem;
}

.badge {
  display: inline-flex;
  width: fit-content;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  background: rgba(69, 170, 197, 0.15);
  color: #8fe3fb;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.badge.success {
  background: rgba(74, 222, 128, 0.14);
  color: #b7f7ca;
}

.filters-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding: 1rem;
}

label {
  display: grid;
  gap: 0.45rem;
  font-weight: 600;
}

input,
select,
button,
.primary-link {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

input,
select {
  width: 100%;
  padding: 0.9rem 1rem;
  color: #f4f8fc;
  background: rgba(255, 255, 255, 0.05);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.itinerary-card {
  display: grid;
  gap: 0.9rem;
  padding: 1.25rem;
}

.card-topline,
.meta-list,
.card-actions,
.pagination-bar {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.meta-list {
  margin: 0;
  flex-wrap: wrap;
}

.meta-list div {
  display: grid;
  gap: 0.2rem;
  min-width: 45%;
}

dt {
  color: #7e90a7;
  font-size: 0.82rem;
}

dd {
  margin: 0;
  font-weight: 600;
}

.points-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.points-list span {
  border-radius: 999px;
  padding: 0.4rem 0.7rem;
  background: rgba(255, 255, 255, 0.06);
  color: #d9e5f2;
  font-size: 0.84rem;
}

.primary-link,
.secondary-button,
.pagination-bar button {
  padding: 0.85rem 1rem;
  background: transparent;
  color: #eef4fb;
}

.primary-link {
  border-color: rgba(69, 170, 197, 0.4);
  background: rgba(69, 170, 197, 0.12);
}

.secondary-button,
.pagination-bar button {
  background: rgba(255, 255, 255, 0.05);
}

.pagination-bar {
  padding: 1rem 1.25rem;
}

.pagination-bar button:disabled {
  opacity: 0.45;
}

.eyebrow {
  color: #8fd7ff;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

@media (max-width: 1024px) {
  .hero-strip,
  .cards-grid,
  .filters-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .card-topline,
  .card-actions,
  .pagination-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .pagination-bar div {
    display: flex;
    gap: 0.75rem;
  }
}
</style>