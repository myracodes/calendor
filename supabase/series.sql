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
  -- Dernier épisode vu : saison et épisode dans la saison, tous
  -- deux vides tant que la série n'est pas commencée
  last_watched_season integer check (last_watched_season >= 1),
  last_watched_episode integer check (last_watched_episode >= 1),
  -- Série terminée pour de bon (aucune suite prévue) ; false = une suite peut
  -- encore sortir, la série est seulement « à jour » une fois tout vu
  finished boolean not null default false,
  created_at timestamptz not null default now(),
  -- Dernière modification (progression, saisons, nom…) : tient l'ordre de la
  -- liste, la plus récente en premier. Mise à jour par le trigger ci-dessous.
  updated_at timestamptz not null default now(),
  -- Pas deux séries du même nom pour un même compte
  unique (user_id, name),
  constraint series_last_watched_complete
    check ((last_watched_season is null) = (last_watched_episode is null))
);

-- Remet updated_at à l'heure à chaque modification d'une ligne.
create function public.set_series_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger series_set_updated_at
  before update on public.series
  for each row execute function public.set_series_updated_at();

alter table public.series enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres séries.
create policy "séries du compte connecté" on public.series
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.series to authenticated;

-- Migration d'une table créée avant l'onglet Suivi (sans les colonnes
-- last_watched_*) : à exécuter une fois, seule, dans le SQL editor.
--
-- alter table public.series
--   add column last_watched_season integer check (last_watched_season >= 1),
--   add column last_watched_episode integer check (last_watched_episode >= 1),
--   add constraint series_last_watched_complete
--     check ((last_watched_season is null) = (last_watched_episode is null));

-- Migration d'une table créée avant la case « Série terminée » (sans la
-- colonne finished) : à exécuter une fois, seule, dans le SQL editor.
--
-- alter table public.series
--   add column finished boolean not null default false;

-- Migration d'une table créée avant le tri par dernière modification (sans la
-- colonne updated_at) : à exécuter une fois, seule, dans le SQL editor. Les
-- séries existantes partent de leur date de création, avant que le trigger ne
-- prenne le relais.
--
-- alter table public.series
--   add column updated_at timestamptz not null default now();
-- update public.series set updated_at = created_at;
-- create function public.set_series_updated_at() returns trigger
--   language plpgsql as $$
-- begin
--   new.updated_at := now();
--   return new;
-- end;
-- $$;
-- create trigger series_set_updated_at
--   before update on public.series
--   for each row execute function public.set_series_updated_at();
