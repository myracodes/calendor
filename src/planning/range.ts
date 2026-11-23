// Jours affichés par le planning : une fenêtre autour d'aujourd'hui, que les
// boutons « Plus tôt » et « Plus tard » élargissent.

import { addDays, dayNumber } from "../dates"

/** Jours affichés avant aujourd'hui à l'ouverture : la semaine écoulée. */
export const INITIAL_DAYS_BEFORE = 7
/** Jours affichés après aujourd'hui à l'ouverture (aujourd'hui compris) : 4 semaines. */
export const INITIAL_DAYS_AFTER = 27
/** Jours ajoutés par un clic sur « Plus tôt » ou « Plus tard » : 2 semaines. */
export const EXTENSION_DAYS = 14

/** Premier et dernier jour affichés, inclus, au format ISO « aaaa-mm-jj ». */
export interface DayRange {
  from: string
  to: string
}

export function initialRange(today: string): DayRange {
  return {
    from: addDays(today, -INITIAL_DAYS_BEFORE),
    to: addDays(today, INITIAL_DAYS_AFTER),
  }
}

/** Tous les jours de la fenêtre, dans l'ordre. */
export function daysOf(range: DayRange): string[] {
  const count = dayNumber(range.to) - dayNumber(range.from) + 1
  return Array.from({ length: count }, (_, i) => addDays(range.from, i))
}
