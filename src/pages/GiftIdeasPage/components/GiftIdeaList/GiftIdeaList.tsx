import { useState } from "react"
import plusIcon from "../../../../assets/icons/plus.svg"
import type {
  GiftIdea,
  GiftIdeaDraft,
  GiftRecipient,
} from "../../../../giftIdeas/types"
import type { GiftIdeasLibrary } from "../../../../giftIdeas/useGiftIdeas"
import { isIdeaComplete } from "../../../../giftIdeas/validation"
import { EntryForm } from "../../../../shared/EntryForm/EntryForm"
import { InlineEntryForm } from "../../../../shared/InlineEntryForm/InlineEntryForm"
import type { useToast } from "../../../../shared/Toast/useToast"
import { GiftIdeaFields } from "../GiftIdeaFields/GiftIdeaFields"
import { GiftIdeaItem } from "../GiftIdeaItem/GiftIdeaItem"
import "./GiftIdeaList.css"

function emptyDraft(recipientId: string): GiftIdeaDraft {
  return { id: null, recipientId, title: "" }
}

function toDraft(idea: GiftIdea): GiftIdeaDraft {
  return { id: idea.id, recipientId: idea.recipientId, title: idea.title }
}

interface GiftIdeaListProps {
  recipient: GiftRecipient
  /** Ses idées, la plus récente en premier. */
  ideas: GiftIdea[]
  library: GiftIdeasLibrary
  showToast: ReturnType<typeof useToast>["showToast"]
}

// L'ajout d'une idée pour la personne (champ + bouton +, en une ligne), puis ses idées, chacune modifiable à
// sa place.
export function GiftIdeaList({
  recipient,
  ideas,
  library,
  showToast,
}: GiftIdeaListProps) {
  // Formulaire d'ajout, toujours affiché en haut de la liste.
  const [newDraft, setNewDraft] = useState(() => emptyDraft(recipient.id))
  // Idée ouverte dans l'éditeur (une seule à la fois par personne).
  const [editing, setEditing] = useState<GiftIdeaDraft | null>(null)
  const ideasFor = `idées pour ${recipient.name}`

  function hasUnsavedChanges(): boolean {
    if (editing === null) return false
    const saved = ideas.find(idea => idea.id === editing.id)
    return saved !== undefined && editing.title !== saved.title
  }

  // Protège les modifications en cours avant de fermer l'éditeur ou d'en ouvrir un autre.
  function canLeaveEditing(): boolean {
    return (
      !hasUnsavedChanges() ||
      window.confirm("Abandonner les modifications en cours ?")
    )
  }

  function edit(idea: GiftIdea) {
    if (idea.id === editing?.id || !canLeaveEditing()) return
    setEditing(toDraft(idea))
  }

  function cancelEditing() {
    if (canLeaveEditing()) setEditing(null)
  }

  async function add() {
    const saved = await library.saveIdea(newDraft)
    setNewDraft(emptyDraft(recipient.id))
    showToast("success", `« ${saved.title} » ajouté aux ${ideasFor}.`)
  }

  async function saveEditing() {
    if (editing === null) return
    const saved = await library.saveIdea(editing)
    setEditing(null)
    showToast("success", `« ${saved.title} » enregistré.`)
  }

  async function undoRemove(idea: GiftIdea) {
    try {
      await library.restoreIdea(idea)
    } catch (caught) {
      showToast(
        "error",
        `« ${idea.title} » non restauré : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `« ${idea.title} » restauré.`)
  }

  // Depuis la corbeille d'une idée, ou depuis son éditeur.
  async function remove(deleted: GiftIdea) {
    await library.removeIdea(deleted.id)
    if (editing?.id === deleted.id) setEditing(null)
    showToast("success", `« ${deleted.title} » retiré des ${ideasFor}.`, {
      label: "Annuler",
      onClick: () => undoRemove(deleted),
    })
  }

  return (
    <div className="gift-idea-list">
      <InlineEntryForm
        saveLabel="Ajouter l'idée"
        saveIcon={plusIcon}
        size="small"
        canSave={isIdeaComplete(newDraft)}
        onSave={add}
        showToast={showToast}
        fullWidthField
      >
        <GiftIdeaFields draft={newDraft} onChange={setNewDraft} size="small" />
      </InlineEntryForm>

      {ideas.length > 0 && (
        <ul className="gift-idea-list-items">
          {ideas.map(idea => (
            <li key={idea.id}>
              {editing?.id === idea.id ? (
                <EntryForm
                  submitLabel="Enregistrer"
                  canSubmit={isIdeaComplete(editing)}
                  onSubmit={saveEditing}
                  onClose={cancelEditing}
                  deletion={{
                    label: "Supprimer l'idée",
                    confirmation: `Supprimer « ${idea.title} » des ${ideasFor} ?`,
                    onDelete: () => remove(idea),
                  }}
                >
                  <GiftIdeaFields draft={editing} onChange={setEditing} />
                </EntryForm>
              ) : (
                <GiftIdeaItem
                  idea={idea}
                  onEdit={() => edit(idea)}
                  onRemove={() => remove(idea)}
                  showToast={showToast}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
