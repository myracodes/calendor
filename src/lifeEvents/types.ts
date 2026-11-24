import type { Month } from "../constants/months"
import type { LifeEvent } from "../events/lifeEvents.type"

/** « birthday » : anniversaire de naissance ; « death » : anniversaire d'un décès. */
export type LifeEventKind = "birthday" | "death"

/** Un anniversaire ou un décès enregistré en base (table life_events). */
export interface LifeEventEntry extends LifeEvent {
  id: string
  kind: LifeEventKind
  /** Date d'ajout (ISO 8601), tenue par la base. */
  createdAt: string
}

/** Anniversaire ou décès en cours de saisie, champs tels que tapés ; id null = pas encore enregistré. */
export interface LifeEventDraft {
  id: string | null
  kind: LifeEventKind
  name: string
  day: string
  month: Month
  /** Facultative : année de naissance (anniversaire) ou du décès (décès). */
  year: string
  /** Facultative, anniversaire seulement : l'année du décès d'une personne disparue. */
  deathYear: string
}
