// Jours fériés affichés par le planning, tirés du calcul du calendrier
// (src/events/publicHolidays.ts) : ils ne sont pas en base.

import { toIso } from "../dates"
import { publicHolidaysForYear } from "../events/publicHolidays"
import type { DayRange } from "./range"

/** Les jours fériés de la fenêtre : leur nom, par jour ISO « aaaa-mm-jj ». */
export function publicHolidaysIn(range: DayRange): Map<string, string> {
  const holidays = new Map<string, string>()
  const firstYear = Number(range.from.slice(0, 4))
  const lastYear = Number(range.to.slice(0, 4))
  for (let year = firstYear; year <= lastYear; year++) {
    for (const holiday of publicHolidaysForYear(year)) {
      const day = toIso(year, holiday.month, holiday.day)
      if (day >= range.from && day <= range.to) holidays.set(day, holiday.name)
    }
  }
  return holidays
}
