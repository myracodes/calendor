import { plural } from "../french"
import type { ChartPoint } from "./chartPoints"
import { formatFullDay, formatKg, formatWithUnit } from "./format"
import type { WeightPeriod } from "./periods"
import type { WeightEntry } from "./types"

/** « Pesée du 22 novembre 2026 », dans les toasts. */
export function entryLabel(entry: WeightEntry): string {
  return `Pesée du ${formatFullDay(entry.measuredOn)}`
}

/** « de 68,1 kg à 65,2 kg », ou la seule valeur quand il n'y a qu'un point. */
function rangeOf(points: ChartPoint[], unit: string): string {
  const first = formatWithUnit(points[0].value, unit)
  if (points.length === 1) return first
  return `de ${first} à ${formatWithUnit(points[points.length - 1].value, unit)}`
}

/**
 * La courbe du poids en une phrase, pour les lecteurs d'écran : « Courbe du
 * poids sur 6 mois : 12 pesées, de 68,1 kg à 65,2 kg. Objectif : 60 kg. »
 * @param points les poids de la période, le plus ancien en premier (au moins un)
 */
export function weightChartDescription(
  period: WeightPeriod,
  points: ChartPoint[],
  goalKg: number | null,
): string {
  const goal = goalKg === null ? "" : ` Objectif : ${formatKg(goalKg)}.`
  return `Courbe du poids ${period.description} : ${plural(points.length, "pesée", "pesées")}, ${rangeOf(points, "kg")}.${goal}`
}

/**
 * Les courbes des mesures en une phrase, pour les lecteurs d'écran : « Courbes
 * des mesures sur 6 mois : taille de 80 cm à 78 cm, cuisse 55 cm. »
 * @param series les mesures prises sur la période (au moins un point chacune)
 */
export function measurementsChartDescription(
  period: WeightPeriod,
  series: { label: string; points: ChartPoint[] }[],
): string {
  const measured = series.map(
    measurement =>
      `${measurement.label.toLowerCase()} ${rangeOf(measurement.points, "cm")}`,
  )
  return `Courbes des mesures ${period.description} : ${measured.join(", ")}.`
}
