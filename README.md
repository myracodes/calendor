# Calendor

Générateur de calendriers PDF avec un design « imitation papier » et des polices manuscrites.

## Fonctionnalités (POC)

- Choix de la période : année, premier mois, nombre de mois (une page A4 paysage par mois)
- Illustration personnalisée (PNG/JPEG) affichée en haut de chaque page
- Événements récurrents ou ponctuels affichés dans les cases du calendrier
- Génération et téléchargement du PDF côté client

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript
- [@react-pdf/renderer](https://react-pdf.org) pour la génération du PDF
- Dates calculées en UTC natif (`Date.UTC`) — aucune librairie de dates
- Polices manuscrites [Patrick Hand](https://fonts.google.com/specimen/Patrick+Hand) et [Kalam](https://fonts.google.com/specimen/Kalam) (licence OFL), embarquées dans `public/fonts/`
- [Supabase](https://supabase.com) (`@supabase/supabase-js`) pour l'authentification et les données stockées en base
- Hébergement : GitHub Pages (`.github/workflows/deploy.yml`)

## Architecture : pas de backend à soi

Calendor est un site **100 % statique** : `npm run build` produit du HTML/JS/CSS servi tel quel par GitHub Pages. Aucun serveur écrit pour l'app. Le PDF est généré dans le navigateur, et la plupart des réglages (calendriers, courses, courrier…) vivent dans le `localStorage`.

Pour les données qui doivent suivre le compte (séries, coordonnées du CV), le front parle **directement** à Supabase. Le backend existe bien, mais c'est Supabase qui le fournit :

```
Navigateur (React)                         Supabase
──────────────────                         ─────────────────────────────────────────
supabase.from("series").select(…)  ──HTTP──▶  PostgREST : traduit la requête en SQL
  + clé "anon" (publique)                   │
  + jeton JWT de la session                 ▼
                                           PostgreSQL : applique les règles RLS
                                           avec l'identité du JWT (auth.uid())
                                           puis renvoie uniquement les lignes autorisées
```

- **PostgREST** expose automatiquement chaque table de la base en API REST. `supabase-js` (`.from().select().eq()…`) n'est qu'un constructeur de requêtes HTTP vers cette API : on n'écrit jamais de SQL dans le front, et on n'a jamais d'accès direct à la base.
- **Supabase Auth** gère les comptes. À la connexion, le navigateur reçoit un jeton (JWT) signé par Supabase, joint ensuite à chaque requête. Le SDK le stocke dans le `localStorage` et le renouvelle tout seul (`src/auth/AuthProvider.tsx`).
- **La sécurité est dans la base, pas dans le code** : la clé "anon" et l'URL sont publiques (elles sont dans le bundle, n'importe qui peut les lire). Ce qui protège les données, c'est la **Row Level Security** (RLS) de PostgreSQL : chaque table déclare dans `supabase/<table>.sql` qui peut lire/écrire quelles lignes (ex. `series` : `user_id = auth.uid()`, chacune ne voit que ses séries). Le `grant … to authenticated` (sans rien pour `anon`) ferme en plus la porte aux visiteurs non connectés.
- Conséquence : **une table sans RLS serait lisible et modifiable par tout le monde** via l'API publique. Toute nouvelle table doit activer la RLS et définir ses policies (voir [docs/DATABASE.md](docs/DATABASE.md)). De même, les inscriptions doivent rester fermées dans le dashboard (voir [docs/ADD_USER.md](docs/ADD_USER.md)).
- Le verrou de l'app (`App.tsx` : écran de connexion tant qu'il n'y a pas de session) est un confort d'interface, pas une protection : le code JS est public de toute façon. Seule la RLS protège réellement les données.

Où regarder dans le code :

| Fichier | Rôle |
| --- | --- |
| `src/supabase/client.ts` | Crée le client à partir de `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (`.env.local` en dev, variables du repo GitHub en prod) |
| `src/auth/` | Session courante, fournie à toute l'app via `useAuth` |
| `src/series/seriesRepository.ts` | Exemple de lecture/écriture : conversion lignes SQL ↔ types TS, gestion des erreurs |
| `supabase/*.sql` | Schéma des tables + règles RLS, exécutés à la main dans le dashboard |

Limite de ce modèle : pas d'endroit pour du code serveur « de confiance » (garder une clé d'API tierce secrète, faire un traitement que l'utilisatrice ne doit pas pouvoir contourner…). Si le besoin arrive, Supabase propose des **Edge Functions** (petites fonctions serveur hébergées chez eux) sans devoir monter un backend complet.

## Développement

```sh
npm install
npm run dev      # serveur de développement
npm run build    # build de production
npm run lint     # lint (oxlint)
```

## Documentation

- [Ajouter une utilisatrice](docs/ADD_USER.md)
- [Base de données : créer ou modifier une table](docs/DATABASE.md)
- [Créer une nouvelle feature](NEW_FEATURE.md) (guide pour les agents IA, voir aussi [AGENTS.md](AGENTS.md))
