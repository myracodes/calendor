-- Idées cadeaux (page Idées cadeaux) : une ligne par idée, rattachée à la
-- personne à qui l'offrir (voir gift_recipients.sql), propre à chaque compte.
-- À exécuter une fois dans le SQL editor du dashboard Supabase, APRÈS
-- gift_recipients.sql.

create table public.gift_ideas (
  id uuid primary key default gen_random_uuid(),
  -- Propriétaire : rempli automatiquement avec le compte connecté à l'insertion
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  -- Personne à qui l'offrir ; supprimer la personne supprime ses idées
  recipient_id uuid not null references public.gift_recipients on delete cascade,
  title text not null check (btrim(title) <> ''),
  -- Date d'ajout : ordonne la liste d'une personne, la plus récente en premier
  created_at timestamptz not null default now(),
  -- Pas deux fois la même idée pour une même personne
  unique (recipient_id, title)
);

alter table public.gift_ideas enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres idées, et ne les range
-- que dans la liste de l'une de ses propres personnes.
create policy "idées cadeaux du compte connecté" on public.gift_ideas
  for all to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.gift_recipients
      where gift_recipients.id = recipient_id and gift_recipients.user_id = auth.uid()
    )
  );

-- Privilèges SQL de base, indépendants de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select, insert, update, delete on public.gift_ideas to authenticated;
