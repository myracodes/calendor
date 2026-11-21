-- Recos culturelles (page Reco culturelles) : films, comédies musicales, livres
-- et séries qu'on m'a conseillés, une ligne par reco, propre à chaque compte.
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  -- Onglet de la page : même liste que RecommendationCategory (src/recommendations/types.ts)
  category text not null check (category in ('film', 'musical', 'book', 'series')),
  title text not null check (btrim(title) <> ''),
  -- Qui me l'a recommandé ; vide quand ce n'est pas renseigné
  recommended_by text not null default '',
  -- Date d'ajout : ordonne la liste, la plus récente en premier
  created_at timestamptz not null default now(),
  -- Pas deux fois le même titre dans un onglet
  unique (user_id, category, title)
);

alter table public.recommendations enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres recos.
create policy "recos du compte connecté" on public.recommendations
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.recommendations to authenticated;
