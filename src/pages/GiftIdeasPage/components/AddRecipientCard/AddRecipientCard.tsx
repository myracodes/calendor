import { useState } from "react"
import type { GiftRecipientDraft } from "../../../../giftIdeas/types"
import type { GiftIdeasLibrary } from "../../../../giftIdeas/useGiftIdeas"
import { isRecipientComplete } from "../../../../giftIdeas/validation"
import { listOf } from "../../../../giftIdeas/wording"
import { Card } from "../../../../shared/Card/Card"
import { EntryForm } from "../../../../shared/EntryForm/EntryForm"
import type { useToast } from "../../../../shared/Toast/useToast"
import { RecipientFields } from "../RecipientFields/RecipientFields"

const EMPTY_DRAFT: GiftRecipientDraft = { id: null, name: "" }

interface AddRecipientCardProps {
  library: GiftIdeasLibrary
  /** Toast de la page, partagé par les cards : un seul affiché à la fois. */
  showToast: ReturnType<typeof useToast>["showToast"]
}

// La card d'ajout d'une personne, en tête de page : sa card apparaît ensuite
// parmi les autres, par ordre alphabétique.
export function AddRecipientCard({
  library,
  showToast,
}: AddRecipientCardProps) {
  const [draft, setDraft] = useState(EMPTY_DRAFT)

  async function add() {
    const saved = await library.saveRecipient(draft)
    setDraft(EMPTY_DRAFT)
    showToast("success", `${listOf(saved.name)} créée.`)
  }

  return (
    <Card>
      <h2>Ajouter une personne</h2>
      <EntryForm
        submitLabel="Ajouter"
        canSubmit={isRecipientComplete(draft)}
        onSubmit={add}
      >
        <RecipientFields draft={draft} onChange={setDraft} />
      </EntryForm>
    </Card>
  )
}
