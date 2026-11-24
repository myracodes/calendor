// Ce qui tombe un jour donné, tiré des données du calendrier (src/events/ et
// anniversaires enregistrés en base).

import { monthOf, weekdayOf } from "../dates"
import type { LifeEvent } from "../events/lifeEvents.type"
import { publicHolidaysForYear } from "../events/publicHolidays"
import { schedulesForWeekday } from "../events/schedules"
import type { Schedule } from "../events/schedules.type"
import type { LifeEventEntry } from "../lifeEvents/types"

function fallsOn(event: LifeEvent, date: Date): boolean {
  return event.month === monthOf(date) && event.day === date.getDate()
}

/** Les anniversaires (de naissance, pas les décès) qui tombent ce jour-là. */
export function birthdaysOn(
  lifeEvents: LifeEventEntry[],
  date: Date,
): LifeEventEntry[] {
  return lifeEvents.filter(
    event => event.kind === "birthday" && fallsOn(event, date),
  )
}

/** Le jour férié du jour, undefined si ce n'en est pas un. */
export function publicHolidayOn(date: Date): LifeEvent | undefined {
  return publicHolidaysForYear(date.getFullYear()).find(holiday =>
    fallsOn(holiday, date),
  )
}

/** Horaires hebdomadaires du jour de la semaine (marché, bibliothèque, piscine…). */
export function schedulesOn(date: Date): Schedule[] {
  return schedulesForWeekday(
    weekdayOf(date.getFullYear(), monthOf(date), date.getDate()),
  )
}
