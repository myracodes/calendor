import { useEffect, useState } from "react"
import {
  deleteGiftIdea,
  fetchGiftIdeas,
  restoreGiftIdeas,
  saveGiftIdea,
} from "./giftIdeasRepository"
import {
  deleteGiftRecipient,
  fetchGiftRecipients,
  restoreGiftRecipient,
  saveGiftRecipient,
} from "./giftRecipientsRepository"
import { sortByName, sortNewestFirst } from "./order"
import type {
  GiftIdea,
  GiftIdeaDraft,
  GiftRecipient,
  GiftRecipientDraft,
} from "./types"

/**
 * Les personnes et leurs idées cadeaux, chargées au montage, et les actions
 * pour les modifier : l'état local n'est mis à jour qu'une fois la base
 * d'accord.
 */
export function useGiftIdeas() {
  const [recipients, setRecipients] = useState<GiftRecipient[]>([])
  const [ideas, setIdeas] = useState<GiftIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage (ex. changement de page).
    let cancelled = false
    Promise.all([fetchGiftRecipients(), fetchGiftIdeas()])
      .then(([recipientList, ideaList]) => {
        if (cancelled) return
        setRecipients(sortByName(recipientList))
        setIdeas(sortNewestFirst(ideaList))
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function putRecipient(saved: GiftRecipient) {
    setRecipients(previous =>
      sortByName([
        ...previous.filter(recipient => recipient.id !== saved.id),
        saved,
      ]),
    )
  }

  function putIdeas(saved: GiftIdea[]) {
    const savedIds = new Set(saved.map(idea => idea.id))
    setIdeas(previous =>
      sortNewestFirst([
        ...previous.filter(idea => !savedIds.has(idea.id)),
        ...saved,
      ]),
    )
  }

  async function saveRecipient(
    draft: GiftRecipientDraft,
  ): Promise<GiftRecipient> {
    const saved = await saveGiftRecipient(draft)
    putRecipient(saved)
    return saved
  }

  /** Supprime la personne et ses idées (la base les supprime en cascade). */
  async function removeRecipient(id: string): Promise<void> {
    await deleteGiftRecipient(id)
    setRecipients(previous => previous.filter(recipient => recipient.id !== id))
    setIdeas(previous => previous.filter(idea => idea.recipientId !== id))
  }

  /** Remet une personne supprimée, puis ses idées telles qu'elles étaient. */
  async function restoreRecipient(
    recipient: GiftRecipient,
    recipientIdeas: GiftIdea[],
  ): Promise<void> {
    putRecipient(await restoreGiftRecipient(recipient))
    putIdeas(await restoreGiftIdeas(recipientIdeas))
  }

  async function saveIdea(draft: GiftIdeaDraft): Promise<GiftIdea> {
    const saved = await saveGiftIdea(draft)
    putIdeas([saved])
    return saved
  }

  async function removeIdea(id: string): Promise<void> {
    await deleteGiftIdea(id)
    setIdeas(previous => previous.filter(idea => idea.id !== id))
  }

  /** Remet une idée supprimée, à sa place dans la liste. */
  async function restoreIdea(idea: GiftIdea): Promise<void> {
    putIdeas(await restoreGiftIdeas([idea]))
  }

  return {
    recipients,
    ideas,
    loading,
    loadError,
    saveRecipient,
    removeRecipient,
    restoreRecipient,
    saveIdea,
    removeIdea,
    restoreIdea,
  }
}

/** Les personnes, les idées et leurs actions, partagées par les cards de la page. */
export type GiftIdeasLibrary = ReturnType<typeof useGiftIdeas>
