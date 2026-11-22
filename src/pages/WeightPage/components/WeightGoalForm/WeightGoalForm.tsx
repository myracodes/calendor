import { useState } from "react"
import type { useToast } from "../../../../shared/Toast/useToast"
import { formatKg } from "../../../../weight/format"
import type { WeightTracking } from "../../../../weight/useWeightTracking"
import { parseDecimal } from "../../../../weight/validation"
import { DecimalInput } from "../DecimalInput/DecimalInput"
import { InlineEntryForm } from "../../../../shared/InlineEntryForm/InlineEntryForm"

/** Le texte du champ pour un objectif : vide quand il n'y en a pas. */
function toFieldValue(goalKg: number | null): string {
  return goalKg === null ? "" : String(goalKg)
}

interface WeightGoalFormProps {
  tracking: WeightTracking
  showToast: ReturnType<typeof useToast>["showToast"]
}

/** L'objectif en une ligne, sous la courbe : le poids visé, à enregistrer ou à retirer. */
export function WeightGoalForm({ tracking, showToast }: WeightGoalFormProps) {
  const { goalKg, saveGoal } = tracking
  const [draft, setDraft] = useState(() => toFieldValue(goalKg))
  const draftKg = parseDecimal(draft)

  async function save() {
    if (draftKg === null) return
    await saveGoal(draftKg)
    showToast("success", `Objectif enregistré : ${formatKg(draftKg)}.`)
  }

  async function undoRemove(previousKg: number) {
    try {
      await saveGoal(previousKg)
    } catch (caught) {
      showToast("error", `Objectif non restauré : ${(caught as Error).message}`)
      return
    }
    setDraft(toFieldValue(previousKg))
    showToast("info", `Objectif de ${formatKg(previousKg)} restauré.`)
  }

  async function remove() {
    if (goalKg === null) return
    const previousKg = goalKg
    await saveGoal(null)
    setDraft("")
    showToast("success", "Objectif retiré.", {
      label: "Annuler",
      onClick: () => undoRemove(previousKg),
    })
  }

  return (
    <InlineEntryForm
      saveLabel="Enregistrer l'objectif"
      canSave={draftKg !== null && draftKg !== goalKg}
      onSave={save}
      deletion={{
        label: "Retirer l'objectif",
        enabled: goalKg !== null,
        onDelete: remove,
      }}
      showToast={showToast}
    >
      <label>
        Objectif (kg)
        <DecimalInput value={draft} onChange={setDraft} />
      </label>
    </InlineEntryForm>
  )
}
