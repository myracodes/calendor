-- Anniversaires et décès (onglet Anniversaires de la page Calendriers, affichés
-- sur les calendriers et sur l'accueil) : une ligne par date à fêter, propre à
-- chaque compte.
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.life_events (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  -- 'birthday' : anniversaire de naissance (ou d'un autre événement : mariage…) ;
  -- 'death' : anniversaire d'un décès
  kind text not null check (kind in ('birthday', 'death')),
  name text not null check (btrim(name) <> ''),
  -- Jour et mois, sans année : la date revient chaque année. Le 29 février est
  -- accepté (années bissextiles).
  month smallint not null check (month between 1 and 12),
  day smallint not null check (
    day >= 1
    and day <= case
      when month = 2 then 29
      when month in (4, 6, 9, 11) then 30
      else 31
    end
  ),
  -- Année de naissance (birthday) ou du décès (death), facultative : sans elle,
  -- le calendrier n'affiche que le nom
  year integer check (year between 1 and 9999),
  -- Anniversaire d'une personne décédée : l'année de son décès. Le calendrier
  -- affiche alors « naissance-décès » au lieu de l'âge.
  death_year integer check (death_year between 1 and 9999),
  -- Date d'ajout : tient l'ordre de deux personnes nées le même jour, et permet
  -- de recréer la ligne à l'identique après une suppression annulée
  created_at timestamptz not null default now(),
  -- Pas deux anniversaires (ou deux décès) du même nom pour un même compte
  unique (user_id, kind, name),
  constraint life_events_death_year_on_birthday_only
    check (kind = 'birthday' or death_year is null),
  constraint life_events_death_after_birth
    check (death_year is null or year is null or death_year >= year)
);

alter table public.life_events enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres dates.
create policy "anniversaires du compte connecté" on public.life_events
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.life_events to authenticated;
