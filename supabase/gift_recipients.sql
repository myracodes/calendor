-- Personnes de la page Idées cadeaux : une ligne par personne à qui faire un
-- cadeau, propre à chaque compte. Ses idées sont des lignes de `gift_ideas`
-- qui pointent vers elle (voir gift_ideas.sql).
-- À exécuter une fois dans le SQL editor du dashboard Supabase, AVANT
-- gift_ideas.sql : `gift_ideas` fait référence à cette table.

create table public.gift_recipients (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  -- Nom affiché en titre de sa card (« Maman », « Julie »…)
  name text not null check (btrim(name) <> ''),
  created_at timestamptz not null default now(),
  -- Pas deux personnes du même nom pour un même compte
  unique (user_id, name)
);

alter table public.gift_recipients enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres personnes.
create policy "personnes des idées cadeaux du compte connecté" on public.gift_recipients
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.gift_recipients to authenticated;
