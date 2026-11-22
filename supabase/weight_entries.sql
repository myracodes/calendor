-- Pesées (page Poids, cachée) : une ligne par pesée, propre à chaque compte.
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  -- Poids en kilos, au dixième près (la précision d'un pèse-personne)
  weight_kg numeric(4, 1) not null check (weight_kg > 0),
  -- Jour de la pesée, envoyé par l'app : le jour même par défaut (dans le
  -- fuseau du navigateur, d'où l'absence de default current_date, qui suit
  -- celui du serveur), modifiable pour noter une pesée oubliée
  measured_on date not null,
  -- Mesures facultatives prises le même jour, en centimètres au dixième près
  -- (vides = pas mesurées) : tour de taille, de ventre, de hanche, de cuisse
  waist_cm numeric(4, 1) check (waist_cm > 0),
  belly_cm numeric(4, 1) check (belly_cm > 0),
  hip_cm numeric(4, 1) check (hip_cm > 0),
  thigh_cm numeric(4, 1) check (thigh_cm > 0),
  -- Date d'ajout : remise telle quelle quand on annule une suppression
  created_at timestamptz not null default now(),
  -- Une seule pesée par jour : c'est un point de la courbe
  unique (user_id, measured_on)
);

alter table public.weight_entries enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres pesées.
create policy "pesées du compte connecté" on public.weight_entries
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.weight_entries to authenticated;

-- Migration d'une table créée avant les mesures (sans les colonnes *_cm) : à
-- exécuter une fois, seule, dans le SQL editor.
--
-- alter table public.weight_entries
--   add column waist_cm numeric(4, 1) check (waist_cm > 0),
--   add column belly_cm numeric(4, 1) check (belly_cm > 0),
--   add column hip_cm numeric(4, 1) check (hip_cm > 0),
--   add column thigh_cm numeric(4, 1) check (thigh_cm > 0);
