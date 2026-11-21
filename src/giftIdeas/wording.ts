import { prefixWithDe } from "../french"

/** « Liste de Maman », « Liste d'Alice » : la card d'une personne, dans les messages. */
export function listOf(name: string): string {
  return `Liste ${prefixWithDe(name)}`
}

/** Confirmation avant de supprimer une personne : ses idées partent avec elle. */
export function recipientDeletionConfirmation(
  name: string,
  ideaCount: number,
): string {
  const list = `la liste ${prefixWithDe(name)}`
  if (ideaCount === 0) return `Supprimer ${list} ?`
  const ideas =
    ideaCount === 1 ? "son idée cadeau" : `ses ${ideaCount} idées cadeaux`
  return `Supprimer ${list} et ${ideas} ?`
}
