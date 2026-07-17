-- Coordonnées du CV, stockées hors du bundle : lisibles uniquement connectée.
-- Une ligne par langue du CV ('fr' / 'en').
-- À exécuter une fois dans le SQL editor du dashboard Supabase.

create table public.cv_contact (
  -- Langue de la version du CV (voir CvLanguage dans src/cv/types.ts)
  language text primary key check (language in ('fr', 'en')),
  -- Tableau de lignes { "texte": "...", "url": "..." } — même forme que ContactLine[] (src/cv/types.ts)
  contact jsonb not null,
  -- Ligne d'informations pratiques affichée sous le bloc contact
  infos text not null
);

alter table public.cv_contact enable row level security;

-- Lecture pour toute personne connectée. Aucune policy d'écriture : les
-- données se modifient depuis le dashboard Supabase (Table editor ou SQL).
create policy "lecture authentifiée" on public.cv_contact
  for select to authenticated using (true);

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
-- ]', 'Basée en … | Permis B | remote :)'),
-- ('en', '[
--   { "texte": "email@example.com", "url": "mailto:email@example.com" },
--   { "texte": "+33(0)6.00.00.00.00", "url": "tel:+33600000000" },
--   { "texte": "github.com/example", "url": "https://github.com/example" },
--   { "texte": "linkedin.com/in/example", "url": "https://www.linkedin.com/in/example/" },
--   { "texte": "Fluent English / French" }
-- ]', 'Based in … | driving license | remote :)');
