import { todayIso } from "../../../../dates"
import type { WeightEntryDraft } from "../../../../weight/types"
import { DecimalInput } from "../DecimalInput/DecimalInput"

interface WeightEntryFieldsProps {
  draft: WeightEntryDraft
  onChange: (draft: WeightEntryDraft) => void
}

/** Champs principaux d'une nouvelle pesée : le poids, et le jour (pas dans le futur). Sans conteneur : à poser dans une ligne (.row). */
export function WeightEntryFields({ draft, onChange }: WeightEntryFieldsProps) {
  return (
    <>
      <label>
        Poids
        <DecimalInput
          value={draft.weight}
          onChange={weight => onChange({ ...draft, weight })}
        />
      </label>
      <label>
        Date
        <input
          type="date"
          max={todayIso()}
          value={draft.measuredOn}
          onChange={e => onChange({ ...draft, measuredOn: e.target.value })}
        />
      </label>
    </>
  )
}
