-- Livres lus (page Livres) : une ligne par lecture, propre à chaque compte.
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.books (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null check (btrim(title) <> ''),
  -- Autrices dans l'ordre de la couverture, une au moins
  authors text[] not null check (cardinality(authors) >= 1),
  -- Année de lecture (pas encore la date complète) ; 1900 écarte une faute de
  -- frappe, même borne que FIRST_READ_YEAR (src/books/readYear.ts)
  read_year integer not null check (read_year >= 1900),
  -- Lecture pas encore terminée
  in_progress boolean not null default false,
  -- Date d'ajout : ordonne les livres d'une même année, dans l'ordre d'ajout
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres livres.
create policy "livres du compte connecté" on public.books
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.books to authenticated;

-- Migration d'une table créée avant la case « En cours » (sans la colonne
-- in_progress) : à exécuter une fois, seule, dans le SQL editor. Les livres
-- déjà enregistrés sont considérés comme terminés.
--
-- alter table public.books
--   add column in_progress boolean not null default false;
