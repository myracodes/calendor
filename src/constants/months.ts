/**
 * Mois de l'année, numérotés comme partout dans l'app : 1 = janvier … 12 = décembre.
 * À utiliser à la place d'un chiffre dès qu'une valeur désigne un mois : `MONTH.JUILLET`.
 */
export const MONTH = {
  JANVIER: 1,
  FÉVRIER: 2,
  MARS: 3,
  AVRIL: 4,
  MAI: 5,
  JUIN: 6,
  JUILLET: 7,
  AOÛT: 8,
  SEPTEMBRE: 9,
  OCTOBRE: 10,
  NOVEMBRE: 11,
  DÉCEMBRE: 12,
} as const

/** Numéro d'un mois (1 = janvier … 12 = décembre). */
export type Month = (typeof MONTH)[keyof typeof MONTH]
