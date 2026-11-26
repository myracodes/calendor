# Ajouter une utilisatrice

Calendor n'a pas d'inscription : les comptes se créent à la main dans le dashboard Supabase. Un compte = un email et un mot de passe, qui ouvrent l'app (verrou de `App.tsx`) en local comme en prod.

## Créer le compte

1. Dashboard Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Renseigner l'email et un mot de passe.
3. Cocher **Auto Confirm User** : sans ça, le compte reste en attente d'une confirmation par email, que l'app ne prévoit pas.
4. **Create user**.
5. Lui transmettre l'email et le mot de passe par un canal privé (pas dans le repo, ni dans un message public).

Elle se connecte ensuite sur le site avec ces identifiants.

## Mot de passe oublié

Sur l'écran de connexion : saisir l'email, puis **Mot de passe oublié ?**. Supabase envoie un lien qui ouvre l'app sur l'écran **Nouveau mot de passe** ; une fois le mot de passe enregistré, l'app s'ouvre. Le lien ne sert qu'une fois et expire au bout d'une heure : passé ce délai, l'écran de connexion le signale, il suffit d'en redemander un.

Le bouton **Send password recovery** du dashboard (Authentication → Users → menu de la ligne) envoie le même email.

### Adresses des liens (réglage à faire une fois)

Dashboard Supabase → **Authentication** → **URL Configuration** :

- **Site URL** : `https://myracodes.github.io/calendor/`. C'est là que mènent les liens des emails par défaut, notamment ceux envoyés depuis le dashboard. La valeur d'origine, `http://localhost:3000`, ne mène nulle part.
- **Redirect URLs** : ajouter `https://myracodes.github.io/calendor/` et `http://localhost:5173/calendor/`. Un lien demandé depuis l'app ramène sur l'adresse d'où il a été demandé (en local ou en ligne) seulement si elle figure dans cette liste ; sinon, il mène à la Site URL. Les deux marchent, puisque le local et la prod partagent le même projet Supabase.

### Limites de l'email par défaut de Supabase

Sans serveur d'envoi personnalisé (**Authentication** → **Emails** → **SMTP Settings**), Supabase n'envoie d'emails qu'aux adresses des membres de l'organisation Supabase, et au plus 2 par heure pour tout le projet. Pour les autres comptes (compte de test, autre utilisatrice), l'app affiche « L'email n'a pas pu être envoyé » ; le détail (`email_address_not_authorized`) apparaît dans **Logs** → **Auth**. Deux solutions : configurer un SMTP (Resend, Brevo… ont une offre gratuite), ou changer le mot de passe à la main (ci-dessous).

### Changer le mot de passe à la main

Pour un compte qui ne reçoit pas l'email (compte de test…). Dans le **SQL Editor**, en remplaçant les deux valeurs :

```sql
update auth.users
set encrypted_password = extensions.crypt('NOUVEAU_MOT_DE_PASSE', extensions.gen_salt('bf', 10))
where email = 'EMAIL_DU_COMPTE'
returning email;
```

Le résultat doit afficher une ligne avec l'email du compte ; aucune ligne = email mal orthographié. Le mot de passe est écrit en clair dans la requête : supprimer ensuite la requête de la liste du SQL Editor, qui la garde en mémoire, et ne jamais la copier dans le repo.

## Vérifier que les inscriptions restent fermées

À faire une fois, ou en cas de doute : **Authentication** → **Sign In / Providers** → l'option **Allow new users to sign up** doit être désactivée. Sinon, n'importe qui pourrait se créer un compte via l'API Supabase (l'URL et la clé "anon" sont publiques, dans le bundle).

## Ce qu'elle verra

Chaque table choisit, par ses règles RLS (`supabase/*.sql`), si ses données sont propres à chaque compte ou partagées entre tous les comptes connectés.

| Table | Données | Accès |
| --- | --- | --- |
| `series` | Séries suivies | Propres à chaque compte : elle démarre avec une liste vide et ne voit pas les séries des autres. |
| `books` | Livres lus | Propres à chaque compte : elle démarre avec une liste vide et ne voit pas les lectures des autres. |
| `book_series` | Séries de livres (BD, mangas…) | Propres à chaque compte, comme `books`. |
| `recommendations` | Recos culturelles (films, comédies musicales, livres, séries) | Propres à chaque compte : elle démarre avec des listes vides et ne voit pas les recos des autres. |
| `gift_recipients` | Personnes de la page Idées cadeaux | Propres à chaque compte : elle démarre sans personne et ne voit pas les listes des autres. |
| `gift_ideas` | Idées cadeaux de chaque personne | Propres à chaque compte, comme `gift_recipients`. |
| `planning_tasks` | Tâches du planning | Propres à chaque compte : elle démarre avec un planning vide et ne voit pas celui des autres. |
| `life_events` | Anniversaires et décès (calendriers, accueil) | Propres à chaque compte : elle démarre sans anniversaire et ne voit pas ceux des autres. |

| `cv_contact` | Coordonnées du CV de Myriam | **Partagées** : tout compte connecté peut les lire (en générant le CV). À restreindre si le compte n'est pas pour une personne de confiance. |

Le reste de l'app (réglages des calendriers, courses, courrier…) n'utilise pas encore la base : les réglages sont gardés dans le navigateur de chacune (`localStorage`), donc séparés.

**À tenir à jour** : chaque nouvelle table Supabase doit être ajoutée à ce tableau (voir [NEW_FEATURE.md](../NEW_FEATURE.md)).

## Supprimer un compte

**Authentication** → **Users** → menu de la ligne → **Delete user**. Ses données propres (ex. ses séries) sont supprimées avec lui (`on delete cascade` sur `user_id`).
