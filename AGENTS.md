# Règles pour les agents IA

Règles à respecter dans ce projet. Ce fichier est mis à jour au fil de l'eau.

## Git

- Ne jamais effectuer d'action git (commit, push, branch, reset, etc.). Les opérations git sont gérées manuellement par Myriam.

## CSS

- Pas de CSS inline (attribut `style` ou objets de style dans le JSX). Si du style est nécessaire, créer un fichier CSS dédié et l'importer.

## Organisation des fichiers

- Un fichier = une responsabilité (données, types, logique d'affichage). Découper plutôt qu'entasser : voir `src/events/` (un fichier de données par catégorie + un fichier de types partagé) et `src/pdf/` (un composant par bloc de mise en page, tokens de style partagés dans `theme.ts`).
- Composants : `src/components/` ne contient que les composants partagés (utilisés par l'app ou par plusieurs pages, ex. `Navbar`, `IllustrationSection`). Un composant propre à une seule page vit dans `src/pages/<Page>/components/<Composant>/`.
- Jours et mois : ne jamais écrire un chiffre "magique" pour désigner un jour de la semaine ou un mois — utiliser les constantes partagées de `src/constants/` (`WEEKDAY.MARDI`, `MONTH.JUILLET`) et les types `Weekday` / `Month` associés.

## Commandes terminal

- Avant de demander une autorisation pour une commande dans le terminal, toujours expliquer à quoi elle sert et comment elle est construite (en une ligne)

## Commentaires

- Pas besoin de rédiger les commentaires en anglais. Ce projet est une sorte de `util` personnel, qui n'a pas vocation à être partagé, ni développé avec des non-francophones.
- Dans les styles des PDF (`StyleSheet.create` de `src/pdf/`), commenter chaque ligne de style (à quoi sert la valeur choisie) pour faciliter la maintenance.