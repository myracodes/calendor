import type { LifeEventEntry } from "./types"

/** Dans l'ordre de l'année (mois, puis jour) ; le même jour, le premier ajouté en premier. */
export function sortByDate(entries: LifeEventEntry[]): LifeEventEntry[] {
  return [...entries].sort(
    (first, second) =>
      first.month - second.month ||
      first.day - second.day ||
      first.createdAt.localeCompare(second.createdAt),
  )
}
