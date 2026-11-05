-- Séries de livres (BD, mangas, romans en plusieurs tomes… page Livres) : une
-- ligne par série, propre à chaque compte. Les tomes lus sont des lignes de
-- `books` qui pointent vers leur série (voir books.sql).
-- À exécuter une fois dans le SQL editor du dashboard Supabase, AVANT books.sql
-- (ou avant sa migration « séries ») : `books` fait référence à cette table.

create table public.book_series (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null check (btrim(name) <> ''),
  -- Autrices de la série, dans l'ordre de la couverture, une au moins ; les
  -- tomes n'en ont pas de propres
  authors text[] not null check (cardinality(authors) >= 1),
  -- Nombre de tomes parus : à la création, le numéro du premier tome ajouté
  -- (1 le plus souvent). Vide s'il est effacé dans le formulaire de la série
  -- (on ne sait alors pas si la série est « à jour »)
  published_volumes integer check (published_volumes >= 1),
  -- Œuvre complète : plus aucun tome ne sortira. Une fois tout lu, la série
  -- est « terminée » et pas seulement « à jour »
  complete boolean not null default false,
  -- Lecture arrêtée en route
  abandoned boolean not null default false,
  created_at timestamptz not null default now(),
  -- Pas deux séries du même nom pour un même compte : le formulaire d'ajout
  -- retrouve la série par son nom
  unique (user_id, name)
);

alter table public.book_series enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres séries.
create policy "séries de livres du compte connecté" on public.book_series
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.book_series to authenticated;

-- Migration des séries créées avant le nombre de tomes parus par défaut (resté
-- vide) : à exécuter une fois, seule, dans le SQL editor. Leur donne pour
-- tomes parus le plus grand tome enregistré.
--
-- update public.book_series
--   set published_volumes = (
--     select max(volume) from public.books where books.series_id = book_series.id
--   )
--   where published_volumes is null;
