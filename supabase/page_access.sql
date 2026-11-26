-- Pages réservées : les pages de l'app que seuls certains comptes peuvent
-- ouvrir (onglet masqué, adresse renvoyée vers l'accueil, données en base
-- illisibles pour les autres comptes). Une ligne par compte et par page ; un
-- compte sans ligne pour une page n'y a pas accès.
-- À exécuter une fois dans le SQL editor du dashboard Supabase, AVANT
-- cv_contact.sql, dont la policy lit cette table.

create table public.page_access (
  -- Compte qui a accès à la page
  user_id uuid references auth.users on delete cascade,
  -- Page réservée : une valeur de RESTRICTED_PAGE (src/pageAccess/restrictedPages.ts).
  -- Réserver une nouvelle page : l'ajouter à RESTRICTED_PAGE, puis à cette
  -- liste avec
  --   alter table public.page_access drop constraint page_access_page_check;
  --   alter table public.page_access add constraint page_access_page_check
  --     check (page in ('cv', 'nouvelle-page'));
  page text not null check (page in ('cv')),
  primary key (user_id, page)
);

alter table public.page_access enable row level security;

-- Chaque compte ne lit que ses propres lignes. Aucune policy d'écriture : les
-- accès se modifient depuis le dashboard Supabase (Table editor ou SQL).
create policy "accès du compte connecté" on public.page_access
  for select to authenticated
  using (user_id = auth.uid());

-- Privilège SQL de base, indépendant de la RLS (voir cv_contact.sql).
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select on public.page_access to authenticated;

-- Modèle d'insertion, à exécuter dans le SQL editor avec les VRAIS emails des
-- comptes. Ne pas les écrire dans ce fichier : il est public. Le "on conflict"
-- ignore un compte qui a déjà l'accès : sans lui, une seule ligne existante
-- fait échouer toute l'insertion, y compris pour les autres comptes.
--
-- insert into public.page_access (user_id, page)
-- select id, 'cv' from auth.users
-- where email in ('compte1@example.com', 'compte2@example.com')
-- on conflict do nothing;
--
-- Vérifier qui a accès :
-- select users.email, page_access.page
-- from public.page_access
-- join auth.users on users.id = page_access.user_id;
--
-- Retirer l'accès d'un compte :
-- delete from public.page_access
-- where page = 'cv'
--   and user_id = (select id from auth.users where email = 'compte@example.com');
