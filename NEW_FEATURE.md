# Créer une nouvelle feature

Guide à suivre par une IA à qui on demande de créer une feature dans Calendor.
Il complète [AGENTS.md](AGENTS.md) (règles générales, toujours applicables) avec les étapes propres à la création d'une feature.

**Ce fichier s'enrichit à chaque nouvelle feature** : en fin de travail, ajouter ce qui a été appris (nouvelle étape, piège rencontré, composant partagé créé) dans la section concernée, et compléter l'[historique](#historique-des-features).

## 0. Avant de coder

- Lire [AGENTS.md](AGENTS.md) en entier.
- Regarder une feature existante proche pour copier sa structure plutôt que d'en inventer une (ex. `CourrierPage` pour une page avec réglages persistés et PDF, `CalendarsPage` pour une page à onglets et sous-composants).
- Avancer par étapes validées par Myriam : d'abord la coquille (page, route, navigation), puis le contenu, écran par écran. Ne pas anticiper le contenu qu'elle n'a pas encore décrit.

## 1. Page, route et navigation

1. Créer la page dans `src/pages/<Nom>Page/<Nom>Page.tsx` (composant exporté nommé `<Nom>Page`).
2. Déclarer la route dans `src/App.tsx` (`<Route path="/<slug>" … />`), slug en anglais et en kebab-case (`/batch-cooking`, `/series`).
3. Ajouter le lien dans le tableau `LINKS` de `src/shared/Navbar/Navbar.tsx` — libellé en français, tel qu'affiché.
4. Commencer la page par une `<p className="tagline">…</p>` qui dit à quoi elle sert, comme les autres pages.

## 2. Composants

- Composant propre à la page → `src/pages/<Nom>Page/components/<Composant>/<Composant>.tsx` (+ son `.css` à côté si besoin).
- Composant utilisé par plusieurs pages → `src/shared/<Composant>/`. Avant d'en créer un, vérifier ce qui existe déjà :
  - `Card` : bloc de contenu avec liseré coloré (`variantColor` : `sun`, `candy`, `sky`) et titre `<h2>`.
  - `Tabs` : barre d'onglets (un seul actif). Typer les identifiants d'onglets avec une union (`Tab<"watch" | "settings">`).
  - `ActionButton` : grand bouton pleine largeur de l'action principale d'une page (générer le PDF, enregistrer, créer…). `busy` pendant l'action en cours (désactive le bouton, curseur d'attente) ; `variant="secondary"` pour l'action d'à côté (réinitialiser, annuler, supprimer), placée juste au-dessus.
  - `Alert`, `IllustrationSection`.
  - `usePersistentState` : état persisté dans `localStorage` (clé préfixée par la feature : `"series.activeTab"`).
- Si un élément d'une page existante doit servir ailleurs, l'extraire vers `src/shared/` et faire utiliser la version partagée par la page d'origine (ex. `Tabs`, extrait de `TemplateTabs` des calendriers) plutôt que dupliquer le style.

## 3. Données

- Logique et types métier hors des composants, dans `src/<feature>/` (`types.ts`, un fichier par responsabilité — voir `src/courrier/`, `src/cv/`).
- Où stocker :
  - préférence d'affichage ou brouillon propre à un appareil → `localStorage` via `usePersistentState` ;
  - données à retrouver sur tous les appareils, ou sensibles (le repo et le site sont publics) → Supabase.

### Base de données (Supabase)

- Une table = un fichier `supabase/<table>.sql` versionné, contenant : le `create table` commenté colonne par colonne, `enable row level security`, les policies, les `grant` à `authenticated` (rien pour `anon`), et les éventuelles migrations. Modèle : `supabase/cv_contact.sql`.
- Ajouter la table au tableau « Ce qu'elle verra » de [docs/ADD_USER.md](docs/ADD_USER.md), en précisant si ses données sont propres à chaque compte ou partagées.
- Myriam exécute ce SQL elle-même dans le SQL editor du dashboard Supabase : lui dire précisément quoi exécuter, en renvoyant vers [docs/DATABASE.md](docs/DATABASE.md). Ajouter le script au tableau « Scripts du repo » de cette doc. Ne jamais écrire de vraies données personnelles dans le fichier versionné.
- Données personnelles à un compte (tout sauf ce qui est explicitement partagé, comme la liste de courses) : colonne `user_id uuid not null default auth.uid()` et une policy `using (user_id = auth.uid()) with check (user_id = auth.uid())`. Le code n'a alors jamais à envoyer `user_id`. Modèle : `supabase/series.sql`.
- Accès depuis le code via `supabase` / `requireSupabase()` de `src/supabase/client.ts`, dans une fonction dédiée de `src/<feature>/` qui convertit les lignes de la base vers les types de l'app (modèle : `src/cv/fetchCvContact.ts`). Prévoir le cas `supabase === null` (dev sans variables d'environnement).
- Lectures et écritures regroupées dans un hook `src/<feature>/use<Feature>.ts` (chargement, erreur, actions qui ne mettent à jour l'état local qu'une fois la base d'accord). Modèle : `src/series/useSeries.ts`.
- Dès que Supabase est configuré, l'app exige une session, en dev comme en prod (verrou dans `App.tsx`) : une page n'a donc pas à gérer la connexion. Elle doit seulement afficher une `Alert` quand Supabase n'est pas configuré (pas de `.env.local` en dev), car il n'y a alors ni verrou ni session. Modèle : `SeriesPage`.

## 4. Vérifications avant de rendre la main

- `npx tsc -b`, `npm run lint`, `npm run format:check` passent.
- Pas de vérification visuelle automatique (captures, curl…) : Myriam vérifie elle-même.
- Proposer un titre de commit (voir la section Git d'AGENTS.md), périmètre = nom de la feature (`feat(series): …`).
- Mettre à jour ce fichier.

## Historique des features

Ce que chaque feature a apporté au guide, pour savoir d'où vient une convention.

- **Séries** (`/series`) — suivi des épisodes vus. Création de ce guide ; extraction des composants partagés `Tabs`, et `ActionButton` (ex-classes `.generate`) ; verrou de connexion activé aussi en dev ; première table Supabase propre à chaque compte (`series`).
