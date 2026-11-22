import { MEASUREMENTS } from "./measurements"
import { roundToTenth } from "./rounding"
import type { WeightEntryDraft } from "./types"

/** Plus grande valeur enregistrable, poids en kg comme tour en cm : les colonnes sont en numeric(4, 1). */
export const MAX_DECIMAL_VALUE = 999.9

/** La valeur saisie (poids, tour), arrondie au dixième ; null si le texte est vide ou n'est pas une valeur possible. */
export function parseDecimal(text: string): number | null {
  const trimmed = text.trim()
  if (trimmed === "") return null
  const value = Number(trimmed.replace(",", "."))
  if (!Number.isFinite(value) || value <= 0 || value > MAX_DECIMAL_VALUE) {
    return null
  }
  return roundToTenth(value)
}

/** Une mesure se laisse vide (pas mesurée) ; remplie, ce doit être une valeur possible. */
function isMeasurementValid(text: string): boolean {
  return text.trim() === "" || parseDecimal(text) !== null
}

/**
 * Une pesée s'enregistre dès qu'elle a un poids (le jour est celui
 * d'aujourd'hui par défaut), à condition que les mesures remplies soient
 * valides.
 */
export function isEntryComplete(draft: WeightEntryDraft): boolean {
  return (
    parseDecimal(draft.weight) !== null &&
    MEASUREMENTS.every(measurement =>
      isMeasurementValid(draft.measurements[measurement.id]),
    )
  )
}
