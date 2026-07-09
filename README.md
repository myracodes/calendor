# Calendor

Générateur de calendriers PDF avec un design « imitation papier » et des polices manuscrites.

## Fonctionnalités (POC)

- Choix de la période : année, premier mois, nombre de mois (une page A4 paysage par mois)
- Illustration personnalisée (PNG/JPEG) affichée en haut de chaque page
- Événements récurrents ou ponctuels affichés dans les cases du calendrier :
  - quotidien (tous les jours)
  - mensuel (le jour N de chaque mois)
  - date unique
- Génération et téléchargement du PDF côté client (aucun serveur)

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript
- [@react-pdf/renderer](https://react-pdf.org) pour la génération du PDF
- Dates calculées en UTC natif (`Date.UTC`) — aucune librairie de dates
- Polices manuscrites [Patrick Hand](https://fonts.google.com/specimen/Patrick+Hand) et [Kalam](https://fonts.google.com/specimen/Kalam) (licence OFL), embarquées dans `public/fonts/`

## Développement

```sh
npm install
npm run dev      # serveur de développement
npm run build    # build de production
npm run lint     # lint (oxlint)
```
