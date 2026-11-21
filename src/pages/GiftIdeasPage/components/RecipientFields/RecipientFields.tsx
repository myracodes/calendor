import type { GiftRecipientDraft } from "../../../../giftIdeas/types"

interface RecipientFieldsProps {
  draft: GiftRecipientDraft
  onChange: (draft: GiftRecipientDraft) => void
}

/** Champ d'une personne, commun à l'ajout et à la modification : son nom. */
export function RecipientFields({ draft, onChange }: RecipientFieldsProps) {
  return (
    <label>
      Nom
      <input
        type="text"
        value={draft.name}
        onChange={e => onChange({ ...draft, name: e.target.value })}
      />
    </label>
  )
}
