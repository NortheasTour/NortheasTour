<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { createPlace } from '@/services/places'

type WorkflowStage = 'RASCUNHO' | 'EM_ANALISE' | 'PUBLICADO'

const stages: { key: WorkflowStage; label: string }[] = [
  { key: 'RASCUNHO', label: 'Rascunho' },
  { key: 'EM_ANALISE', label: 'Em Análise' },
  { key: 'PUBLICADO', label: 'Publicado' },
]

const form = reactive({
  title: '',
  description: '',
  city: '',
  category: '',
  lat: '',
  lng: '',
  type: 'Local turístico',
  stage: 'RASCUNHO' as WorkflowStage,
})

const uploadedFile = ref<File | null>(null)
const previewUrl = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)
const router = useRouter()

const progressIndex = computed(() => stages.findIndex((stage) => stage.key === form.stage))

function updateFile(event: Event) {
  const target = event.target as HTMLInputElement
  uploadedFile.value = target.files?.[0] ?? null

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }

  if (uploadedFile.value) {
    previewUrl.value = URL.createObjectURL(uploadedFile.value)
  }
}

function nextStage() {
  const nextIndex = Math.min(progressIndex.value + 1, stages.length - 1)
  const nextStage = stages[nextIndex] ?? stages[stages.length - 1]!
  form.stage = nextStage.key
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.city = ''
  form.category = ''
  form.lat = ''
  form.lng = ''
  form.type = 'Local turístico'
  form.stage = 'RASCUNHO'
  uploadedFile.value = null

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
}

async function handleSubmit() {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (!form.title.trim() || !form.description.trim() || !form.city.trim()) {
      throw new Error('Preencha nome, descrição e cidade antes de salvar.')
    }

    const createdPlace = await createPlace({
      name: form.title.trim(),
      description: form.description.trim(),
      city: form.city.trim(),
      category: form.category.trim() || undefined,
      latitude: form.lat.trim() ? Number(form.lat) : undefined,
      longitude: form.lng.trim() ? Number(form.lng) : undefined,
    })

    successMessage.value = `Local cadastrado com sucesso: ${createdPlace.name}.`

    if (uploadedFile.value) {
      successMessage.value += ' A imagem continua apenas em pré-visualização local até o upload ser implementado no backend.'
    }

    form.stage = 'EM_ANALISE'
    router.push({ name: 'place-details', params: { id: createdPlace.id } })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Falha ao cadastrar o local.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="form-layout">
    <header class="form-header">
      <div>
        <span class="eyebrow">Criação guiada</span>
        <h1>Cadastre locais turísticos com persistência no backend.</h1>
        <p>
          O formulário envia nome, descrição, cidade e coordenadas ao NestJS. O upload de imagem
          permanece como pré-visualização local até o backend receber suporte para arquivos.
        </p>
      </div>

      <aside class="workflow-card">
        <span class="badge">Máquina de estados</span>
        <div class="workflow-steps">
          <span v-for="(stage, index) in stages" :key="stage.key" :class="{ active: index <= progressIndex }">
            {{ stage.label }}
          </span>
        </div>
        <button type="button" class="secondary-button" @click="nextStage">Avançar etapa</button>
      </aside>
    </header>

    <section class="content-grid">
      <form class="content-card" @submit.prevent="handleSubmit">
        <div class="field-grid">
          <label>
            Nome do local
            <input v-model="form.title" type="text" placeholder="Ex.: Rota do litoral potiguar" />
          </label>

          <label>
            Status do cadastro
            <select v-model="form.stage">
              <option v-for="stage in stages" :key="stage.key" :value="stage.key">{{ stage.label }}</option>
            </select>
          </label>
        </div>

        <label>
          Descrição
          <textarea v-model="form.description" rows="4" placeholder="Descreva o ponto turístico"></textarea>
        </label>

        <div class="field-grid">
          <label>
            Cidade
            <input v-model="form.city" type="text" placeholder="Natal - RN" />
          </label>

          <label>
            Categoria
            <input v-model="form.category" type="text" placeholder="Praia, cultura, ecoturismo" />
          </label>
        </div>

        <div class="field-grid">
          <label>
            Latitude
            <input v-model="form.lat" type="text" placeholder="-5.795" />
          </label>

          <label>
            Longitude
            <input v-model="form.lng" type="text" placeholder="-35.207" />
          </label>
        </div>

        <label>
          Upload de imagem
          <input type="file" accept="image/*" @change="updateFile" />
        </label>

        <p v-if="uploadedFile" class="file-chip">Arquivo selecionado: {{ uploadedFile.name }}</p>

        <div class="actions-row">
          <button type="submit" class="primary-button" :disabled="submitting">
            {{ submitting ? 'Salvando...' : 'Salvar no backend' }}
          </button>
          <button type="button" class="secondary-button" @click="resetForm">Limpar</button>
        </div>

        <p v-if="successMessage" class="status-note success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="status-note error">{{ errorMessage }}</p>
      </form>

      <aside class="content-card preview-card">
        <div class="section-title">
          <h2>Pré-visualização</h2>
          <span class="badge subtle">Upload em breve</span>
        </div>

        <article class="preview-panel">
          <span class="badge success">{{ form.stage.replace('_', ' ') }}</span>
          <h3>{{ form.title || 'Título do conteúdo' }}</h3>
          <p>{{ form.description || 'A descrição aparecerá aqui após o preenchimento.' }}</p>

          <dl>
            <div>
              <dt>Tipo</dt>
              <dd>{{ form.type }}</dd>
            </div>
            <div>
              <dt>Cidade</dt>
              <dd>{{ form.city || 'Cidade ainda não informada' }}</dd>
            </div>
          </dl>

          <div v-if="previewUrl" class="image-preview">
            <img :src="previewUrl" alt="Pré-visualização do arquivo enviado" />
          </div>

          <div v-else class="placeholder-box">A imagem enviada aparecerá aqui.</div>
        </article>

        <div class="coming-soon-box">
          <span class="badge">Coming Soon</span>
          <p>Integração real com FormData, upload de múltiplos arquivos e salvamento do arquivo no backend.</p>
        </div>
      </aside>
    </section>
  </section>
</template>

<style scoped>
.form-layout {
  display: grid;
  gap: 1.25rem;
}

.form-header,
.content-card,
.workflow-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 26px;
  background: rgba(9, 18, 31, 0.78);
  backdrop-filter: blur(18px);
}

.form-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.8rem;
}

.form-header h1,
.section-title h2 {
  margin: 0.4rem 0 0.6rem;
}

.form-header p,
.preview-panel p,
.coming-soon-box {
  color: #9fb0c6;
}

.workflow-card {
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
  min-width: 280px;
}

.workflow-steps {
  display: grid;
  gap: 0.55rem;
}

.workflow-steps span {
  border-radius: 16px;
  padding: 0.75rem 0.9rem;
  background: rgba(255, 255, 255, 0.05);
}

.workflow-steps span.active {
  background: rgba(69, 170, 197, 0.14);
  color: #e4f9ff;
}

.badge {
  display: inline-flex;
  width: fit-content;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  background: rgba(69, 170, 197, 0.14);
  color: #8fe3fb;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.badge.subtle {
  background: rgba(255, 255, 255, 0.08);
  color: #dfe8f4;
}

.badge.success {
  background: rgba(74, 222, 128, 0.14);
  color: #bbf7d0;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 0.95fr;
  gap: 1rem;
}

.content-card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

.field-grid,
dl,
.actions-row {
  display: grid;
  gap: 1rem;
}

.field-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

label {
  display: grid;
  gap: 0.45rem;
  font-weight: 600;
}

input,
select,
textarea,
button {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

input,
select,
textarea {
  width: 100%;
  padding: 0.95rem 1rem;
  color: #eef4fb;
  background: rgba(255, 255, 255, 0.05);
}

textarea {
  resize: vertical;
}

.actions-row {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.primary-button,
.secondary-button {
  padding: 0.9rem 1rem;
  color: #eef4fb;
  background: rgba(255, 255, 255, 0.05);
}

.primary-button {
  color: #08111d;
  background: linear-gradient(135deg, #45aac5, #f59e0b);
}

.primary-button:disabled {
  opacity: 0.7;
}

.file-chip,
.status-note,
.coming-soon-box {
  border-radius: 18px;
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.05);
}

.status-note.success {
  color: #bbf7d0;
}

.status-note.error {
  color: #fca5a5;
}

.preview-panel {
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
}

.preview-panel h3 {
  margin: 0;
}

.preview-panel dl {
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

.image-preview img,
.placeholder-box {
  width: 100%;
  min-height: 220px;
  border-radius: 18px;
  object-fit: cover;
}

.placeholder-box {
  display: grid;
  place-items: center;
  color: #9fb0c6;
  background: linear-gradient(135deg, rgba(69, 170, 197, 0.08), rgba(245, 158, 11, 0.08));
}

.section-title {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

@media (max-width: 1024px) {
  .form-header,
  .content-grid {
    flex-direction: column;
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .field-grid,
  .actions-row,
  .preview-panel dl {
    grid-template-columns: 1fr;
  }

  .section-title {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>