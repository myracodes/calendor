// Calculs sur les jours ISO « aaaa-mm-jj » des pesées, en UTC comme
// src/dates.ts : un jour reste le même quel que soit le fuseau.

import {
  addMonths,
  dayFromNumber,
  dayNumber,
  daysInMonth,
  toIso,
} from "../dates"

/** @returns month 1-12 */
export function splitDay(iso: string): {
  year: number
  month: number
  day: number
} {
  const [year, month, day] = iso.split("-").map(Number)
  return { year, month, day }
}

/** Le jour ISO, `days` jours plus tôt. */
export function daysBefore(iso: string, days: number): string {
  return dayFromNumber(dayNumber(iso) - days)
}

/**
 * Le même jour, `months` mois plus tôt ; le dernier jour du mois quand il
 * n'existe pas (31 mai − 3 mois = 28 ou 29 février).
 */
export function monthsBefore(iso: string, months: number): string {
  const { year, month, day } = splitDay(iso)
  const target = addMonths(year, month, -months)
  return toIso(
    target.year,
    target.month,
    Math.min(day, daysInMonth(target.year, target.month)),
  )
}
