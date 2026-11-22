import type { MeasurementId, WeightEntry } from "./types"

export interface Measurement {
  id: MeasurementId
  /** Libellé du champ et de la colonne de l'historique, sans l'unité (toujours le cm). */
  label: string
}

/** Les tours qu'on peut mesurer avec une pesée, tous facultatifs, dans l'ordre des champs et des colonnes. */
export const MEASUREMENTS: Measurement[] = [
  { id: "waist", label: "Taille" },
  { id: "belly", label: "Ventre" },
  { id: "hip", label: "Hanche" },
  { id: "thigh", label: "Cuisse" },
]

/** Vrai si au moins une mesure a été prise avec cette pesée. */
export function hasMeasurement(entry: WeightEntry): boolean {
  return MEASUREMENTS.some(
    measurement => entry.measurements[measurement.id] !== null,
  )
}

/** Une valeur pour chaque mesure, calculée à partir de son identifiant. */
export function mapMeasurements<Value>(
  valueOf: (id: MeasurementId) => Value,
): Record<MeasurementId, Value> {
  return {
    waist: valueOf("waist"),
    belly: valueOf("belly"),
    hip: valueOf("hip"),
    thigh: valueOf("thigh"),
  }
}
