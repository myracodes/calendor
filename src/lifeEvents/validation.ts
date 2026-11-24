import type { Month } from "../constants/months"
import { daysInMonth } from "../dates"
import type { LifeEventDraft, LifeEventKind } from "./types"

/** Une saisie valide, convertie en valeurs à enregistrer. */
export interface LifeEventValues {
  kind: LifeEventKind
  name: string
  month: Month
  day: number
  year: number | null
  deathYear: number | null
}

// Année bissextile de référence : le 29 février reste permis, la date revenant chaque année.
const LEAP_YEAR = 2024

/** Dernier jour possible du mois, 29 en février. */
export function maxDayOf(month: Month): number {
  return daysInMonth(LEAP_YEAR, month)
}

/** Année facultative tapée dans un champ : null s'il est vide, NaN si elle n'est pas valide. */
function parseOptionalYear(text: string): number | null {
  const trimmed = text.trim()
  if (trimmed === "") return null
  const year = /^\d{1,4}$/.test(trimmed) ? Number(trimmed) : Number.NaN
  return year >= 1 ? year : Number.NaN
}

/** Les valeurs de la saisie, ou null s'il manque le nom ou si un nombre n'est pas valide. */
export function parseLifeEventDraft(
  draft: LifeEventDraft,
): LifeEventValues | null {
  const name = draft.name.trim()
  const dayText = draft.day.trim()
  const day = /^\d{1,2}$/.test(dayText) ? Number(dayText) : Number.NaN
  const year = parseOptionalYear(draft.year)
  // L'année du décès ne vaut que pour un anniversaire (champ masqué pour un décès).
  const deathYear =
    draft.kind === "birthday" ? parseOptionalYear(draft.deathYear) : null

  if (name === "" || !(day >= 1 && day <= maxDayOf(draft.month))) return null
  if (Number.isNaN(year) || Number.isNaN(deathYear)) return null
  if (year !== null && deathYear !== null && deathYear < year) return null
  return { kind: draft.kind, name, month: draft.month, day, year, deathYear }
}

export function isDraftComplete(draft: LifeEventDraft): boolean {
  return parseLifeEventDraft(draft) !== null
}
