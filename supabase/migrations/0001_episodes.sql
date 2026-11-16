-- Optional persistence backend; run only when Supabase is configured.
create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_url text not null check(length(source_url) between 10 and 2048),
  title text not null check(length(title) between 1 and 150),
  status text not null default 'draft' check(status in ('draft','queued','processing','ready','failed')),
  created_at timestamptz not null default now(),
  duration_seconds integer check(duration_seconds is null or duration_seconds >= 0),
  audio_path text
);
create index if not exists episodes_user_created_at_idx on public.episodes(user_id,created_at desc);
alter table public.episodes enable row level security;
create policy "select own episodes" on public.episodes for select to authenticated using ((select auth.uid()) = user_id);
create policy "create own drafts" on public.episodes for insert to authenticated with check ((select auth.uid()) = user_id and status = 'draft' and audio_path is null);
create policy "delete own episodes" on public.episodes for delete to authenticated using ((select auth.uid()) = user_id);
-- No direct client-side update to processing status or audio_path.
