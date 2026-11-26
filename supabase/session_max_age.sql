-- Durée maximale de session : au-delà de 14 jours depuis la connexion, la base
-- ne rend plus aucune donnée, même avec un jeton encore renouvelable (volé, ou
-- resté sur un appareil perdu). L'app déconnecte d'elle-même à la même
-- échéance (src/auth/sessionMaxAge.ts) ; ici, c'est la vraie protection.
-- À exécuter une fois dans le SQL editor du dashboard Supabase, APRÈS les
-- scripts de toutes les tables listées plus bas.

-- true si la connexion de la session date de moins de 14 jours. L'instant de
-- connexion vient du champ "amr" du jeton, qui ne change pas quand le jeton est
-- renouvelé ; la plus ancienne entrée fait foi (mot de passe puis second
-- facteur…). Jeton sans cette information → false : on refuse par défaut.
-- L'intervalle doit rester égal à SESSION_MAX_AGE_DAYS (src/auth/sessionMaxAge.ts).
create or replace function public.session_is_fresh()
returns boolean
language sql
stable
as $$
  select coalesce(
    (
      select min((amr_entry ->> 'timestamp')::bigint)
      from jsonb_array_elements(auth.jwt() -> 'amr') as amr_entry
    ) >= extract(epoch from now() - interval '14 days'),
    false
  );
$$;

-- Une policy "restrictive" s'ajoute en ET aux policies existantes de la table
-- (compte propriétaire, accès à la page…) sans les modifier. Le
-- (select …) fait calculer la fonction une fois par requête, pas par ligne.
-- La liste ne contient que les tables créées avant ce script : ne pas la
-- compléter, une nouvelle table pose la policy dans son propre script (voir
-- plus bas).
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'book_series',
    'books',
    'cv_contact',
    'gift_ideas',
    'gift_recipients',
    'life_events',
    'page_access',
    'planning_tasks',
    'recommendations',
    'series',
    'shortcuts',
    'weight_entries',
    'weight_goals'
  ] loop
    execute format(
      'create policy "session de moins de 14 jours" on public.%I
         as restrictive for all to authenticated
         using ((select public.session_is_fresh()))
         with check ((select public.session_is_fresh()))',
      table_name
    );
  end loop;
end;
$$;

-- Nouvelle table : ajouter dans son propre script, après ses policies,
--
-- create policy "session de moins de 14 jours" on public.<table>
--   as restrictive for all to authenticated
--   using ((select public.session_is_fresh()))
--   with check ((select public.session_is_fresh()));

-- Retour arrière, si l'app n'affiche plus aucune donnée juste après avoir
-- exécuté ce script (jeton sans "amr" exploitable) : supprime la policy de
-- toutes les tables qui l'ont, puis la fonction.
--
-- do $$
-- declare
--   table_name text;
-- begin
--   for table_name in
--     select tablename from pg_policies
--     where schemaname = 'public' and policyname = 'session de moins de 14 jours'
--   loop
--     execute format(
--       'drop policy "session de moins de 14 jours" on public.%I', table_name
--     );
--   end loop;
-- end;
-- $$;
-- drop function public.session_is_fresh();
