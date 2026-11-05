import { findSeriesByName } from "./bookSeries"
import { currentYear, FIRST_READ_YEAR } from "./readYear"
import type {
  BookDraft,
  BookSeries,
  BookSeriesDraft,
  NewBookForm,
} from "./types"

function isFilled(text: string): boolean {
  return text.trim() !== ""
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 1
}

/** Titre et au moins une autrice saisis : le livre seul peut être enregistré (sous réserve de l'année). */
export function isDraftComplete(draft: BookDraft): boolean {
  return isFilled(draft.title) && draft.authors.some(isFilled)
}

/**
 * Le formulaire d'ajout peut être envoyé (sous réserve de l'année) : titre et
 * autrice pour un livre seul ; numéro de tome pour une série, plus une
 * autrice si la série est nouvelle.
 */
export function isNewBookComplete(
  form: NewBookForm,
  seriesList: BookSeries[],
): boolean {
  if (!isFilled(form.seriesName)) {
    return isFilled(form.title) && form.authors.some(isFilled)
  }
  const existing = findSeriesByName(seriesList, form.seriesName)
  return (
    isPositiveInteger(form.volume) &&
    (existing !== undefined || form.authors.some(isFilled))
  )
}

/** Ce qui ne va pas dans l'année de lecture, ou null si elle est valide. */
export function readYearError(readYear: number): string | null {
  if (
    Number.isInteger(readYear) &&
    readYear >= FIRST_READ_YEAR &&
    readYear <= currentYear()
  ) {
    return null
  }
  return `L'année de lecture doit être comprise entre ${FIRST_READ_YEAR} et ${currentYear()}.`
}

/** Nom et au moins une autrice saisis : la série peut être enregistrée (sous réserve des tomes parus). */
export function isSeriesDraftComplete(draft: BookSeriesDraft): boolean {
  return isFilled(draft.name) && draft.authors.some(isFilled)
}

/**
 * Ce qui ne va pas dans le nombre de tomes parus, ou null : il ne peut pas être
 * inférieur au plus grand tome enregistré.
 */
export function publishedVolumesError(
  draft: BookSeriesDraft,
  highestVolume: number,
): string | null {
  const { publishedVolumes } = draft
  if (publishedVolumes === null) return null
  if (!isPositiveInteger(publishedVolumes)) {
    return "Le nombre de tomes parus doit être un entier positif."
  }
  if (publishedVolumes < highestVolume) {
    return `Le tome ${highestVolume} est enregistré : il faut au moins ${highestVolume} tomes parus.`
  }
  return null
}
