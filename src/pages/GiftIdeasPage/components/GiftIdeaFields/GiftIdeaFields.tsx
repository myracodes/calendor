import type { GiftIdeaDraft } from "../../../../giftIdeas/types"

interface GiftIdeaFieldsProps {
  draft: GiftIdeaDraft
  onChange: (draft: GiftIdeaDraft) => void
}

/** Champ d'une idée cadeau, commun à l'ajout et à la modification : son titre. */
export function GiftIdeaFields({ draft, onChange }: GiftIdeaFieldsProps) {
  return (
    <label>
      Idée
      <input
        type="text"
        value={draft.title}
        onChange={e => onChange({ ...draft, title: e.target.value })}
      />
    </label>
  )
}
