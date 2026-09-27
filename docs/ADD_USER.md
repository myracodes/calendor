# Ajouter une utilisatrice

Calendor n'a pas d'inscription : les comptes se créent à la main dans le dashboard Supabase. Un compte = un email et un mot de passe, qui ouvrent l'app (verrou de `App.tsx`) en local comme en prod.

## Créer le compte

1. Dashboard Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Renseigner l'email et un mot de passe.
3. Cocher **Auto Confirm User** : sans ça, Supabase attend qu'elle clique un lien de confirmation par email, et l'app n'envoie aucun email.
4. **Create user**.
5. Lui transmettre l'email et le mot de passe par un canal privé (pas dans le repo, ni dans un message public).

Elle se connecte ensuite sur le site avec ces identifiants. L'app n'a pas encore d'écran pour changer de mot de passe.

## Vérifier que les inscriptions restent fermées

À faire une fois, ou en cas de doute : **Authentication** → **Sign In / Providers** → l'option **Allow new users to sign up** doit être désactivée. Sinon, n'importe qui pourrait se créer un compte via l'API Supabase (l'URL et la clé "anon" sont publiques, dans le bundle).

## Ce qu'elle verra

Chaque table choisit, par ses règles RLS (`supabase/*.sql`), si ses données sont propres à chaque compte ou partagées entre tous les comptes connectés.

| Table | Données | Accès |
| --- | --- | --- |
| `series` | Séries suivies | Propres à chaque compte : elle démarre avec une liste vide et ne voit pas les séries des autres. |
| `cv_contact` | Coordonnées du CV de Myriam | **Partagées** : tout compte connecté peut les lire (en générant le CV). À restreindre si le compte n'est pas pour une personne de confiance. |

Le reste de l'app (calendriers, courses, courrier…) n'utilise pas encore la base : les réglages sont gardés dans le navigateur de chacune (`localStorage`), donc séparés.

**À tenir à jour** : chaque nouvelle table Supabase doit être ajoutée à ce tableau (voir [NEW_FEATURE.md](../NEW_FEATURE.md)).

## Supprimer un compte

**Authentication** → **Users** → menu de la ligne → **Delete user**. Ses données propres (ex. ses séries) sont supprimées avec lui (`on delete cascade` sur `user_id`).
