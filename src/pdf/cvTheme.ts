// Tokens de style du document CV : palette violet/doré reprise du CV d'origine.
// Ces couleurs sont propres au PDF (impression sur fond blanc), sans lien avec
// les tokens du thème de l'app (src/index.css).

export const CV_VIOLET = "#6d4fc4" // violet principal : titres, intitulés de postes, mots-clés en gras
export const CV_VIOLET_SOFT = "#8a7ab8" // violet atténué : lignes secondaires (employeur, équipe)
export const CV_GOLD = "#c8860f" // doré foncé : liens et séparateurs "/", lisible sur fond blanc
export const CV_GOLD_LIGHT = "#f7cf5f" // doré clair : soulignés des titres de section et filet vertical (décoratif)
export const CV_TEXT = "#2e2a3a" // texte courant : quasi-noir légèrement violacé
export const CV_VIOLET_BG = "#845ec2" // fond de la colonne de gauche (violet du CV d'origine)
export const CV_AMBER = "#ffc75f" // jaune ambre du CV d'origine : titres et liens posés sur le fond violet
export const CV_WHITE = "#ffffff" // texte courant sur le fond violet (contraste ≈ 4,8:1)
export const CV_FONT = "Quicksand" // sans-serif arrondie du CV (enregistrée dans shared.tsx)
export const CV_FONT_DISPLAY = "BadScript" // manuscrite réservée au nom et au titre du CV (trop fine pour les titres de section) — une seule graisse disponible
