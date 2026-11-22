import type { GiftIdeaDraft } from "../../../../giftIdeas/types"
import type { ControlSize } from "../../../../shared/controlSize"

interface GiftIdeaFieldsProps {
  draft: GiftIdeaDraft
  onChange: (draft: GiftIdeaDraft) => void
  /** « small » dans la ligne d'ajout, à la hauteur de son bouton +. */
  size?: ControlSize
}

/**
 * Champ d'une idée cadeau, commun à l'ajout et à la modification : son titre.
 * Sans label visible (seul champ, dans la liste d'une personne) : l'exemple
 * et l'aria-label le nomment.
 */
export function GiftIdeaFields({ draft, onChange, size }: GiftIdeaFieldsProps) {
  return (
    <input
      type="text"
      className={size === "small" ? "input--small" : undefined}
      aria-label="Idée"
      placeholder="Nouvelle idée"
      value={draft.title}
      onChange={e => onChange({ ...draft, title: e.target.value })}
    />
  )
}
