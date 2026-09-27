-- Séries suivies (page Séries) : une ligne par série, propre à chaque compte.
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.series (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null check (btrim(name) <> ''),
  -- Tableau ordonné des saisons { "episodeCount": 12 } — même forme que Season[]
  -- (src/series/types.ts). Le numéro d'une saison est sa position (1re = saison 1).
  seasons jsonb not null default '[]'::jsonb check (jsonb_typeof(seasons) = 'array'),
  created_at timestamptz not null default now(),
  -- Pas deux séries du même nom pour un même compte
  unique (user_id, name)
);

alter table public.series enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres séries.
create policy "séries du compte connecté" on public.series
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.series to authenticated;
