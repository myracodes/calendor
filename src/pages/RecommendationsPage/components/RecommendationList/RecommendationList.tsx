import { useState } from "react"
import { CATEGORY_WORDING } from "../../../../recommendations/categories"
import { knownRecommenders } from "../../../../recommendations/format"
import type {
  Recommendation,
  RecommendationCategory,
  RecommendationDraft,
} from "../../../../recommendations/types"
import type { RecommendationLibrary } from "../../../../recommendations/useRecommendations"
import { Card, type CardVariantColor } from "../../../../shared/Card/Card"
import { EntryForm } from "../../../../shared/EntryForm/EntryForm"
import type { useToast } from "../../../../shared/Toast/useToast"
import { RecommendationFields } from "../RecommendationFields/RecommendationFields"
import { RecommendationItem } from "../RecommendationItem/RecommendationItem"
import "./RecommendationList.css"

function emptyDraft(category: RecommendationCategory): RecommendationDraft {
  return { id: null, category, title: "", recommendedBy: "" }
}

function toDraft(recommendation: Recommendation): RecommendationDraft {
  return {
    id: recommendation.id,
    category: recommendation.category,
    title: recommendation.title,
    recommendedBy: recommendation.recommendedBy,
  }
}

function isComplete(draft: RecommendationDraft): boolean {
  return draft.title.trim() !== ""
}

interface RecommendationListProps {
  /** Catégorie de l'onglet : seules ses recos sont listées, et celles ajoutées la prennent. */
  category: RecommendationCategory
  variantColor: CardVariantColor
  /** Recos de toutes les catégories, chargées une fois pour la page. */
  library: RecommendationLibrary
  /** Toast de la page, partagé par les onglets : un seul affiché à la fois. */
  showToast: ReturnType<typeof useToast>["showToast"]
}

// La card d'un onglet : l'ajout d'une reco, puis la liste des recos de la
// catégorie, chacune modifiable à sa place.
export function RecommendationList({
  category,
  variantColor,
  library,
  showToast,
}: RecommendationListProps) {
  const { recommendations, save, remove, restore } = library
  const wording = CATEGORY_WORDING[category]
  // Formulaire d'ajout, toujours affiché en haut de la liste.
  const [newDraft, setNewDraft] = useState(() => emptyDraft(category))
  // Reco ouverte dans l'éditeur (une seule à la fois).
  const [editing, setEditing] = useState<RecommendationDraft | null>(null)
  const items = recommendations.filter(item => item.category === category)
  // Toutes catégories confondues : on retrouve les mêmes personnes d'un onglet à l'autre.
  const recommenders = knownRecommenders(
    recommendations.map(item => item.recommendedBy),
  )

  function hasUnsavedChanges(): boolean {
    if (editing === null) return false
    const saved = recommendations.find(item => item.id === editing.id)
    if (saved === undefined) return false
    return JSON.stringify(editing) !== JSON.stringify(toDraft(saved))
  }

  // Protège les modifications en cours avant de fermer l'éditeur ou d'en ouvrir un autre.
  function canLeaveEditing(): boolean {
    return (
      !hasUnsavedChanges() ||
      window.confirm("Abandonner les modifications en cours ?")
    )
  }

  function edit(item: Recommendation) {
    if (item.id === editing?.id || !canLeaveEditing()) return
    setEditing(toDraft(item))
  }

  function cancelEditing() {
    if (canLeaveEditing()) setEditing(null)
  }

  async function add() {
    const saved = await save(newDraft)
    setNewDraft(emptyDraft(category))
    showToast("success", `« ${saved.title} » ajouté aux ${wording.collection}.`)
  }

  async function saveEditing() {
    if (editing === null) return
    const saved = await save(editing)
    setEditing(null)
    showToast("success", `« ${saved.title} » enregistré.`)
  }

  async function undoRemove(item: Recommendation) {
    try {
      await restore(item)
    } catch (caught) {
      showToast(
        "error",
        `« ${item.title} » non restauré : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `« ${item.title} » restauré.`)
  }

  async function removeEditing() {
    if (editing === null || editing.id === null) return
    const deleted = recommendations.find(item => item.id === editing.id)
    await remove(editing.id)
    setEditing(null)
    showToast(
      "success",
      `« ${editing.title} » retiré des ${wording.collection}.`,
      deleted && { label: "Annuler", onClick: () => undoRemove(deleted) },
    )
  }

  return (
    <Card variantColor={variantColor}>
      <h2>{wording.cardTitle}</h2>

      <EntryForm
        submitLabel="Ajouter"
        canSubmit={isComplete(newDraft)}
        onSubmit={add}
      >
        <RecommendationFields
          draft={newDraft}
          recommenders={recommenders}
          onChange={setNewDraft}
        />
      </EntryForm>

      {items.length > 0 && (
        <ul className="recommendation-list">
          {items.map(item => (
            <li key={item.id} className="recommendation-list-entry">
              {editing?.id === item.id ? (
                <EntryForm
                  submitLabel="Enregistrer"
                  canSubmit={isComplete(editing)}
                  onSubmit={saveEditing}
                  onClose={cancelEditing}
                  deletion={{
                    label: "Supprimer la reco",
                    confirmation: `Supprimer « ${editing.title} » des ${wording.collection} ?`,
                    onDelete: removeEditing,
                  }}
                >
                  <RecommendationFields
                    draft={editing}
                    recommenders={recommenders}
                    onChange={setEditing}
                  />
                </EntryForm>
              ) : (
                <RecommendationItem
                  recommendation={item}
                  onEdit={() => edit(item)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
