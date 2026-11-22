import { monthName, monthShortName } from "../dates"
import { splitDay } from "./days"

const DECIMAL_FORMAT = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
})

/** « 65,2 », « 80 » : un poids ou un tour sans son unité, dans une colonne qui la donne. */
export function formatDecimal(value: number): string {
  return DECIMAL_FORMAT.format(value)
}

/** « 65,2 kg », « 80 cm » : la valeur suivie de son unité, après une espace insécable. */
export function formatWithUnit(value: number, unit: string): string {
  return `${formatDecimal(value)} ${unit}`
}

const SIGNED_DECIMAL_FORMAT = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
})

/** « -2,9 kg », « +1 cm », « 0 cm » : un écart signé suivi de son unité. */
export function formatDifference(difference: number, unit: string): string {
  return `${SIGNED_DECIMAL_FORMAT.format(difference)} ${unit}`
}

/** « 65,2 kg » */
export function formatKg(weightKg: number): string {
  return formatWithUnit(weightKg, "kg")
}

/** Le jour sans l'année : « 1er novembre », ou « 1er nov. » en version courte. */
export function formatDayAndMonth(
  iso: string,
  monthFormat: "long" | "short" = "long",
): string {
  const { month, day } = splitDay(iso)
  const name = monthFormat === "long" ? monthName(month) : monthShortName(month)
  return `${day === 1 ? "1er" : day} ${name}`
}

/** « 22 novembre 2026 » */
export function formatFullDay(iso: string): string {
  return `${formatDayAndMonth(iso)} ${splitDay(iso).year}`
}

/** « 22 nov. 2026 » : la colonne des dates de l'historique. */
export function formatShortDay(iso: string): string {
  return `${formatDayAndMonth(iso, "short")} ${splitDay(iso).year}`
}
