-- Raccourcis du compte : la séquence de touches qui affiche les pages cachées
-- (voir App.tsx), stockée hors du code et du bundle publics. Au plus une
-- ligne par compte ; un compte sans ligne n'a pas accès aux pages cachées,
-- ni par la séquence ni par les tapes sur la version.
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.shortcuts (
  -- Compte qui a accès aux pages cachées, et clé de la table
  user_id uuid primary key references auth.users on delete cascade,
  -- Les touches à taper dans l'ordre : valeurs de KeyboardEvent.key
  -- ('ArrowUp', 'ArrowLeft'…), une lettre seule en minuscule ('b')
  key_sequence text[] not null check (cardinality(key_sequence) > 0)
);

alter table public.shortcuts enable row level security;

-- Chaque compte ne lit que sa propre ligne. Aucune policy d'écriture : les
-- raccourcis se modifient depuis le dashboard Supabase (Table editor ou SQL).
create policy "raccourcis du compte connecté" on public.shortcuts
  for select to authenticated
  using (user_id = auth.uid());

-- Privilège SQL de base, indépendant de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select on public.shortcuts to authenticated;

-- Modèle d'insertion, à exécuter dans le SQL editor avec le VRAI email du
-- compte et la VRAIE séquence. Ne pas écrire la vraie séquence dans ce
-- fichier : il est public.
--
-- insert into public.shortcuts (user_id, key_sequence)
-- values (
--   (select id from auth.users where email = 'compte@example.com'),
--   array['ArrowRight', 'ArrowRight', 'x', 'y']
-- );
--
-- Changer la séquence plus tard :
-- update public.shortcuts set key_sequence = array['…']
-- where user_id = (select id from auth.users where email = 'compte@example.com');
