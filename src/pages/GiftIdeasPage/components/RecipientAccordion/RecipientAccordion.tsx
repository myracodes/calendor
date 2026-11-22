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
import { Accordion } from "../../../../shared/Accordion/Accordion"
import { EntryForm } from "../../../../shared/EntryForm/EntryForm"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import type { useToast } from "../../../../shared/Toast/useToast"
import { GiftIdeaList } from "../GiftIdeaList/GiftIdeaList"
import { RecipientFields } from "../RecipientFields/RecipientFields"

interface RecipientAccordionProps {
  recipient: GiftRecipient
  /** Ses idées, la plus récente en premier ; comptées avant de la supprimer, et remises avec elle si on annule. */
  ideas: GiftIdea[]
  /** Ouvert au premier affichage : la personne qu'on vient d'ajouter, pour y noter tout de suite ses idées. */
  defaultOpen: boolean
  library: GiftIdeasLibrary
  showToast: ReturnType<typeof useToast>["showToast"]
}

// Une personne : son nom, qui ouvre la liste de ses idées, et un crayon pour
// la renommer ou la supprimer (le formulaire prend alors la place de
// l'accordéon).
export function RecipientAccordion({
  recipient,
  ideas,
  defaultOpen,
  library,
  showToast,
}: RecipientAccordionProps) {
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

  // Pas d'éditeur à fermer : il disparaît avec la personne.
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
          label: "Supprimer la personne",
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
    <Accordion
      title={recipient.name}
      titleWeight="regular"
      defaultOpen={defaultOpen}
      action={
        <IconButton
          icon={pencilIcon}
          label={`Modifier « ${recipient.name} »`}
          variant="secondary"
          size="small"
          onClick={() => setEditing({ id: recipient.id, name: recipient.name })}
        />
      }
    >
      <GiftIdeaList
        recipient={recipient}
        ideas={ideas}
        library={library}
        showToast={showToast}
      />
    </Accordion>
  )
}
