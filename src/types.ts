export type EventRule =
  | { kind: 'daily' }
  | { kind: 'monthly'; day: number }
  | { kind: 'once'; date: string } // ISO "yyyy-mm-dd"

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
