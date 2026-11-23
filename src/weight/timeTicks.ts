// Graduations de dates sous la courbe : leur écart s'adapte à la période
// affichée et à la largeur disponible.

import { MONTH } from "../constants/months"
import { WEEKDAY } from "../constants/weekdays"
import {
  addMonths,
  dayFromNumber,
  dayNumber,
  monthShortName,
  toIso,
  weekdayOf,
} from "../dates"
import { splitDay } from "./days"
import { formatDayAndMonth } from "./format"

export interface TimeTick {
  /** Jour de la graduation, ISO « aaaa-mm-jj ». */
  day: string
  /** « 3 nov. » (semaines), « nov. » (mois), « 2026 » (années et mois de janvier). */
  label: string
}

interface TickStep {
  unit: "week" | "month" | "year"
  count: number
}

/** Écarts possibles entre deux graduations, du plus fin au plus large. */
const TICK_STEPS: TickStep[] = [
  { unit: "week", count: 1 },
  { unit: "week", count: 2 },
  { unit: "month", count: 1 },
  { unit: "month", count: 2 },
  { unit: "month", count: 3 },
  { unit: "month", count: 6 },
  { unit: "year", count: 1 },
  { unit: "year", count: 2 },
  { unit: "year", count: 5 },
  { unit: "year", count: 10 },
]

/** Les lundis, toutes les `count` semaines. */
function weekTicks(start: string, end: string, count: number): TimeTick[] {
  const { year, month, day } = splitDay(start)
  const toMonday = (WEEKDAY.LUNDI - weekdayOf(year, month, day) + 7) % 7
  const ticks: TimeTick[] = []
  for (
    let number = dayNumber(start) + toMonday;
    number <= dayNumber(end);
    number += 7 * count
  ) {
    const tick = dayFromNumber(number)
    ticks.push({ day: tick, label: formatDayAndMonth(tick, "short") })
  }
  return ticks
}

/** Les 1ers du mois, tous les `count` mois en partant de janvier ; janvier porte l'année. */
function monthTicks(start: string, end: string, count: number): TimeTick[] {
  const ticks: TimeTick[] = []
  const first = splitDay(start)
  for (let offset = 0; ; offset++) {
    const { year, month } = addMonths(first.year, first.month, offset)
    const tick = toIso(year, month, 1)
    if (tick > end) return ticks
    if (tick >= start && (month - MONTH.JANVIER) % count === 0) {
      ticks.push({
        day: tick,
        label: month === MONTH.JANVIER ? String(year) : monthShortName(month),
      })
    }
  }
}

/** Les 1ers janvier des années multiples de `count`. */
function yearTicks(start: string, end: string, count: number): TimeTick[] {
  const ticks: TimeTick[] = []
  for (let year = splitDay(start).year; year <= splitDay(end).year; year++) {
    const tick = toIso(year, MONTH.JANVIER, 1)
    if (tick >= start && year % count === 0) {
      ticks.push({ day: tick, label: String(year) })
    }
  }
  return ticks
}

function ticksForStep(step: TickStep, start: string, end: string): TimeTick[] {
  if (step.unit === "week") return weekTicks(start, end, step.count)
  if (step.unit === "month") return monthTicks(start, end, step.count)
  return yearTicks(start, end, step.count)
}

/**
 * Les graduations de dates entre `start` et `end` (inclus) : le plus petit
 * écart qui en donne au plus `maxCount`, pour qu'elles ne se chevauchent pas.
 */
export function timeTicks(
  start: string,
  end: string,
  maxCount: number,
): TimeTick[] {
  let ticks: TimeTick[] = []
  for (const step of TICK_STEPS) {
    ticks = ticksForStep(step, start, end)
    if (ticks.length <= maxCount) return ticks
  }
  return ticks
}
