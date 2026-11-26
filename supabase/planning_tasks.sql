-- Tâches du planning (page Planning) : une ligne par tâche, sur un jour ou sur
-- plusieurs jours d'affilée, propre à chaque compte.
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.planning_tasks (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null check (btrim(title) <> ''),
  -- Premier et dernier jour de la tâche, inclus : les deux sont égaux pour
  -- une tâche d'un seul jour
  start_date date not null,
  end_date date not null,
  -- Pro, médical, perso ou off (congés) : donne sa couleur à la tâche (voir
  -- src/planning/categories.ts)
  category text not null default 'personal'
    check (category in ('work', 'medical', 'personal', 'off')),
  -- Place parmi les tâches qui commencent le même jour, de gauche à droite,
  -- changée par glisser-déposer. Nombre à virgule : une tâche glissée entre
  -- deux autres prend la moyenne des leurs, sans renuméroter le reste. Par
  -- défaut l'instant d'ajout, en secondes : une nouvelle tâche se range après
  -- celles du jour.
  sort_order double precision not null
    default extract(epoch from clock_timestamp()),
  -- Date d'ajout : départage deux tâches qui commencent le même jour
  created_at timestamptz not null default now(),
  constraint planning_tasks_dates_ordered check (end_date >= start_date)
);

-- Le planning ne charge que les tâches des jours affichés (voir
-- src/planning/planningTasksRepository.ts).
create index planning_tasks_user_dates
  on public.planning_tasks (user_id, start_date, end_date);

alter table public.planning_tasks enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres tâches.
create policy "tâches du planning du compte connecté" on public.planning_tasks
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.planning_tasks to authenticated;

-- Migration d'une table créée avant les catégories (sans la colonne
-- category) : à exécuter une fois, seule, dans le SQL editor. Les tâches
-- existantes passent en perso.
--
-- alter table public.planning_tasks
--   add column category text not null default 'personal'
--     check (category in ('work', 'medical', 'personal'));

-- Migration d'une table créée avant l'ordre des tâches d'un même jour (sans
-- la colonne sort_order) : à exécuter une fois, seule, dans le SQL editor.
-- Les tâches existantes se rangent dans leur ordre d'ajout.
--
-- alter table public.planning_tasks
--   add column sort_order double precision not null
--     default extract(epoch from clock_timestamp());
-- update public.planning_tasks set sort_order = extract(epoch from created_at);

-- Migration d'une table créée avant la catégorie off (congés) : à exécuter
-- une fois, seule, dans le SQL editor. Remplace la contrainte de la colonne
-- category, nommée automatiquement par Postgres.
--
-- alter table public.planning_tasks
--   drop constraint planning_tasks_category_check,
--   add constraint planning_tasks_category_check
--     check (category in ('work', 'medical', 'personal', 'off'));
