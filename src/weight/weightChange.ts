import { dayNumber } from "./days"
import { sortByDay } from "./order"
import { roundToTenth } from "./rounding"
import type { WeightEntry } from "./types"

const DAYS_PER_WEEK = 7

/** L'évolution du poids entre la première pesée et la dernière. */
export interface WeightChange {
  /** Le jour de la première pesée, au format ISO. */
  since: string
  /** La dernière pesée moins la première, au dixième près : négatif quand on a perdu. */
  differenceKg: number
  /** Le rythme moyen, au dixième près (négatif quand on perd) ; null si les deux pesées sont du même jour. */
  kgPerWeek: number | null
}

/**
 * Le rythme moyen entre deux pesées, en kg par jour (négatif quand on perd).
 * @returns null si elles sont du même jour
 */
export function kgPerDay(first: WeightEntry, last: WeightEntry): number | null {
  const elapsedDays = dayNumber(last.measuredOn) - dayNumber(first.measuredOn)
  if (elapsedDays === 0) return null
  return (last.weightKg - first.weightKg) / elapsedDays
}

/**
 * L'écart entre la première pesée et la dernière, et le rythme moyen entre les deux.
 * @returns null tant qu'il y a moins de deux pesées
 */
export function weightChange(entries: WeightEntry[]): WeightChange | null {
  if (entries.length < 2) return null
  const sorted = sortByDay(entries)
  const first = sorted[0]
  const current = sorted[sorted.length - 1]
  const pace = kgPerDay(first, current)
  return {
    since: first.measuredOn,
    differenceKg: roundToTenth(current.weightKg - first.weightKg),
    kgPerWeek: pace === null ? null : roundToTenth(pace * DAYS_PER_WEEK),
  }
}
