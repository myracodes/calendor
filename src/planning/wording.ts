// Les dates du planning en toutes lettres, pour les libellés et les messages.

import type { PlanningTask } from "./types"

/** Lit un jour ISO en UTC, comme src/dates.ts : le jour reste le même quel que soit le fuseau. */
function dateOf(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`)
}

function formatter(options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("fr-FR", { ...options, timeZone: "UTC" })
}

const WEEKDAY_SHORT = formatter({ weekday: "short" })
const WEEKDAY_LONG = formatter({ weekday: "long" })
const MONTH_LONG = formatter({ month: "long" })
const MONTH_YEAR = formatter({ month: "long", year: "numeric" })

/** « 1er », « 23 » : le numéro du jour, avec l'ordinal du premier du mois. */
function dayOfMonth(iso: string): string {
  const day = dateOf(iso).getUTCDate()
  return day === 1 ? "1er" : String(day)
}

/** « lun. 23 » : le libellé d'une ligne du planning (le mois est sur la ligne de son intitulé). */
export function shortDay(iso: string): string {
  const date = dateOf(iso)
  return `${WEEKDAY_SHORT.format(date)} ${date.getUTCDate()}`
}

/** « Décembre 2026 » : l'intitulé d'un mois dans le planning. */
export function monthTitle(iso: string): string {
  const text = MONTH_YEAR.format(dateOf(iso))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** « lundi 1er décembre » : un jour dans une phrase. */
export function longDay(iso: string): string {
  const date = dateOf(iso)
  return `${WEEKDAY_LONG.format(date)} ${dayOfMonth(iso)} ${MONTH_LONG.format(date)}`
}

/** « Lundi 1er décembre » : un jour en titre. */
export function longDayTitle(iso: string): string {
  const text = longDay(iso)
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * « le lundi 23 novembre » (ou « au lundi 23 novembre » avec `singleDay` =
 * "au", après un verbe de déplacement), ou « du lundi 23 au mercredi 25
 * novembre » pour une tâche de plusieurs jours.
 */
export function taskPeriod(
  task: Pick<PlanningTask, "startDate" | "endDate">,
  singleDay: "le" | "au" = "le",
): string {
  if (task.startDate === task.endDate) {
    return `${singleDay} ${longDay(task.startDate)}`
  }
  const sameMonth = task.startDate.slice(0, 7) === task.endDate.slice(0, 7)
  const startText = sameMonth
    ? `${WEEKDAY_LONG.format(dateOf(task.startDate))} ${dayOfMonth(task.startDate)}`
    : longDay(task.startDate)
  return `du ${startText} au ${longDay(task.endDate)}`
}
