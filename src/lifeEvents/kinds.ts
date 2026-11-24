import type { LifeEventKind } from "./types"

export const LIFE_EVENT_KINDS: LifeEventKind[] = ["birthday", "death"]

/** Nom du type, dans le formulaire et les messages (« Anniversaire de Maman »). */
export const LIFE_EVENT_KIND_LABELS: Record<LifeEventKind, string> = {
  birthday: "Anniversaire",
  death: "Décès",
}

/** Emoji posé devant le nom, sur les calendriers comme dans l'app. */
export const LIFE_EVENT_EMOJIS: Record<LifeEventKind, string> = {
  birthday: "🎂",
  death: "🕯️",
}
