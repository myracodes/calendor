-- Objectif de poids : au plus une ligne par compte,
-- tracée en pointillés sur la courbe des pesées.
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.weight_goals (
  -- Propriétaire, et clé de la table : un seul objectif par compte. Rempli
  -- automatiquement avec le compte connecté, ce qui laisse l'app enregistrer
  -- l'objectif par un upsert (on conflict user_id) sans jamais envoyer user_id
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  -- Poids visé en kilos, au dixième près ; null = objectif retiré
  target_kg numeric(4, 1) check (target_kg > 0)
);

alter table public.weight_goals enable row level security;

-- Chaque compte ne voit et ne modifie que son propre objectif.
create policy "objectif du compte connecté" on public.weight_goals
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.weight_goals to authenticated;
