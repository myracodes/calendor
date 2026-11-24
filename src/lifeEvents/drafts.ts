import type { Month } from "../constants/months"
import type { LifeEventDraft, LifeEventEntry, LifeEventKind } from "./types"

/** Une saisie vide, du type et du mois donnés (ceux de la saisie précédente, pour enchaîner les ajouts). */
export function emptyDraft(kind: LifeEventKind, month: Month): LifeEventDraft {
  return { id: null, kind, name: "", day: "", month, year: "", deathYear: "" }
}

/** Un anniversaire ou un décès enregistré, ouvert en modification. */
export function toDraft(entry: LifeEventEntry): LifeEventDraft {
  return {
    id: entry.id,
    kind: entry.kind,
    name: entry.name,
    day: String(entry.day),
    month: entry.month,
    year: entry.year === undefined ? "" : String(entry.year),
    deathYear: entry.deathYear === undefined ? "" : String(entry.deathYear),
  }
}

/** Vrai si les deux saisies sont identiques champ par champ : rien à enregistrer. */
export function isSameDraft(
  first: LifeEventDraft,
  second: LifeEventDraft,
): boolean {
  return (
    first.kind === second.kind &&
    first.name === second.name &&
    first.day === second.day &&
    first.month === second.month &&
    first.year === second.year &&
    first.deathYear === second.deathYear
  )
}
