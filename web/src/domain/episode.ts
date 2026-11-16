export type EpisodeStatus = 'draft' | 'queued' | 'processing' | 'ready' | 'failed'

export interface Episode {
  id: string
  user_id: string
  source_url: string
  title: string
  status: EpisodeStatus
  created_at: string
  duration_seconds: number | null
  audio_path: string | null
}

export function validateArticleUrl(raw: string): string {
  const value = raw.trim()
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new Error('Introduce una URL válida, por ejemplo https://ejemplo.com/articulo')
  }
  if (!['https:', 'http:'].includes(parsed.protocol)) {
    throw new Error('Solo se admiten enlaces http o https.')
  }
  if (!parsed.hostname.includes('.') || /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(parsed.hostname)) {
    throw new Error('Introduce la URL de una página pública.')
  }
  return parsed.toString()
}

export function humanDate(date: string): string {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}
