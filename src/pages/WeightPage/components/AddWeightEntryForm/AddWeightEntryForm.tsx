import { useState } from "react"
import type { useToast } from "../../../../shared/Toast/useToast"
import { emptyDraft } from "../../../../weight/drafts"
import { formatKg } from "../../../../weight/format"
import type { WeightEntry } from "../../../../weight/types"
import type { WeightTracking } from "../../../../weight/useWeightTracking"
import { isEntryComplete } from "../../../../weight/validation"
import { DuplicateDayError } from "../../../../weight/weightEntriesRepository"
import { entryLabel } from "../../../../weight/wording"
import { InlineEntryForm } from "../../../../shared/InlineEntryForm/InlineEntryForm"
import { MeasurementFields } from "../MeasurementFields/MeasurementFields"
import { WeightEntryFields } from "../WeightEntryFields/WeightEntryFields"

interface AddWeightEntryFormProps {
  tracking: WeightTracking
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * L'ajout d'une pesée en une ligne : le poids, le jour (aujourd'hui sauf si
 * on en choisit un autre), les mesures facultatives, puis la coche.
 */
export function AddWeightEntryForm({
  tracking,
  showToast,
}: AddWeightEntryFormProps) {
  const [draft, setDraft] = useState(emptyDraft)

  async function undoAdd(entry: WeightEntry) {
    try {
      await tracking.removeEntry(entry.id)
    } catch (caught) {
      showToast(
        "error",
        `${entryLabel(entry)} non retirée : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `${entryLabel(entry)} retirée.`)
  }

  async function add() {
    let saved: WeightEntry
    try {
      saved = await tracking.saveEntry(draft)
    } catch (caught) {
      // Depuis l'ajout, on dit où corriger la pesée qui existe déjà.
      if (caught instanceof DuplicateDayError) {
        throw new Error(`${caught.message} Modifie-la dans l'historique.`)
      }
      throw caught
    }
    setDraft(emptyDraft())
    showToast(
      "success",
      `${entryLabel(saved)} ajoutée : ${formatKg(saved.weightKg)}.`,
      { label: "Annuler", onClick: () => undoAdd(saved) },
    )
  }

  return (
    <InlineEntryForm
      saveLabel="Ajouter la pesée"
      canSave={isEntryComplete(draft)}
      onSave={add}
      showToast={showToast}
      compact
    >
      <WeightEntryFields draft={draft} onChange={setDraft} />
      <MeasurementFields
        measurements={draft.measurements}
        onChange={measurements => setDraft({ ...draft, measurements })}
      />
    </InlineEntryForm>
  )
}
