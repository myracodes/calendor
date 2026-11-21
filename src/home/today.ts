// Ce qui tombe un jour donné, tiré des données du calendrier (src/events/).

import type { Month } from "../constants/months"
import { weekdayOf } from "../dates"
import { BIRTHDAYS } from "../events/birthdays"
import type { LifeEvent } from "../events/lifeEvents.type"
import { publicHolidaysForYear } from "../events/publicHolidays"
import { schedulesForWeekday } from "../events/schedules"
import type { Schedule } from "../events/schedules.type"

function monthOf(date: Date): Month {
  // getMonth() va de 0 à 11, les mois de l'app de 1 à 12.
  return (date.getMonth() + 1) as Month
}

function fallsOn(event: LifeEvent, date: Date): boolean {
  return event.month === monthOf(date) && event.day === date.getDate()
}

export function birthdaysOn(date: Date): LifeEvent[] {
  return BIRTHDAYS.filter(birthday => fallsOn(birthday, date))
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
