-- Livres lus (page Livres) : une ligne par lecture, propre à chaque compte.
-- Un livre est soit seul (titre et autrices propres), soit le tome d'une série
-- de book_series.sql, qui porte alors le titre et les autrices.
-- À exécuter une fois dans le SQL editor du dashboard Supabase, APRÈS
-- book_series.sql.

create table public.books (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  -- Titre d'un livre seul ; vide pour un tome
  title text not null default '',
  -- Autrices d'un livre seul, dans l'ordre de la couverture ; vide pour un tome
  authors text[] not null default '{}',
  -- Année de lecture (pas encore la date complète) ; 1900 écarte une faute de
  -- frappe, même borne que FIRST_READ_YEAR (src/books/readYear.ts)
  read_year integer not null check (read_year >= 1900),
  -- Lecture pas encore terminée
  in_progress boolean not null default false,
  -- Série dont le livre est un tome ; supprimer la série supprime ses tomes
  series_id uuid references public.book_series on delete cascade,
  -- Numéro du tome dans sa série
  volume integer check (volume >= 1),
  -- Date d'ajout : ordonne les livres d'une même année, dans l'ordre d'ajout
  created_at timestamptz not null default now(),
  constraint books_series_volume_complete
    check ((series_id is null) = (volume is null)),
  constraint books_standalone_described
    check (series_id is not null or (btrim(title) <> '' and cardinality(authors) >= 1)),
  -- Un tome n'est enregistré qu'une fois
  constraint books_series_id_volume_key unique (series_id, volume)
);

alter table public.books enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres livres, et ne range un
-- tome que dans l'une de ses propres séries.
create policy "livres du compte connecté" on public.books
  for all to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and (series_id is null or exists (
      select 1 from public.book_series
      where book_series.id = series_id and book_series.user_id = auth.uid()
    ))
  );

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.books to authenticated;

-- Migration d'une table créée avant la case « En cours » (sans la colonne
-- in_progress) : à exécuter une fois, seule, dans le SQL editor. Les livres
-- déjà enregistrés sont considérés comme terminés.
--
-- alter table public.books
--   add column in_progress boolean not null default false;

-- Migration d'une table créée avant les séries (sans la colonne series_id) :
-- exécuter d'abord book_series.sql, puis ceci, une fois, dans le SQL editor.
-- Les livres déjà enregistrés restent des livres seuls.
--
-- alter table public.books
--   drop constraint books_title_check,
--   drop constraint books_authors_check,
--   alter column title set default '',
--   alter column authors set default '{}',
--   add column series_id uuid references public.book_series on delete cascade,
--   add column volume integer check (volume >= 1),
--   add constraint books_series_volume_complete
--     check ((series_id is null) = (volume is null)),
--   add constraint books_standalone_described
--     check (series_id is not null or (btrim(title) <> '' and cardinality(authors) >= 1)),
--   add constraint books_series_id_volume_key unique (series_id, volume);
-- alter policy "livres du compte connecté" on public.books
--   with check (
--     user_id = auth.uid()
--     and (series_id is null or exists (
--       select 1 from public.book_series
--       where book_series.id = series_id and book_series.user_id = auth.uid()
--     ))
--   );
