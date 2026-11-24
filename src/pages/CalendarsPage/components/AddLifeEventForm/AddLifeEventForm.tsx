import { useState } from "react"
import plusIcon from "../../../../assets/icons/plus.svg"
import { monthOf } from "../../../../dates"
import { emptyDraft } from "../../../../lifeEvents/drafts"
import type { LifeEventEntry } from "../../../../lifeEvents/types"
import type { LifeEventsLibrary } from "../../../../lifeEvents/useLifeEvents"
import { isDraftComplete } from "../../../../lifeEvents/validation"
import { lifeEventTitle } from "../../../../lifeEvents/wording"
import { InlineEntryForm } from "../../../../shared/InlineEntryForm/InlineEntryForm"
import type { useToast } from "../../../../shared/Toast/useToast"
import { LifeEventFields } from "../LifeEventFields/LifeEventFields"

interface AddLifeEventFormProps {
  library: LifeEventsLibrary
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * L'ajout d'un anniversaire ou d'un décès en une ligne, puis le +. Après un
 * ajout, le type et le mois restent choisis, pour enchaîner les saisies.
 */
export function AddLifeEventForm({
  library,
  showToast,
}: AddLifeEventFormProps) {
  const [draft, setDraft] = useState(() =>
    emptyDraft("birthday", monthOf(new Date())),
  )

  async function undoAdd(entry: LifeEventEntry) {
    try {
      await library.remove(entry.id)
    } catch (caught) {
      showToast(
        "error",
        `${lifeEventTitle(entry)} non retiré : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `${lifeEventTitle(entry)} retiré.`)
  }

  async function add() {
    const saved = await library.save(draft)
    setDraft(emptyDraft(saved.kind, saved.month))
    showToast("success", `${lifeEventTitle(saved)} ajouté.`, {
      label: "Annuler",
      onClick: () => undoAdd(saved),
    })
  }

  return (
    <InlineEntryForm
      saveLabel="Ajouter"
      saveIcon={plusIcon}
      canSave={isDraftComplete(draft)}
      onSave={add}
      showToast={showToast}
      compact
    >
      <LifeEventFields draft={draft} onChange={setDraft} />
    </InlineEntryForm>
  )
}
