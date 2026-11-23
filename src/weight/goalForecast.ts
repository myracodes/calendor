import { dayFromNumber, dayNumber } from "../dates"
import { sortByDay } from "./order"
import type { WeightEntry } from "./types"
import { kgPerDay } from "./weightChange"

/**
 * Le jour où l'objectif serait atteint en gardant le rythme moyen depuis la
 * première pesée, projeté à partir de la dernière pesée.
 * @returns le jour ISO ; null s'il n'y a pas d'objectif, moins de deux pesées
 * sur des jours différents, un objectif déjà atteint, ou un rythme qui ne va
 * pas vers l'objectif
 */
export function goalForecast(
  entries: WeightEntry[],
  goalKg: number | null,
): string | null {
  if (goalKg === null || entries.length < 2) return null
  const sorted = sortByDay(entries)
  const current = sorted[sorted.length - 1]
  const pace = kgPerDay(sorted[0], current)
  if (pace === null) return null
  // Négatif quand le rythme s'éloigne de l'objectif (ou qu'il est dépassé),
  // infini ou NaN quand le poids ne bouge pas : pas de date à donner.
  const daysLeft = (goalKg - current.weightKg) / pace
  if (!Number.isFinite(daysLeft) || daysLeft <= 0) return null
  return dayFromNumber(dayNumber(current.measuredOn) + Math.ceil(daysLeft))
}
