import { useState } from "react"
import type { GiftRecipientDraft } from "../../../../giftIdeas/types"
import type { GiftIdeasLibrary } from "../../../../giftIdeas/useGiftIdeas"
import { isRecipientComplete } from "../../../../giftIdeas/validation"
import { listOf } from "../../../../giftIdeas/wording"
import { EntryForm } from "../../../../shared/EntryForm/EntryForm"
import type { useToast } from "../../../../shared/Toast/useToast"
import { RecipientFields } from "../RecipientFields/RecipientFields"

const EMPTY_DRAFT: GiftRecipientDraft = { id: null, name: "" }

interface AddRecipientFormProps {
  library: GiftIdeasLibrary
  showToast: ReturnType<typeof useToast>["showToast"]
  /** Appelé avec la personne enregistrée, pour ouvrir son accordéon. */
  onAdded: (recipientId: string) => void
}

/** Formulaire d'ajout d'une personne, en haut de la liste. */
export function AddRecipientForm({
  library,
  showToast,
  onAdded,
}: AddRecipientFormProps) {
  const [draft, setDraft] = useState(EMPTY_DRAFT)

  async function add() {
    const saved = await library.saveRecipient(draft)
    setDraft(EMPTY_DRAFT)
    onAdded(saved.id)
    showToast("success", `${listOf(saved.name)} créée.`)
  }

  return (
    <EntryForm
      submitLabel="Ajouter la personne"
      canSubmit={isRecipientComplete(draft)}
      onSubmit={add}
    >
      <RecipientFields draft={draft} onChange={setDraft} />
    </EntryForm>
  )
}
