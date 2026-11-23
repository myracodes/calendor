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

/**
 * @param month 1-12
 * @param locale locale Intl (français par défaut, celle de l'interface)
 */
export function monthName(month: number, locale = "fr-FR"): string {
  const format = new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
  })
  return format.format(new Date(Date.UTC(2026, month - 1, 1)))
}

/**
 * Nom de mois abrégé ("janv.", "Jan", "1月"…), pour les en-têtes étroits.
 * @param month 1-12
 */
export function monthShortName(month: number, locale = "fr-FR"): string {
  const format = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  })
  return format.format(new Date(Date.UTC(2026, month - 1, 1)))
}

/** Monday-first weekday initials ("L M M J V S D" en français). */
export function weekdayInitials(locale = "fr-FR"): string[] {
  const format = new Intl.DateTimeFormat(locale, {
    weekday: "narrow",
    timeZone: "UTC",
  })
  // 2026-01-05 is a Monday.
  return Array.from({ length: 7 }, (_, i) =>
    format.format(new Date(Date.UTC(2026, 0, 5 + i))),
  )
}

/**
 * Monday-first weekday names.
 * @param locale locale Intl (français par défaut, celle de l'interface)
 */
export function weekdayNames(locale = "fr-FR"): string[] {
  const format = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "UTC",
  })
  // 2026-01-05 is a Monday.
  return Array.from({ length: 7 }, (_, i) =>
    format.format(new Date(Date.UTC(2026, 0, 5 + i))),
  )
}

/** @param month 1-12 */
export function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of this month.
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/** @param month 1-12 */
export function toIso(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10)
}

/**
 * Date du jour au format ISO "aaaa-mm-jj", dans le fuseau local (et non en
 * UTC comme le reste du fichier) : c'est le jour que voit l'utilisatrice, même
 * peu après minuit.
 */
export function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
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

const DAY_MS = 24 * 60 * 60 * 1000
const WEEK_MS = 7 * DAY_MS

/**
 * Numéro du jour (jours écoulés depuis le 1er janvier 1970) : l'abscisse d'une
 * pesée sur la courbe, l'écart en jours entre deux dates du planning.
 */
export function dayNumber(iso: string): number {
  return Math.round(Date.parse(`${iso}T00:00:00Z`) / DAY_MS)
}

/** Le jour ISO d'un numéro de jour (inverse de dayNumber). */
export function dayFromNumber(number: number): string {
  return new Date(number * DAY_MS).toISOString().slice(0, 10)
}

/** Le jour ISO, `days` jours plus tard (plus tôt si `days` est négatif). */
export function addDays(iso: string, days: number): string {
  return dayFromNumber(dayNumber(iso) + days)
}

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

/** 0 = Monday … 6 = Sunday, for an ISO day "yyyy-mm-dd". */
export function weekdayOfIso(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number)
  return weekdayOf(year, month, day)
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
