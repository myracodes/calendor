import type { LifeEvent } from "../events/lifeEvents.type"
import { lifeEventLabel } from "../pdf/calendar/calendarData"

const TIME_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
})

const LONG_DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})

/** « 14:05 » */
export function formatTime(date: Date): string {
  return TIME_FORMAT.format(date)
}

/** « samedi 21 novembre 2026 » (la majuscule est mise par le CSS). */
export function formatLongDate(date: Date): string {
  return LONG_DATE_FORMAT.format(date)
}

/** « 8° » */
export function formatTemperature(celsius: number): string {
  return `${celsius}°`
}

/**
 * « 🎂 Maman (63 ans) », ou le seul nom si l'année de naissance n'est pas connue.
 * Une personne décédée garde le libellé du calendrier (« 🎂 Papi (1924-2003) »).
 */
export function formatBirthday(
  birthday: LifeEvent,
  currentYear: number,
): string {
  if (birthday.year === undefined || birthday.deathYear !== undefined) {
    return lifeEventLabel("🎂", birthday, currentYear, true)
  }
  return `🎂 ${birthday.name} (${currentYear - birthday.year} ans)`
}
