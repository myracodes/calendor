import type { GiftRecipientDraft } from "../../../../giftIdeas/types"
import type { ControlSize } from "../../../../shared/controlSize"

interface RecipientFieldsProps {
  draft: GiftRecipientDraft
  onChange: (draft: GiftRecipientDraft) => void
  /** « small » dans la ligne d'ajout, à la hauteur de son bouton +. */
  size?: ControlSize
}

/**
 * Champ d'une personne, commun à l'ajout et à la modification : son nom.
 * Sans label visible (seul champ) : l'exemple et l'aria-label le nomment.
 */
export function RecipientFields({
  draft,
  onChange,
  size,
}: RecipientFieldsProps) {
  return (
    <input
      type="text"
      className={size === "small" ? "input--small" : undefined}
      aria-label="Nom"
      placeholder="Nouvelle personne"
      value={draft.name}
      onChange={e => onChange({ ...draft, name: e.target.value })}
    />
  )
}
