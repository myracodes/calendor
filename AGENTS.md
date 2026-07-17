# Règles pour les agents IA

Règles à respecter dans ce projet. Ce fichier est mis à jour au fil de l'eau.

## Git

- Ne jamais effectuer d'action git (commit, push, branch, reset, etc.). Les opérations git sont gérées manuellement par Myriam.

## CSS

- Pas de CSS inline (attribut `style` ou objets de style dans le JSX). Si du style est nécessaire, créer un fichier CSS dédié et l'importer.
- Les couleurs doivent toujours garantir un score d'accessibilité optimal : viser un contraste WCAG AAA (≥ 7:1 pour le texte) sur les fonds du thème (`--paper`, `--surface`). Utiliser les tokens du thème (`src/index.css`) — notamment `--success`, `--info`, `--warning`, `--danger` — plutôt que des couleurs en dur. Si besoin d'ajouter des couleurs, demander la permission en justifiant le besoin, puis vérifier le ratio. 

## Icônes (SVG)

- Pas de SVG inline dans le JSX : chaque icône vit dans un fichier `.svg` de `src/assets/icons/`, importé comme URL (`import eyeIcon from "…/assets/icons/eye.svg"`) et affiché via `<img>`. Avant de créer une icône, vérifier si elle n'existe pas déjà dans ce dossier.
- Un SVG affiché via `<img>` n'hérite pas du CSS de la page (`currentColor`, variables) : fixer la couleur dans le fichier `.svg` avec la valeur hexadécimale d'un token du thème, et l'indiquer en commentaire dans le fichier (ex. `#3b3554 = token "ink"`).

## Organisation des fichiers

- Un fichier = une responsabilité (données, types, logique d'affichage). Découper plutôt qu'entasser : voir `src/events/` (un fichier de données par catégorie + un fichier de types partagé) et `src/pdf/` (un composant par bloc de mise en page, tokens de style partagés dans `theme.ts`).
- Composants : `src/components/` ne contient que les composants partagés (utilisés par l'app ou par plusieurs pages, ex. `Navbar`, `IllustrationSection`). Un composant propre à une seule page vit dans `src/pages/<Page>/components/<Composant>/`.
- Jours et mois : ne jamais écrire un chiffre "magique" pour désigner un jour de la semaine ou un mois — utiliser les constantes partagées de `src/constants/` (`WEEKDAY.MARDI`, `MONTH.JUILLET`) et les types `Weekday` / `Month` associés.

## Commandes terminal

- Avant de demander une autorisation pour une commande dans le terminal, toujours expliquer à quoi elle sert et comment elle est construite (en une ligne)

## Langue

- Le code (identifiants, noms de variables/fonctions/fichiers) est en anglais (ex. `setLanguage`, pas `setLangue`), sauf si l'anglais rend vraiment le code incompréhensible. L'exception : quand le code manipule directement des données en français (libellés d'articles, presets, événements…), rester en français a du sens (ex. `src/courses/`, où `SelectionParCategorie` ou `validerSelection` collent aux données qu'ils décrivent).
- Documents multilingues : certains contenus existent en plusieurs langues (ex. le CV : `src/cv/dataFr.ts` / `src/cv/dataEn.ts`). Lors d'une modification du contenu ou de la structure d'une langue, vérifier si l'autre langue est concernée et la mettre à jour si nécessaire.

## Commentaires

- Pas besoin de rédiger les commentaires en anglais. Ce projet est une sorte de `util` personnel, qui n'a pas vocation à être partagé, ni développé avec des non-francophones.
- Dans les styles des PDF (`StyleSheet.create` de `src/pdf/`), le nom de la clé de style doit se suffire à lui-même : si un nom comme `itemTitre`/`itemTexte` ne dit pas à quoi correspond l'item, le renommer (`itemLabel`/`itemDetail`…) plutôt que de compenser par un commentaire.
- Le commentaire qui dit à quoi correspond un style sur la page (ex. "Conteneur d'une section de la colonne (Formation, Compétences…)") vit au-dessus de la clé du style, pas éparpillé sur ses propriétés — c'est là qu'on le cherche, et il ne s'écrit qu'une fois. Les commentaires sur les propriétés, eux, ne justifient qu'une valeur précise (voir ligne suivante) : ne pas y répéter ce que dit déjà le commentaire de la clé.
- Ne pas commenter ce qu'une propriété CSS fait déjà comprendre par elle-même (un `marginBottom` espace avec l'élément suivant, un `flexDirection: row` aligne les enfants en ligne, un `fontWeight: bold` met en gras…). Commenter uniquement ce qui n'est pas déductible de la ligne : un choix de valeur précis (pourquoi 31% et pas un tiers rond), une couleur/police posée pour une raison propre à cet usage (et non déjà expliquée à la définition du token), un contournement d'une limite de react-pdf, une dépendance entre deux styles (un margin qui s'aligne sur un autre).