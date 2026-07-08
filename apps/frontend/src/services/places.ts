export type PlacePayload = {
  name: string
  description: string
  city: string
  category?: string
  latitude?: number
  longitude?: number
}

export type PlaceRecord = PlacePayload & {
  id: string
}

const DEFAULT_API_BASE_URL = 'http://localhost:3000'

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || DEFAULT_API_BASE_URL
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      typeof body === 'string'
        ? body
        : body && typeof body === 'object' && 'message' in body
          ? Array.isArray(body.message)
            ? body.message.join(', ')
            : String(body.message)
          : 'Não foi possível concluir a operação.'

    throw new Error(message)
  }

  return body as T
}

export async function createPlace(payload: PlacePayload) {
  const response = await fetch(`${getApiBaseUrl()}/places`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return parseResponse<PlaceRecord>(response)
}

export async function listPlaces() {
  const response = await fetch(`${getApiBaseUrl()}/places?limit=1000&page=1`)

  return parseResponse<{ data: PlaceRecord[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(response)
}

export async function getPlaceById(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/places/${id}`)

  return parseResponse<PlaceRecord>(response)
}