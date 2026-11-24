import { monthName } from "../dates"
import { prefixWithDe } from "../french"
import { LIFE_EVENT_KIND_LABELS } from "./kinds"
import type { LifeEventKind } from "./types"

/** « Anniversaire de Maman », « Décès de Bastien » : dans les toasts et les libellés des boutons. */
export function lifeEventTitle(event: {
  kind: LifeEventKind
  name: string
}): string {
  return `${LIFE_EVENT_KIND_LABELS[event.kind]} ${prefixWithDe(event.name)}`
}

/** « Mars (6) » : le titre de la section d'un mois. */
export function monthSectionTitle(month: number, count: number): string {
  const name = monthName(month)
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} (${count})`
}
