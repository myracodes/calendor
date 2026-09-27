import type { SeriesDraft } from "./types"

/** Ce qui empêche d'enregistrer la série, ou null si elle est valide. */
export function validateDraft(draft: SeriesDraft): string | null {
  if (draft.name.trim() === "") return "Donne un nom à la série."
  const invalidIndex = draft.seasons.findIndex(
    season => !Number.isInteger(season.episodeCount) || season.episodeCount < 1,
  )
  if (invalidIndex !== -1) {
    return `La saison ${invalidIndex + 1} doit avoir au moins un épisode.`
  }
  return null
}
