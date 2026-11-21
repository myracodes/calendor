import { useState } from "react"
import pencilIcon from "../../../../assets/icons/pencil.svg"
import type {
  GiftIdea,
  GiftRecipient,
  GiftRecipientDraft,
} from "../../../../giftIdeas/types"
import type { GiftIdeasLibrary } from "../../../../giftIdeas/useGiftIdeas"
import { isRecipientComplete } from "../../../../giftIdeas/validation"
import {
  listOf,
  recipientDeletionConfirmation,
} from "../../../../giftIdeas/wording"
import { EntryForm } from "../../../../shared/EntryForm/EntryForm"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import type { useToast } from "../../../../shared/Toast/useToast"
import { RecipientFields } from "../RecipientFields/RecipientFields"
import "./RecipientHeader.css"

interface RecipientHeaderProps {
  recipient: GiftRecipient
  /** Ses idées : comptées avant de la supprimer, et remises avec elle si on annule. */
  ideas: GiftIdea[]
  library: GiftIdeasLibrary
  showToast: ReturnType<typeof useToast>["showToast"]
}

// Le titre de la card d'une personne (son nom), ou à sa place le formulaire
// pour la renommer ou la supprimer.
export function RecipientHeader({
  recipient,
  ideas,
  library,
  showToast,
}: RecipientHeaderProps) {
  const [editing, setEditing] = useState<GiftRecipientDraft | null>(null)

  // Protège un nom en cours de modification avant de fermer l'éditeur.
  function cancelEditing() {
    const changed = editing !== null && editing.name !== recipient.name
    if (!changed || window.confirm("Abandonner les modifications en cours ?")) {
      setEditing(null)
    }
  }

  async function saveEditing() {
    if (editing === null) return
    const saved = await library.saveRecipient(editing)
    setEditing(null)
    showToast("success", `${listOf(saved.name)} enregistrée.`)
  }

  async function undoRemove() {
    try {
      await library.restoreRecipient(recipient, ideas)
    } catch (caught) {
      showToast(
        "error",
        `${listOf(recipient.name)} non restaurée : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `${listOf(recipient.name)} restaurée.`)
  }

  // Pas d'éditeur à fermer : la card disparaît avec la personne.
  async function remove() {
    await library.removeRecipient(recipient.id)
    showToast("success", `${listOf(recipient.name)} supprimée.`, {
      label: "Annuler",
      onClick: undoRemove,
    })
  }

  if (editing !== null) {
    return (
      <EntryForm
        submitLabel="Enregistrer"
        canSubmit={isRecipientComplete(editing)}
        onSubmit={saveEditing}
        onClose={cancelEditing}
        deletion={{
          label: "Supprimer la liste",
          confirmation: recipientDeletionConfirmation(
            recipient.name,
            ideas.length,
          ),
          onDelete: remove,
        }}
      >
        <RecipientFields draft={editing} onChange={setEditing} />
      </EntryForm>
    )
  }

  return (
    <div className="recipient-header">
      <h2>{recipient.name}</h2>
      <IconButton
        icon={pencilIcon}
        label={`Modifier « ${recipient.name} »`}
        variant="secondary"
        onClick={() => setEditing({ id: recipient.id, name: recipient.name })}
      />
    </div>
  )
}
