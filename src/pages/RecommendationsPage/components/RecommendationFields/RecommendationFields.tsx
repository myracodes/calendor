import { useId } from "react"
import type { RecommendationDraft } from "../../../../recommendations/types"

interface RecommendationFieldsProps {
  draft: RecommendationDraft
  /** Personnes déjà citées dans les recos, proposées dans « De la part de ». */
  recommenders: string[]
  onChange: (draft: RecommendationDraft) => void
}

/** Champs d'une reco, communs à l'ajout et à la modification : titre et qui l'a recommandée. */
export function RecommendationFields({
  draft,
  recommenders,
  onChange,
}: RecommendationFieldsProps) {
  // Un formulaire par onglet, plus l'éditeur ouvert : l'id de la liste doit être unique.
  const recommendersListId = useId()

  return (
    <>
      <label>
        Titre
        <input
          type="text"
          value={draft.title}
          onChange={e => onChange({ ...draft, title: e.target.value })}
        />
      </label>

      <label>
        De la part de (optionnel)
        <input
          type="text"
          list={recommendersListId}
          value={draft.recommendedBy}
          onChange={e => onChange({ ...draft, recommendedBy: e.target.value })}
        />
        <datalist id={recommendersListId}>
          {recommenders.map(name => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>
    </>
  )
}
