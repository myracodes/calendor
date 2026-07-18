// All computations use UTC timestamps so the generated grids are
// independent of the machine's timezone.

export interface DayCell {
  /** day of month, or null for padding cells outside the month */
  day: number | null
  /** ISO date "yyyy-mm-dd" for real days */
  iso: string | null
  /** 0 = Monday … 6 = Sunday */
  weekday: number
}

const MONTH_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  timeZone: "UTC",
})

const WEEKDAY_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  timeZone: "UTC",
})

/** @param month 1-12 */
export function monthName(month: number): string {
  return MONTH_FORMAT.format(new Date(Date.UTC(2026, month - 1, 1)))
}

/** Monday-first weekday names. */
export function weekdayNames(): string[] {
  // 2026-01-05 is a Monday.
  return Array.from({ length: 7 }, (_, i) =>
    WEEKDAY_FORMAT.format(new Date(Date.UTC(2026, 0, 5 + i))),
  )
}

/** @param month 1-12 */
export function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of this month.
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function toIso(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10)
}

/**
 * Builds the grid of a month as a list of weeks (Monday-first).
 * @param month 1-12
 */
export function monthGrid(year: number, month: number): DayCell[][] {
  const total = daysInMonth(year, month)
  // getUTCDay(): 0 = Sunday … 6 = Saturday; convert to 0 = Monday … 6 = Sunday.
  const firstWeekday =
    (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7

  const cells: DayCell[] = []
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ day: null, iso: null, weekday: i })
  }
  for (let day = 1; day <= total; day++) {
    cells.push({
      day,
      iso: toIso(year, month, day),
      weekday: (firstWeekday + day - 1) % 7,
    })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, iso: null, weekday: cells.length % 7 })
  }

  const weeks: DayCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Index of the Monday-based week containing the given date, counted from
 * 2001-01-01 (a Monday). Two dates share an index iff they are in the same
 * calendar week.
 */
export function weekIndex(iso: string): number {
  const ts = Date.parse(`${iso}T00:00:00Z`)
  return Math.floor((ts - Date.UTC(2001, 0, 1)) / WEEK_MS)
}

/** 0 = Monday … 6 = Sunday */
export function weekdayOf(year: number, month: number, day: number): number {
  return (new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7
}

/** Normalizes (year, month offset) into a real { year, month } pair. */
export function addMonths(
  year: number,
  month: number,
  offset: number,
): { year: number; month: number } {
  const index = year * 12 + (month - 1) + offset
  return { year: Math.floor(index / 12), month: (index % 12) + 1 }
}
