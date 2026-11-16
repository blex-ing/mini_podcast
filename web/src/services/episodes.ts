import { supabase } from '../lib/supabase'
import type { Episode } from '../domain/episode'

const fields = 'id,user_id,source_url,title,status,created_at,duration_seconds,audio_path'

export async function listEpisodes(): Promise<Episode[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('episodes').select(fields).order('created_at', { ascending: false }).limit(30)
  if (error) throw new Error(error.message)
  return (data ?? []) as Episode[]
}

export async function createDraft(url: string, title: string, userId: string): Promise<Episode> {
  if (!supabase) throw new Error('Conecta Supabase para guardar episodios.')
  const { data, error } = await supabase.from('episodes')
    .insert({ user_id: userId, source_url: url, title: title.trim() || new URL(url).hostname, status: 'draft' })
    .select(fields).single()
  if (error) throw new Error(error.message)
  return data as Episode
}
