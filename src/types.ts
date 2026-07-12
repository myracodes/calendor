export type EventRule =
  | { kind: "daily" }
  | {
      kind: "weekly"
      /** 0 = Monday … 6 = Sunday */
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
  year: number
  /** 1-12 */
  startMonth: number
  /** number of month pages to generate */
  monthCount: number
  /** number of blank weekly pages to generate (format "weekly" only) */
  weekCount: number
  /** data URL of the uploaded background image, if any (falls back to a default) */
  illustration: string | null
  /** show the birthdays from src/events/birthdays.ts on the calendar */
  includeBirthdays: boolean
  /** show the deaths from src/events/deaths.ts on the calendar */
  includeDeaths: boolean
  /** show the festive days from src/events/otherEvents.ts on the calendar */
  includeOtherEvents: boolean
  /** show the weekly schedules from src/events/schedules.ts under each weekday name */
  includeSchedules: boolean
  events: CalendarEvent[]
}

export type SettingsUpdater = <K extends keyof CalendarSettings>(key: K, value: CalendarSettings[K]) => void
