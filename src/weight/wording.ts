import { plural } from "../french"
import type { ChartPoint } from "./chartPoints"
import { formatFullDay, formatKg, formatWithUnit } from "./format"
import type { GoalProgress } from "./goalProgress"
import type { WeightPeriod } from "./periods"
import type { WeightEntry } from "./types"
import type { WeightChange } from "./weightChange"

/** « Pesée du 22 novembre 2026 », dans les toasts. */
export function entryLabel(entry: WeightEntry): string {
  return `Pesée du ${formatFullDay(entry.measuredOn)}`
}

/** « Plus que 3,2 kg pour atteindre l'objectif. », ou « Objectif atteint ! » */
export function goalProgressLabel(progress: GoalProgress): string {
  if (progress.reached) return "Objectif atteint !"
  return `Plus que ${formatKg(progress.remainingKg)} pour atteindre l'objectif.`
}

/**
 * « 2,9 kg perdus depuis le 1er mars 2026, soit 0,4 kg par semaine. »,
 * « 1,2 kg pris… », ou « Même poids que le 1er mars 2026. » Le rythme est omis
 * quand il n'a pas de sens (pesées du même jour) ou s'arrondit à zéro.
 */
export function weightChangeLabel(change: WeightChange): string {
  const since = formatFullDay(change.since)
  if (change.differenceKg === 0) return `Même poids que le ${since}.`
  const direction = change.differenceKg < 0 ? "perdus" : "pris"
  const pace =
    change.kgPerWeek === null || change.kgPerWeek === 0
      ? ""
      : `, soit ${formatKg(Math.abs(change.kgPerWeek))} par semaine`
  return `${formatKg(Math.abs(change.differenceKg))} ${direction} depuis le ${since}${pace}.`
}

/** « À ce rythme, objectif atteint vers le 14 mars 2027. » */
export function goalForecastLabel(forecastDay: string): string {
  return `À ce rythme, objectif atteint vers le ${formatFullDay(forecastDay)}.`
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
