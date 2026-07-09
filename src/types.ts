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
}

export interface CalendarSettings {
  title: string
  year: number
  /** 1-12 */
  startMonth: number
  /** number of month pages to generate */
  monthCount: number
  /** data URL of the uploaded illustration, if any */
  illustration: string | null
  events: CalendarEvent[]
}
