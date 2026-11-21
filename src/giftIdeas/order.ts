import type { GiftIdea, GiftRecipient } from "./types"

/** Les personnes par ordre alphabétique : l'ordre des cards de la page. */
export function sortByName(recipients: GiftRecipient[]): GiftRecipient[] {
  return [...recipients].sort((first, second) =>
    first.name.localeCompare(second.name, "fr"),
  )
}

/** Les idées, la plus récente en premier : celle qu'on vient d'ajouter arrive sous le formulaire. */
export function sortNewestFirst(ideas: GiftIdea[]): GiftIdea[] {
  return [...ideas].sort((first, second) =>
    second.createdAt.localeCompare(first.createdAt),
  )
}
