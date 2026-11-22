import { daysBefore, monthsBefore } from "./days"
import type { WeightEntry } from "./types"

export type WeightPeriodId =
  | "twoMonths"
  | "sixMonths"
  | "oneYear"
  | "fiveYears"
  | "allTime"

export interface WeightPeriod {
  id: WeightPeriodId
  /** Libellé dans la liste des périodes. */
  label: string
  /** Fin de phrase pour décrire la courbe (« Courbe du poids sur 6 mois »). */
  description: string
  /** Durée affichée, jusqu'à aujourd'hui ; null = depuis la première pesée. */
  months: number | null
}

/** Les périodes proposées au-dessus de la courbe, de la plus courte à la plus longue. */
export const WEIGHT_PERIODS: WeightPeriod[] = [
  { id: "twoMonths", label: "2 mois", description: "sur 2 mois", months: 2 },
  { id: "sixMonths", label: "6 mois", description: "sur 6 mois", months: 6 },
  { id: "oneYear", label: "1 an", description: "sur 1 an", months: 12 },
  { id: "fiveYears", label: "5 ans", description: "sur 5 ans", months: 60 },
  {
    id: "allTime",
    label: "Depuis le début",
    description: "depuis le début",
    months: null,
  },
]

export const DEFAULT_PERIOD_ID: WeightPeriodId = "sixMonths"

/** La période d'un identifiant, ou celle par défaut pour un identifiant inconnu (réglage enregistré avant un renommage). */
export function findPeriod(id: string): WeightPeriod {
  return (
    WEIGHT_PERIODS.find(period => period.id === id) ??
    (WEIGHT_PERIODS.find(
      period => period.id === DEFAULT_PERIOD_ID,
    ) as WeightPeriod)
  )
}

/**
 * « Depuis le début » couvre au moins deux semaines : avec une ou deux
 * pesées toutes récentes, la courbe garde quelques graduations de dates.
 */
const MIN_ALL_TIME_DAYS = 14

/**
 * Premier jour affiché sur la courbe, qui finit aujourd'hui : `months` mois
 * plus tôt, ou le jour de la première pesée pour « Depuis le début ».
 * @param entries toutes les pesées, la plus ancienne en premier
 */
export function periodStart(
  period: WeightPeriod,
  entries: WeightEntry[],
  today: string,
): string {
  if (period.months !== null) return monthsBefore(today, period.months)
  const minimumStart = daysBefore(today, MIN_ALL_TIME_DAYS)
  const first = entries.at(0)?.measuredOn ?? today
  return first < minimumStart ? first : minimumStart
}

/** Les pesées de `start` à `end` inclus : celles que montre la courbe. */
export function entriesBetween(
  entries: WeightEntry[],
  start: string,
  end: string,
): WeightEntry[] {
  return entries.filter(
    entry => entry.measuredOn >= start && entry.measuredOn <= end,
  )
}
