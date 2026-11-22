import type { WeightEntry } from "./types"

/** Les pesées dans l'ordre des jours, la plus ancienne en premier : l'ordre de la courbe. */
export function sortByDay(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort((first, second) =>
    first.measuredOn.localeCompare(second.measuredOn),
  )
}

/** Les pesées, la plus récente en premier : l'ordre de l'historique. */
export function sortNewestFirst(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort((first, second) =>
    second.measuredOn.localeCompare(first.measuredOn),
  )
}
