/**
 * Liste des anniversaires affichés sur le calendrier.
 *
 * Une ligne par personne : nom, année de naissance, mois (1-12) et
 * jour (1-31). L'âge affiché est calculé automatiquement à partir de
 * l'année de la page du calendrier.
 */

export interface Birthday {
  name: string
  day: number // 1-31
  month: number // 1-12
  year: number // année de naissance
}

// { name: "Birthday", day: 30, month: 7, year: 1992 },
export const BIRTHDAYS: Birthday[] = [
  { name: "My 🐙", day: 30, month: 7, year: 1992 },
  { name: "QQ ❄️", day: 10, month: 10, year: 1992 },
  { name: "Titi ☀️", day: 3, month: 8, year: 1996 },
  { name: "Dabyoo", day: 28, month: 5, year: 1999 },
  { name: "Lilou", day: 3, month: 11, year: 1997 },
]
