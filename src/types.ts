import type { CalendarLanguage } from "./calendar/languages"

export type EventRule =
  | { kind: "daily" }
  | {
      kind: "weekly"
      /** jours de la semaine (constantes WEEKDAY : 0 = lundi … 6 = dimanche) */
      weekdays: number[]
      /** every N weeks (1 = every week) */
      interval: number
      /** ISO "yyyy-mm-dd" — reference week when interval > 1 */
      anchor: string
    }
  | { kind: "monthly"; day: number }
  | { kind: "once"; date: string } // ISO "yyyy-mm-dd"

export interface CalendarEvent {
  id: string
  label: string
  rule: EventRule
  /** hex color for this event's text/marker; falls back to the base ink color when unset */
  color?: string
}

export type CalendarFormat = "monthly" | "annual" | "weekly"

export interface CalendarSettings {
  format: CalendarFormat
  /** langue du PDF ; seul le français affiche jours fériés, anniversaires et décès */
  language: CalendarLanguage
  year: number
  /** 1-12 */
  startMonth: number
  /** number of month pages to generate */
  monthCount: number
  /** number of blank weekly pages to generate (format "weekly" only) */
  weekCount: number
  /** data URL of the uploaded background image, if any (falls back to a default) */
  illustration: string | null
  /** false = pas d'image de fond du tout (ni importée, ni celle par défaut du mois) */
  showBackground: boolean
  /** show the birthdays recorded in the database (table life_events, tab Anniversaires) on the calendar */
  includeBirthdays: boolean
  /** show the deaths recorded in the database (table life_events, tab Anniversaires) on the calendar */
  includeDeaths: boolean
  /** show the festive days from src/events/otherEvents.ts on the calendar */
  includeOtherEvents: boolean
  /** show the weekly schedules from src/events/schedules.ts under each weekday name */
  includeSchedules: boolean
  events: CalendarEvent[]
}

export type SettingsUpdater = <K extends keyof CalendarSettings>(
  key: K,
  value: CalendarSettings[K],
) => void
