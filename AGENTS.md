# Règles pour les agents IA

Règles à respecter dans ce projet. Ce fichier est mis à jour au fil de l'eau.

## Git

- Ne jamais effectuer d'action git (commit, push, branch, reset, etc.). Les opérations git sont gérées manuellement par Myriam.

## CSS

- Pas de CSS inline (attribut `style` ou objets de style dans le JSX). Si du style est nécessaire, créer un fichier CSS dédié et l'importer.
- Les couleurs doivent toujours garantir un score d'accessibilité optimal : viser un contraste WCAG AAA (≥ 7:1 pour le texte) sur les fonds du thème (`--paper`, `--surface`). Utiliser les tokens du thème (`src/index.css`) — notamment `--success`, `--info`, `--warning`, `--danger` — plutôt que des couleurs en dur. Si besoin d'ajouter des couleurs, demander la permission en justifiant le besoin, puis vérifier le ratio. 

## Organisation des fichiers

- Un fichier = une responsabilité (données, types, logique d'affichage). Découper plutôt qu'entasser : voir `src/events/` (un fichier de données par catégorie + un fichier de types partagé) et `src/pdf/` (un composant par bloc de mise en page, tokens de style partagés dans `theme.ts`).
- Composants : `src/components/` ne contient que les composants partagés (utilisés par l'app ou par plusieurs pages, ex. `Navbar`, `IllustrationSection`). Un composant propre à une seule page vit dans `src/pages/<Page>/components/<Composant>/`.
- Jours et mois : ne jamais écrire un chiffre "magique" pour désigner un jour de la semaine ou un mois — utiliser les constantes partagées de `src/constants/` (`WEEKDAY.MARDI`, `MONTH.JUILLET`) et les types `Weekday` / `Month` associés.

## Commandes terminal

- Avant de demander une autorisation pour une commande dans le terminal, toujours expliquer à quoi elle sert et comment elle est construite (en une ligne)

## Langue

- Le code (identifiants, noms de variables/fonctions/fichiers) est de préférence en anglais. Mais le projet contient beaucoup de données en français (libellés d'articles, presets, événements…) : quand le code manipule directement ces données, rester en français a du sens (ex. `src/courses/`, où `SelectionParCategorie` ou `validerSelection` collent aux données qu'ils décrivent).

## Commentaires

- Pas besoin de rédiger les commentaires en anglais. Ce projet est une sorte de `util` personnel, qui n'a pas vocation à être partagé, ni développé avec des non-francophones.
- Dans les styles des PDF (`StyleSheet.create` de `src/pdf/`), commenter chaque ligne de style (à quoi sert la valeur choisie) pour faciliter la maintenance.