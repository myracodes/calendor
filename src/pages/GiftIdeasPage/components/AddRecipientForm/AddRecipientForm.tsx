import { useState } from "react"
import type { GiftRecipientDraft } from "../../../../giftIdeas/types"
import type { GiftIdeasLibrary } from "../../../../giftIdeas/useGiftIdeas"
import { isRecipientComplete } from "../../../../giftIdeas/validation"
import { listOf } from "../../../../giftIdeas/wording"
import { InlineEntryForm } from "../../../../shared/InlineEntryForm/InlineEntryForm"
import type { useToast } from "../../../../shared/Toast/useToast"
import { RecipientFields } from "../RecipientFields/RecipientFields"

const EMPTY_DRAFT: GiftRecipientDraft = { id: null, name: "" }

interface AddRecipientFormProps {
  library: GiftIdeasLibrary
  showToast: ReturnType<typeof useToast>["showToast"]
  /** Appelé avec la personne enregistrée, pour ouvrir son accordéon. */
  onAdded: (recipientId: string) => void
}

/** Ajout d'une personne en une ligne, en haut de la liste : son nom, puis la coche. */
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
    <InlineEntryForm
      saveLabel="Ajouter la personne"
      canSave={isRecipientComplete(draft)}
      onSave={add}
      showToast={showToast}
      fullWidthField
    >
      <RecipientFields draft={draft} onChange={setDraft} />
    </InlineEntryForm>
  )
}
