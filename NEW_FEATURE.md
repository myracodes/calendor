# Créer une nouvelle feature

Guide à suivre par une IA à qui on demande de créer une feature dans Calendor.
Il complète [AGENTS.md](AGENTS.md) (règles générales, toujours applicables) avec les étapes propres à la création d'une feature.

**Ce guide ne contient que ce qui sert aux prochaines features** : étapes, composants et helpers partagés, conventions de code, préférences de design, pièges. En fin de travail, y ajouter ce qui a été appris et qui resservira, dans la section concernée. Jamais de récit de la feature réalisée (« on a fait ceci, comme cela ») : c'est le rôle de git et des commentaires du code.

## 0. Avant de coder

- Lire [AGENTS.md](AGENTS.md) en entier.
- Regarder une feature existante proche pour copier sa structure plutôt que d'en inventer une (ex. `CourrierPage` pour une page avec réglages persistés et PDF, `CalendarsPage` pour une page à onglets et sous-composants).
- Avancer par étapes validées par Myriam : d'abord la coquille (page, route, navigation), puis le contenu, écran par écran. Ne pas anticiper le contenu qu'elle n'a pas encore décrit.

## 1. Page, route et navigation

1. Créer la page dans `src/pages/<Nom>Page/<Nom>Page.tsx` (composant exporté nommé `<Nom>Page`).
2. Déclarer la route dans `src/App.tsx` (`<Route path="/<slug>" … />`), slug en anglais et en kebab-case (`/batch-cooking`, `/series`).
3. Ajouter le lien dans le tableau `NAV_LINKS` de `src/shared/Navbar/Navbar.tsx` — libellé en français, tel qu'affiché.
4. Page réservée à certains comptes (ex. CV) : ajouter son identifiant à `RESTRICTED_PAGE` (`src/pageAccess/restrictedPages.ts`) et à la contrainte check de `supabase/page_access.sql`, poser `restrictedPage` sur son lien de `NAV_LINKS`, et envelopper sa route dans `RestrictedRoute`. Ses données en base se protègent aussi côté Supabase : une policy qui vérifie la ligne de `page_access` (modèle : `supabase/cv_contact.sql`), car l'interface seule ne protège rien.

## 2. Composants

- Composant propre à la page → `src/pages/<Nom>Page/components/<Composant>/<Composant>.tsx` (+ son `.css` à côté si besoin).
- Composant utilisé par plusieurs pages → `src/shared/<Composant>/`. Avant d'en créer un, vérifier ce qui existe déjà :
  - `Card` : bloc de contenu avec liseré coloré (`variantColor` : `sun`, `candy`, `sky`) et titre `<h2>`.
  - `Tabs` : barre d'onglets (un seul actif). Typer les identifiants d'onglets avec une union (`Tab<"day" | "week">`).
  - `EntryForm` : cadre des formulaires d'une liste enregistrée en base — ajout en haut de la liste, ou modification ouverte à la place d'une entrée (`onClose` l'encadre et ajoute la croix, `deletion` le bouton de suppression avec confirmation). Erreur d'enregistrement affichée sous les champs, Entrée enregistre.
  - `IconButton` : petit bouton carré à icône posé sur une ligne de liste (crayon d'édition, coche, +, corbeille) ; `label` sert à la fois d'`aria-label` et d'infobulle. `disabled` le grise sans le retirer quand l'action n'est pas possible (rien à enregistrer, rien à supprimer), pour que la ligne ne bouge pas. `type="submit"` (sans `onClick`) en fait le bouton d'enregistrement d'un formulaire : Entrée l'envoie même avec plusieurs champs. `size="small"` pour une liste serrée, où le bouton ne doit pas espacer les lignes (`medium` par défaut) ; sur une page, tous les boutons-icônes gardent la même taille (Idées cadeaux : tous en `small`).
  - `InlineEntryForm` : version en une ligne d'`EntryForm`, pour un ajout rapide : les champs, puis la coche (Entrée l'envoie aussi) et, en option, la corbeille. Erreur d'enregistrement en toast, la ligne n'ayant pas la place d'un message. `fullWidthField` quand il n'y a qu'un champ (le nom d'une personne) : il s'étire, la coche collée à sa droite ; `saveIcon={plusIcon}` remplace la coche par un + pour un ajout à une liste (une personne ou une idée des Idées cadeaux) ; `size` cale ses boutons sur ses champs et sur les autres boutons-icônes de la page ; `compact` pour beaucoup de champs courts. Le hook `useInlineAction` (`src/shared/`) donne le même `busy` + toast d'erreur à une action posée sur une ligne sans formulaire (enregistrement d'une ligne de tableau…).
  - `ControlSize` (`src/shared/controlSize.ts`) : taille commune des contrôles, en tailles de t-shirt : `small` (`--control-h-small`, liste serrée), `medium` (`--control-h-medium`, hauteur habituelle des champs et boutons) ou `large` (`--control-h-large`, grand bouton d'action). Même nom de taille = même hauteur : un champ `input--small` (classe de `App.css`) s'aligne sur un `IconButton size="small"`. `IconButton` prend `small`/`medium`, `ActionButton` `medium`/`large`.
  - `ActionButton` : grand bouton pleine largeur de l'action principale d'une page (générer le PDF, enregistrer, créer…). `busy` pendant l'action en cours (désactive le bouton, curseur d'attente) ; `variant="secondary"` pour l'action d'à côté (réinitialiser, annuler, supprimer), placée juste au-dessus.
  - `ProgressPie` : camembert de progression en pourcentage, avec la valeur en dessous.
  - `Accordion` : section repliable (`details`/`summary`) pour grouper une liste dans une card, titre suivi du nombre d'éléments (« 2024 (3 livres) »), groupes séparés par un `<hr />`. `action` pose un `IconButton` à droite du titre (crayon pour modifier le groupe lui-même), hors du `summary` pour que le clic n'ouvre pas la section. Titre en regular par défaut ; `titleWeight="bold"` existe mais ne sert que si un titre doit vraiment ressortir. Sert aussi à replier les champs facultatifs d'un formulaire.
  - `Table` : tableau de données, en `<thead>`/`<tbody>` natifs ; `label` nomme sa zone de défilement, car il défile horizontalement dans sa card quand il est plus large qu'elle. Première colonne en `<th scope="row">`, classes `table-cell-number` (chiffres alignés à droite, en-tête compris) et `table-actions` (conteneur des boutons-icônes de la dernière colonne). Une ligne modifiable à sa place (classe `table-row-editing` sur son `<tr>`, qui resserre cellules et champs, nombres sans flèches d'incrément) met un champ par cellule, rattaché par l'attribut `form` au `<form>` posé dans la dernière cellule (un `<form>` ne peut pas englober un `<tr>`).
  - `Tag` : petite étiquette d'état à côté d'un libellé (« En cours »), `variantColor` obligatoire : `mint` (en cours), `sun` (en attente), `neutral` (fini).
  - `Alert` : bandeau fixe dans la page, pour un état qui dure (base non configurée, échec de chargement, mode dev).
  - `Toast` : notification flottante en bas de l'écran, en retour d'une action ponctuelle (`variant` : `success`, `info`, `error`). Fermée par la croix ou au bout de `duration` ms (5 s par défaut, `null` pour la garder). S'utilise via le hook `useToast` (`const { toast, showToast } = useToast()`, puis `{toast}` n'importe où dans le rendu) ; un 3e argument optionnel ajoute un bouton d'action, typiquement `{ label: "Annuler", onClick }` pour défaire l'action. Ne pas hésiter à confirmer les actions par un toast, Myriam apprécie le retour (enregistrement, ajout, épisode marqué vu…) ; et proposer « Annuler » dans le toast plutôt qu'un bouton d'annulation permanent quand l'action se défait facilement. Seule exception : pas de toast quand le résultat s'impose de lui-même (téléchargement d'un PDF, case cochée). Un échec de génération de PDF s'affiche avec `PDF_ERROR_MESSAGE` de `downloadPdf.ts`.
  - `IllustrationSection` : choix de l'image d'illustration d'un PDF ; la case « Afficher une image de fond » n'apparaît que si la page fournit `onShowBackgroundChange`.
  - `usePersistentState` : état persisté dans `localStorage` (clé préfixée par la feature : `"cv.title"`).
- Helpers partagés, avant d'en réécrire un :
  - `src/dates.ts` : `todayIso` (la date du jour en « aaaa-mm-jj » dans le fuseau local, valeur par défaut d'un champ date), `monthOf` (le mois d'une `Date`, typé `Month`), `addDays`, `dayNumber` / `dayFromNumber` (écart en jours), `weekdayOfIso`, noms de mois et de jours tirés d'`Intl` (locale en paramètre, français par défaut).
  - `src/french.ts` : `plural` (« 3 livres ») et `prefixWithDe` (« de Maman » / « d'Alice »).
  - `src/pdf/shared/paint.ts` : lignes pointillées d'un PDF, à écart fixe (`paintDottedLines`) ou en nombre fixe réparti sur la hauteur (`paintDottedLineCount`).
- Si un élément d'une page existante doit servir ailleurs, l'extraire vers `src/shared/` et faire utiliser la version partagée par la page d'origine (ex. `Tabs`, extrait de `TemplateTabs` des calendriers) plutôt que dupliquer le style.

## 3. Préférences de design

- Le plus léger possible (voir aussi AGENTS.md, section Interface) : une seule card avec un accordéon par élément plutôt qu'une card par élément ; ajout rapide en une ligne (`InlineEntryForm`).
- Champ seul d'un ajout rapide : pas de libellé visible, mais un `aria-label` et un exemple en `placeholder`.
- Suppression sans confirmation, défaite par « Annuler » dans le toast. L'annulation recrée la ligne à l'identique (même `id`, même `created_at`, mêmes lignes liées) pour qu'elle revienne à sa place.
- Pas de gras par défaut : titres d'accordéon, libellés de liste et autres textes de l'interface restent en regular ; le gras ne se pose que sur demande.
- Une couleur de token trop vive pour porter du texte en AAA (ex. `--chart-orange`) peut servir de liseré, avec un fond éclairci du même token (`color-mix(in srgb, var(--token) 40%, var(--surface))`) où le texte reste à 7:1. Vérifier le ratio, et le noter en commentaire.
- Fenêtre modale (ajout ou modification par-dessus une page dense) : `<dialog>` + `showModal()`, qui fournit fond grisé, focus gardé et Échap. Modèle : `TaskDialog` du planning.

## 4. Données

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
- Supabase ne renvoie pas plus de 1000 lignes par requête : une table qui grossit vite (plusieurs lignes par jour) se charge par période plutôt qu'en entier. Modèle : `fetchPlanningTasks` (`src/planning/planningTasksRepository.ts`), qui ne lit que les jours affichés.
- Deux tables liées (une personne et ses idées) : `<parent>_id … references … on delete cascade`, et une policy qui vérifie aussi que le parent appartient au compte. Modèle : `supabase/gift_ideas.sql`.
- Une variante d'un même objet (livre papier / audio, catégorie de reco) : une colonne de plus plutôt qu'une table à part.
- Ordre manuel (glisser-déposer) : une colonne `sort_order double precision`, la moyenne de ses deux voisines pour s'insérer entre elles sans renuméroter, et l'instant d'ajout par défaut (`extract(epoch from clock_timestamp())`) pour qu'un nouvel élément se range en dernier. Modèle : `supabase/planning_tasks.sql`, `src/planning/order.ts`.
- Lectures et écritures regroupées dans un hook `src/<feature>/use<Feature>.ts` (chargement, erreur, actions qui ne mettent à jour l'état local qu'une fois la base d'accord). Modèle : `src/series/useSeries.ts`. Quand plusieurs cards partagent les mêmes données, appeler le hook (et `useToast`) dans la page et les leur passer.
- Données en base lues par une page qui marche aussi sans Supabase (calendriers, accueil) : le hook renvoie une liste vide quand `isSupabaseConfigured` est faux, au lieu d'appeler `requireSupabase()`. Si un PDF en a besoin, garder son bouton `busy` tant qu'elles chargent, et signaler leur échec de chargement par une `Alert`. Modèle : `useLifeEvents` (`src/lifeEvents/`), utilisé par `CalendarsPage` et `HomePage`.
- Dès que Supabase est configuré, l'app exige une session, en dev comme en prod (verrou dans `App.tsx`) : une page n'a donc pas à gérer la connexion. Elle doit seulement afficher une `Alert` quand Supabase n'est pas configuré (pas de `.env.local` en dev), car il n'y a alors ni verrou ni session. Modèle : `SeriesPage`.

## 5. Pièges connus

- Onglets : les masquer avec `hidden` plutôt que les démonter, sinon les réglages non persistés d'un onglet se perdent.
- Onglet de réglage posé à côté d'onglets de modèles (Anniversaires, à côté des modèles des Calendriers) : il ne touche pas aux réglages du modèle, et revenir au modèle quitté les retrouve tels quels au lieu de réappliquer le modèle. Modèle : `TemplateTabs`.
- Date qui revient chaque année (anniversaire) : jour et mois séparés, année facultative à part ; le 29 février reste permis (`maxDayOf` de `src/lifeEvents/validation.ts`, avec la même règle en `check` SQL).
- Composant affiché plusieurs fois avec un `id` ou un `name` (`datalist`, groupe de boutons radio) : le générer avec `useId`.
- Boutons radio : exclus de la règle commune des champs (`App.css`), qui leur donnerait la hauteur et la bordure d'un champ texte. Un groupe d'options va dans un `fieldset`, dont la `legend` a l'allure d'un libellé.
- Toast d'une page qui ouvre une `<dialog>` : le rendre dans la fenêtre tant qu'elle est ouverte, sinon il passe sous le fond grisé, hors d'atteinte.
- Glisser-déposer : en pointer events plutôt qu'en drag and drop HTML (absent au doigt). Au doigt, appui long avant de prendre l'élément pour laisser défiler la page, puis `touchmove` empêché ; ignorer le clic qui suit le lâcher. Modèle : `useTaskDrag` du planning.
- Bouton qui ne doit pas prendre le focus d'une zone de texte (clavier virtuel) : `preventDefault` au `mousedown`. Après un remplacement de la valeur d'une zone de texte, React renvoie le curseur à la fin : le replacer dans un `useLayoutEffect`.
- Page qui affiche l'heure ou « aujourd'hui » : une seule horloge `useNow` pour toute la page, qui la fait aussi passer au jour suivant à minuit.
- API externe appelée depuis le navigateur : publique et sans clé (le site est public). Une requête par élément pour qu'une erreur reste locale à sa ligne, et la mention de la source si la licence la demande (Open-Meteo, CC BY 4.0).
- PDF (react-pdf) :
  - variantes de style déclarées dans des `StyleSheet.create` indexés par réglage (`STAFF_HEIGHTS[settings.kind]`), pas en objets de style dans le JSX ;
  - écriture non latine : sa police appliquée **seule** sur chaque texte traduit (`languageFont()`), react-pdf mélangeant les glyphes de deux polices (il réordonne l'arabe) ; ne pas réduire une police arabe, ça casse ses ligatures ;
  - `import.meta.glob` prend un chemin relatif au fichier : déplacer le fichier casse le glob sans erreur ;
  - nom du fichier PDF toujours en anglais.

## 6. Vérifications avant de rendre la main

- `npx tsc -b`, `npm run lint`, `npm run format:check` passent. Le formatage est fait par Biome (`npm run format`), pas par Prettier : ne pas lancer `npx prettier`, dont les réglages diffèrent.
- Pas de vérification visuelle automatique (captures, curl…) : Myriam vérifie elle-même.
- Proposer un titre de commit (voir la section Git d'AGENTS.md), périmètre = nom de la feature (`feat(series): …`).
- Ajouter à ce guide ce qui resservira (voir en haut), sans récit de la feature.
