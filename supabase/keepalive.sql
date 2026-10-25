-- Ping anti-pause : appelé deux fois par semaine par le workflow GitHub
-- .github/workflows/supabase-keepalive.yml. Le plan gratuit met le projet en
-- pause après 7 jours sans activité ; cet appel suffit à le garder éveillé.
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

-- "stable" permet de l'appeler en GET (/rest/v1/rpc/keepalive). Elle ne lit
-- aucune table : rien n'est exposé aux visiteurs non connectés.
create or replace function public.keepalive()
returns boolean
language sql
stable
as $$
  select true;
$$;

-- Les fonctions sont exécutables par tous par défaut : on restreint à "anon",
-- la seule clé dont dispose le workflow.
revoke execute on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;
