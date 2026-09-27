# Base de données : créer ou modifier une table

Les tables de Calendor sont décrites dans les fichiers `supabase/*.sql` du repo. Le code ne les crée pas tout seul : chaque script s'exécute **une fois, à la main**, dans le dashboard Supabase. Tant que ce n'est pas fait, la page concernée affiche une erreur du type :

> Could not find the table 'public.series' in the schema cache

Il n'y a qu'un projet Supabase, commun au local et à la prod : un script exécuté une fois sert aux deux.

## Exécuter un script

1. Ouvrir le fichier du script dans l'éditeur (ex. `supabase/series.sql`) et copier **tout** son contenu.
2. Dashboard Supabase ([supabase.com/dashboard](https://supabase.com/dashboard)) → ouvrir le projet de Calendor.
3. Menu de gauche → **SQL Editor** → **New query**.
4. Coller le script, puis **Run** (ou `Cmd + Entrée`).
5. En bas, le résultat doit indiquer **Success. No rows returned**.
6. Vérifier : menu de gauche → **Table Editor** → la table apparaît dans le schéma `public`.
7. Recharger la page de l'app.

Si Supabase affiche un avertissement avant d'exécuter (requête « destructive » ou créant une policy), c'est attendu pour ces scripts : confirmer.

## En cas d'erreur

| Message | Cause | Solution |
| --- | --- | --- |
| `Could not find the table 'public.<table>' in the schema cache` (dans l'app) | Script pas encore exécuté | Suivre [Exécuter un script](#exécuter-un-script). |
| Même message alors que la table est visible dans le Table Editor | L'API Supabase n'a pas encore rechargé la liste des tables | Exécuter `notify pgrst, 'reload schema';` dans le SQL Editor, puis recharger l'app. |
| `relation "<table>" already exists` (dans le SQL Editor) | Script déjà exécuté | Rien à faire : la table existe. |
| `permission denied for table <table>` (dans l'app) | La ligne `grant` du script n'est pas passée | Exécuter uniquement la ligne `grant … to authenticated;` du script. |
| L'app ne voit pas une table pourtant créée | Script exécuté dans un autre projet | Comparer l'identifiant dans l'URL du dashboard (`…/project/<identifiant>`) et dans `VITE_SUPABASE_URL` de `.env.local` (`https://<identifiant>.supabase.co`). |

## Modifier une table existante

Ne pas ré-exécuter le script de création : il échoue (`already exists`). Les modifications (ajout de colonne…) sont décrites dans une section « Migration » en bas du fichier `supabase/<table>.sql` concerné (modèle : `supabase/cv_contact.sql`), à exécuter de la même façon dans le SQL Editor.

## Scripts du repo

| Script | Table | Page |
| --- | --- | --- |
| `supabase/cv_contact.sql` | `cv_contact` | CV |
| `supabase/series.sql` | `series` | Séries |

Chaque nouveau script doit être ajouté ici (voir [NEW_FEATURE.md](../NEW_FEATURE.md)).
