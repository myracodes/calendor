/**
 * Jours de la semaine, indexés comme partout dans l'app : 0 = lundi … 6 = dimanche
 * (semaine à la française, lundi en premier — même convention que weekdayOf et monthGrid).
 * À utiliser à la place d'un chiffre dès qu'une valeur désigne un jour : `WEEKDAY.MARDI`.
 */
export const WEEKDAY = {
  LUNDI: 0,
  MARDI: 1,
  MERCREDI: 2,
  JEUDI: 3,
  VENDREDI: 4,
  SAMEDI: 5,
  DIMANCHE: 6,
} as const

/** Index d'un jour de la semaine (0 = lundi … 6 = dimanche). */
export type Weekday = (typeof WEEKDAY)[keyof typeof WEEKDAY]
