-- Coordonnées du CV, stockées hors du bundle : lisibles uniquement connectée.
-- Une ligne par langue du CV ('fr' / 'en').
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.cv_contact (
  -- Langue de la version du CV (voir CvLanguage dans src/cv/types.ts)
  language text primary key check (language in ('fr', 'en')),
  -- Tableau de lignes { "texte": "...", "url": "..." } — même forme que ContactLine[] (src/cv/types.ts)
  contact jsonb not null,
  -- Tableau de lignes { "id": "...", "texte": "..." } affichées sous le bloc
  -- contact — même forme que PersonalInfoLine[] (src/cv/types.ts). Les "id"
  -- doivent correspondre à ceux de PERSONAL_INFO_PLACEHOLDER (src/cv/content/profile.ts),
  -- utilisés pour masquer une ligne précise depuis la page CV.
  infos jsonb not null
);

alter table public.cv_contact enable row level security;

-- Lecture pour toute personne connectée. Aucune policy d'écriture : les
-- données se modifient depuis le dashboard Supabase (Table editor ou SQL).
create policy "lecture authentifiée" on public.cv_contact
  for select to authenticated using (true);

-- Privilège SQL de base, indépendant de la RLS : sans lui, PostgreSQL refuse
-- le SELECT avant même d'évaluer la policy (erreur 42501 "permission denied").
-- Rien pour "anon" : les visiteurs non connectés n'ont aucun accès.
grant select on public.cv_contact to authenticated;

-- Modèle d'insertion (une ligne par langue), à exécuter dans le SQL editor
-- avec les VRAIES valeurs. Ne pas écrire les vraies valeurs dans ce fichier :
-- il est versionné — c'est précisément ce qu'on veut éviter.
--
-- insert into public.cv_contact (language, contact, infos) values
-- ('fr', '[
--   { "texte": "email@exemple.fr", "url": "mailto:email@exemple.fr" },
--   { "texte": "+33(0)6.00.00.00.00", "url": "tel:+33600000000" },
--   { "texte": "github.com/exemple", "url": "https://github.com/exemple" },
--   { "texte": "linkedin.com/in/exemple", "url": "https://www.linkedin.com/in/exemple/" },
--   { "texte": "Bilingue anglais / français" }
-- ]', '[
--   { "id": "location", "texte": "Basée en …" },
--   { "id": "practical", "texte": "Vélo | Permis B | remote :)" }
-- ]'),
-- ('en', '[
--   { "texte": "email@example.com", "url": "mailto:email@example.com" },
--   { "texte": "+33(0)6.00.00.00.00", "url": "tel:+33600000000" },
--   { "texte": "github.com/example", "url": "https://github.com/example" },
--   { "texte": "linkedin.com/in/example", "url": "https://www.linkedin.com/in/example/" },
--   { "texte": "Fluent English / French" }
-- ]', '[
--   { "id": "location", "texte": "Based in …" },
--   { "id": "practical", "texte": "Bike | driving license | remote :)" }
-- ]');

-- Migration d'une table existante (colonne `infos` encore en `text`) :
-- 1. Convertir la colonne en jsonb (perd la valeur existante, à ressaisir) :
--    alter table public.cv_contact alter column infos type jsonb using 'null'::jsonb;
-- 2. Ressaisir les deux lignes avec la forme jsonb ci-dessus, par langue :
--    update public.cv_contact set infos = '[
--      { "id": "location", "texte": "Basée en …" },
--      { "id": "practical", "texte": "Vélo | Permis B | remote :)" }
--    ]' where language = 'fr';
--    update public.cv_contact set infos = '[
--      { "id": "location", "texte": "Based in …" },
--      { "id": "practical", "texte": "Bike | driving license | remote :)" }
--    ]' where language = 'en';
