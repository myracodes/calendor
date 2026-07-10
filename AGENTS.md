# Règles pour les agents IA

Règles à respecter dans ce projet. Ce fichier est mis à jour au fil de l'eau.

## Git

- Ne jamais effectuer d'action git (commit, push, branch, reset, etc.). Les opérations git sont gérées manuellement par Myriam.

## CSS

- Pas de CSS inline (attribut `style` ou objets de style dans le JSX). Si du style est nécessaire, créer un fichier CSS dédié et l'importer.

## Organisation des fichiers

- Un fichier = une responsabilité (données, types, logique d'affichage). Découper plutôt qu'entasser : voir `src/events/` (un fichier de données par catégorie + un fichier de types partagé) et `src/pdf/` (un composant par bloc de mise en page, tokens de style partagés dans `theme.ts`).
