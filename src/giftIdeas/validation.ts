import type { GiftIdeaDraft, GiftRecipientDraft } from "./types"

/** Une personne s'enregistre dès qu'elle a un nom. */
export function isRecipientComplete(draft: GiftRecipientDraft): boolean {
  return draft.name.trim() !== ""
}

/** Une idée s'enregistre dès qu'elle a un titre. */
export function isIdeaComplete(draft: GiftIdeaDraft): boolean {
  return draft.title.trim() !== ""
}
