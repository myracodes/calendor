import { todayIso } from "../dates"
import { MEASUREMENTS, mapMeasurements } from "./measurements"
import type { WeightEntry, WeightEntryDraft } from "./types"

/** Une nouvelle pesée, datée d'aujourd'hui, sans poids ni mesures. */
export function emptyDraft(): WeightEntryDraft {
  return {
    id: null,
    weight: "",
    measuredOn: todayIso(),
    measurements: mapMeasurements(() => ""),
  }
}

/** Une pesée enregistrée, ouverte en modification. */
export function toDraft(entry: WeightEntry): WeightEntryDraft {
  return {
    id: entry.id,
    weight: String(entry.weightKg),
    measuredOn: entry.measuredOn,
    measurements: mapMeasurements(id => {
      const value = entry.measurements[id]
      return value === null ? "" : String(value)
    }),
  }
}

/** Vrai si les deux saisies sont identiques champ par champ : rien à enregistrer. */
export function isSameDraft(
  first: WeightEntryDraft,
  second: WeightEntryDraft,
): boolean {
  return (
    first.weight === second.weight &&
    first.measuredOn === second.measuredOn &&
    MEASUREMENTS.every(
      measurement =>
        first.measurements[measurement.id] ===
        second.measurements[measurement.id],
    )
  )
}
