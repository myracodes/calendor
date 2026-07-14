import { MONTH, type Month } from "../constants/months"
import type { LifeEvent } from "./lifeEvents.type"

/**
 * Jours fériés français.
 *
 * Les jours fixes sont listés tels quels ; ceux qui dépendent de Pâques
 * (lundi de Pâques, Ascension, lundi de Pentecôte) sont calculés
 * automatiquement pour l'année demandée via publicHolidaysForYear().
 */

const FIXED_PUBLIC_HOLIDAYS: LifeEvent[] = [
  { name: "Jour de l'an", day: 1, month: MONTH.JANVIER },
  { name: "Fête du travail", day: 1, month: MONTH.MAI },
  { name: "Victoire 1945", day: 8, month: MONTH.MAI },
  { name: "Fête nationale", day: 14, month: MONTH.JUILLET },
  { name: "Assomption", day: 15, month: MONTH.AOÛT },
  { name: "Toussaint", day: 1, month: MONTH.NOVEMBRE },
  { name: "Armistice", day: 11, month: MONTH.NOVEMBRE },
  { name: "Noël", day: 25, month: MONTH.DÉCEMBRE },
]

const EASTER_BASED_HOLIDAYS = [
  { name: "Lundi de Pâques", offsetDays: 1 },
  { name: "Ascension", offsetDays: 39 },
  { name: "Lundi de Pentecôte", offsetDays: 50 },
]

/** Dimanche de Pâques d'une année donnée (algorithme de Meeus/Jones/Butcher). */
function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) // 3 = mars, 4 = avril
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

/** Tous les jours fériés (fixes et mobiles) d'une année donnée. */
export function publicHolidaysForYear(year: number): LifeEvent[] {
  const easter = easterSunday(year)
  const movable = EASTER_BASED_HOLIDAYS.map(({ name, offsetDays }) => {
    const date = new Date(easter)
    date.setDate(easter.getDate() + offsetDays)
    // mois calculé depuis la date de Pâques (mars à juin), d'où le cast vers Month
    return { name, day: date.getDate(), month: (date.getMonth() + 1) as Month }
  })
  return [...FIXED_PUBLIC_HOLIDAYS, ...movable]
}
