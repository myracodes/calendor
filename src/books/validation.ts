import { currentYear, FIRST_READ_YEAR } from "./readYear"
import type { BookDraft } from "./types"

/** Titre et au moins une autrice saisis : le livre peut être enregistré (sous réserve de l'année). */
export function isDraftComplete(draft: BookDraft): boolean {
  return (
    draft.title.trim() !== "" &&
    draft.authors.some(author => author.trim() !== "")
  )
}

/** Ce qui ne va pas dans l'année de lecture, ou null si elle est valide. */
export function readYearError(draft: BookDraft): string | null {
  const { readYear } = draft
  if (
    Number.isInteger(readYear) &&
    readYear >= FIRST_READ_YEAR &&
    readYear <= currentYear()
  ) {
    return null
  }
  return `L'année de lecture doit être comprise entre ${FIRST_READ_YEAR} et ${currentYear()}.`
}
