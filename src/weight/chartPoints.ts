import type { MeasurementId, WeightEntry } from "./types"

/** Un point d'une courbe : une valeur (kg, cm) un jour donné. */
export interface ChartPoint {
  /** Jour ISO « aaaa-mm-jj ». */
  day: string
  value: number
}

/** Les poids des pesées, dans leur ordre (le plus ancien en premier). */
export function weightPoints(entries: WeightEntry[]): ChartPoint[] {
  return entries.map(entry => ({
    day: entry.measuredOn,
    value: entry.weightKg,
  }))
}

/** Les valeurs d'une mesure, aux seuls jours où elle a été prise. */
export function measurementPoints(
  entries: WeightEntry[],
  id: MeasurementId,
): ChartPoint[] {
  const points: ChartPoint[] = []
  for (const entry of entries) {
    const value = entry.measurements[id]
    if (value !== null) points.push({ day: entry.measuredOn, value })
  }
  return points
}
