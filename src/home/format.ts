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
