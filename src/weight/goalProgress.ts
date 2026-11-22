import { sortByDay } from "./order"
import { roundToTenth } from "./rounding"
import type { WeightEntry } from "./types"

/** Où en est le poids par rapport à l'objectif. */
export type GoalProgress =
  | { reached: true }
  | {
      reached: false
      /** Les kilos qui restent, au dixième près (toujours positifs). */
      remainingKg: number
    }

/**
 * L'écart entre la dernière pesée et l'objectif. Le sens de l'objectif (perdre
 * ou prendre) se déduit de la première pesée : partie au-dessus de l'objectif,
 * il est atteint dès qu'on passe dessous, et inversement.
 * @returns null s'il n'y a pas d'objectif ou pas encore de pesée
 */
export function goalProgress(
  entries: WeightEntry[],
  goalKg: number | null,
): GoalProgress | null {
  if (goalKg === null || entries.length === 0) return null
  const sorted = sortByDay(entries)
  const firstKg = sorted[0].weightKg
  const currentKg = sorted[sorted.length - 1].weightKg
  const remainingKg = roundToTenth(
    firstKg >= goalKg ? currentKg - goalKg : goalKg - currentKg,
  )
  return remainingKg <= 0 ? { reached: true } : { reached: false, remainingKg }
}
