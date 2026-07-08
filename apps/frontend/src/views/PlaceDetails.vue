<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { getPlaceById, type PlaceRecord } from '@/services/places'

type Review = {
  author: string
  comment: string
  date: string
  photos: string[]
}

type PlaceDetailsModel = {
  id: string
  name: string
  category?: string
  description: string
  city: string
  coordinates: { lat?: number; lng?: number }
  reviews: Review[]
  highlights: string[]
}

const samples: PlaceDetailsModel[] = [
  {
    id: 'seed-1',
    name: 'Falésias de Canoa Quebrada',
    category: 'Natureza / Litoral',
    description: 'Mirante costeiro com trilhas leves, visual amplo e acesso fácil aos serviços turísticos da vila.',
    city: 'Aracati - CE',
    coordinates: { lat: -4.5198, lng: -37.6984 },
    highlights: ['Pôr do sol', 'Buggy', 'Praia protegida'],
    reviews: [
      {
        author: 'Lívia',
        comment: 'O mapa ajudou a entender a melhor área para descer até a praia sem pressa.',
        date: '12/06/2026',
        photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
      },
      {
        author: 'Rafael',
        comment: 'Experiência visual excelente e com boa infraestrutura para turismo leve.',
        date: '26/06/2026',
        photos: ['https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=800&q=80'],
      },
    ],
  },
  {
    id: 'seed-2',
    name: 'Centro Histórico da Ribeira',
    category: 'Cultura / Patrimônio',
    description: 'Percurso urbano com prédios históricos, cafés, museus e leitura rápida de contexto cultural.',
    city: 'Natal - RN',
    coordinates: { lat: -5.795, lng: -35.207 },
    highlights: ['Museus', 'Arquitetura', 'Gastronomia'],
    reviews: [
      {
        author: 'Patrícia',
        comment: 'As coordenadas facilitaram montar um trajeto a pé entre os pontos.',
        date: '03/07/2026',
        photos: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'],
      },
    ],
  },
  {
    id: 'seed-3',
    name: 'Açude Itans e entorno',
    category: 'Interior / Paisagem',
    description: 'Uma rota contemplativa que conecta o espelho d’água, os ateliês locais e a paisagem do Seridó.',
    city: 'Caicó - RN',
    coordinates: { lat: -6.4655, lng: -37.0973 },
    highlights: ['Contemplação', 'Ateliês', 'Circuito rural'],
    reviews: [
      {
        author: 'Mariana',
        comment: 'O pin no Leaflet torna a localização mais intuitiva para quem visita pela primeira vez.',
        date: '28/06/2026',
        photos: ['https://images.unsplash.com/photo-1515639241148-7a1c8d3e5f3a?auto=format&fit=crop&w=800&q=80'],
      },
    ],
  },
]

const route = useRoute()
const mapContainer = ref<HTMLDivElement | null>(null)
const mapError = ref('')
const leafletReady = ref(false)
const loading = ref(true)
const apiError = ref('')
const fallbackSample = samples[0]!
const activePlace = ref<PlaceDetailsModel>(fallbackSample)
let leafletMap: any = null

function normalizePlace(record: PlaceRecord) {
  const fallback = samples.find((item) => item.id === record.id)

  return {
    id: record.id,
    name: record.name,
    category: record.category ?? fallback?.category,
    description: record.description,
    city: record.city,
    coordinates: {
      lat: record.latitude ?? fallback?.coordinates.lat,
      lng: record.longitude ?? fallback?.coordinates.lng,
    },
    highlights: fallback?.highlights ?? ['Cadastro recente', 'Dados vindos do backend'],
    reviews: fallback?.reviews ?? [],
  } satisfies PlaceDetailsModel
}

function hasCoordinates(place: PlaceDetailsModel) {
  return typeof place.coordinates.lat === 'number' && typeof place.coordinates.lng === 'number'
}

async function ensureLeafletAssets() {
  if (typeof window === 'undefined') {
    return false
  }

  if ((window as Window & { L?: any }).L) {
    return true
  }

  if (!document.querySelector('link[data-northeas-tour-leaflet-style]')) {
    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    style.dataset.northeasTourLeafletStyle = 'true'
    document.head.appendChild(style)
  }

  return await new Promise<boolean>((resolve) => {
    if (document.querySelector('script[data-northeas-tour-leaflet-script]')) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async = true
    script.dataset.northeasTourLeafletScript = 'true'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

async function mountMap() {
  mapError.value = ''
  leafletReady.value = false

  if (!hasCoordinates(activePlace.value)) {
    mapError.value = 'Este local ainda não possui coordenadas cadastradas.'
    return
  }

  const loaded = await ensureLeafletAssets()
  if (!loaded || !mapContainer.value) {
    mapError.value = 'Mapa indisponível no momento.'
    return
  }

  await nextTick()

  const leaflet = (window as Window & { L?: any }).L
  if (!leaflet) {
    mapError.value = 'Leaflet não pôde ser inicializado.'
    return
  }

  if (leafletMap) {
    leafletMap.remove()
  }

  leafletMap = leaflet.map(mapContainer.value, {
    scrollWheelZoom: false,
  }).setView([activePlace.value.coordinates.lat, activePlace.value.coordinates.lng], 13)

  leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(leafletMap)

  leaflet.marker([activePlace.value.coordinates.lat, activePlace.value.coordinates.lng])
    .addTo(leafletMap)
    .bindPopup(`<strong>${activePlace.value.name}</strong><br />${activePlace.value.city}`)

  leafletReady.value = true
}

async function loadPlace() {
  loading.value = true
  apiError.value = ''

  try {
    const placeId = String(route.params.id)
    const record = await getPlaceById(placeId)
    activePlace.value = normalizePlace(record)
  } catch (error) {
    apiError.value = error instanceof Error ? error.message : 'Falha ao carregar o local.'
    const fallback = samples.find((item) => item.id === String(route.params.id)) ?? fallbackSample
    activePlace.value = fallback
  } finally {
    loading.value = false
    await mountMap()
  }
}

watch(
  () => route.params.id,
  () => {
    void loadPlace()
  },
)

onMounted(() => {
  void loadPlace()
})

onBeforeUnmount(() => {
  if (leafletMap) {
    leafletMap.remove()
  }
})
</script>

<template>
  <section class="detail-layout">
    <RouterLink class="back-link" to="/home">← Voltar para o feed</RouterLink>

    <p v-if="apiError" class="api-banner">{{ apiError }}</p>
    <p v-if="loading" class="api-banner">Carregando local do backend...</p>

    <header class="detail-hero">
      <div>
        <span class="eyebrow">Detalhes do roteiro / ponto turístico</span>
        <h1>{{ activePlace.name }}</h1>
        <p>{{ activePlace.description }}</p>
      </div>

      <aside class="detail-chipset">
        <span class="chip">{{ activePlace.category || 'Categoria não informada' }}</span>
        <span class="chip muted">{{ activePlace.city }}</span>
        <span class="chip status">Publicado</span>
      </aside>
    </header>

    <section class="content-grid">
      <article class="content-card">
        <div class="section-title">
          <h2>Informações principais</h2>
          <span class="badge">Coordenadas fornecidas</span>
        </div>

        <dl class="info-grid">
          <div>
            <dt>Nome</dt>
            <dd>{{ activePlace.name }}</dd>
          </div>
          <div>
            <dt>Categoria</dt>
            <dd>{{ activePlace.category || 'Não informada' }}</dd>
          </div>
          <div>
            <dt>Cidade</dt>
            <dd>{{ activePlace.city }}</dd>
          </div>
          <div>
            <dt>Latitude</dt>
            <dd>{{ activePlace.coordinates.lat ?? 'Não informada' }}</dd>
          </div>
          <div>
            <dt>Longitude</dt>
            <dd>{{ activePlace.coordinates.lng ?? 'Não informada' }}</dd>
          </div>
        </dl>

        <div class="highlights">
          <span v-for="highlight in activePlace.highlights" :key="highlight">{{ highlight }}</span>
        </div>
      </article>

      <article class="content-card map-card">
        <div class="section-title">
          <h2>Mapa interativo</h2>
          <span v-if="!leafletReady" class="badge subtle">Carregando Leaflet</span>
        </div>

        <div ref="mapContainer" class="map-container"></div>
        <p v-if="mapError" class="map-note error">{{ mapError }}</p>
        <p v-else class="map-note">Marcador posicionado automaticamente com base nas coordenadas.</p>
      </article>
    </section>

    <section class="content-card">
      <div class="section-title">
        <h2>Avaliações</h2>
        <span class="badge subtle">Fotos anexadas</span>
      </div>

      <div class="review-list">
        <article v-for="review in activePlace.reviews" :key="`${review.author}-${review.date}`" class="review-card">
          <header>
            <strong>{{ review.author }}</strong>
            <span>{{ review.date }}</span>
          </header>
          <p>{{ review.comment }}</p>

          <div class="photo-strip">
            <img v-for="photo in review.photos" :key="photo" :src="photo" :alt="`Foto enviada por ${review.author}`" />
          </div>
        </article>
      </div>

      <div class="coming-soon-banner">
        <span class="badge">Funcionalidade em Análise</span>
        <p>Upload de múltiplas fotos, moderação de conteúdo e ordenação inteligente das reviews.</p>
      </div>
    </section>
  </section>
</template>

<style scoped>
.detail-layout {
  display: grid;
  gap: 1.2rem;
}

.detail-hero,
.content-card,
.back-link {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 26px;
  background: rgba(9, 18, 31, 0.78);
  backdrop-filter: blur(18px);
}

.back-link {
  width: fit-content;
  padding: 0.75rem 1rem;
}

.api-banner {
  margin: 0;
  padding: 0.8rem 1rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  color: #c9d7e8;
}

.detail-hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.8rem;
}

.detail-hero h1,
.section-title h2 {
  margin: 0.5rem 0 0.6rem;
}

.detail-hero p,
.map-note,
.review-card p,
.detail-chipset {
  color: #9fb0c6;
}

.detail-chipset {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.chip,
.badge {
  width: fit-content;
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.78rem;
}

.chip.status,
.badge {
  background: rgba(69, 170, 197, 0.16);
  color: #8fe3fb;
}

.chip.muted,
.badge.subtle {
  background: rgba(255, 255, 255, 0.08);
  color: #dfe8f4;
}

.content-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 1rem;
}

.content-card {
  padding: 1.5rem;
}

.section-title,
.review-card header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 1rem 0 0;
}

dt {
  color: #7e90a7;
  font-size: 0.82rem;
}

dd {
  margin: 0.2rem 0 0;
  font-weight: 600;
}

.highlights,
.photo-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.highlights {
  margin-top: 1rem;
}

.highlights span {
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  background: rgba(255, 255, 255, 0.06);
}

.map-container {
  min-height: 360px;
  margin-top: 1rem;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(69, 170, 197, 0.12), rgba(245, 158, 11, 0.12));
}

.map-note.error {
  color: #fca5a5;
}

.review-list {
  display: grid;
  gap: 1rem;
}

.review-card {
  border-radius: 20px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
}

.review-card img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 16px;
}

.coming-soon-banner {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 1024px) {
  .detail-hero,
  .content-grid {
    flex-direction: column;
    grid-template-columns: 1fr;
  }

  .detail-chipset {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 720px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .section-title,
  .review-card header,
  .coming-soon-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>