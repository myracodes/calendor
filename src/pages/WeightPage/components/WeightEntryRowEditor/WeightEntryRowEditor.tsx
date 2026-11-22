import { type FormEvent, useId } from "react"
import checkIcon from "../../../../assets/icons/check.svg"
import { todayIso } from "../../../../dates"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import type { useToast } from "../../../../shared/Toast/useToast"
import { isSameDraft, toDraft } from "../../../../weight/drafts"
import { formatFullDay } from "../../../../weight/format"
import { MEASUREMENTS } from "../../../../weight/measurements"
import type { WeightEntry, WeightEntryDraft } from "../../../../weight/types"
import { isEntryComplete } from "../../../../weight/validation"
import { useInlineAction } from "../../../../shared/useInlineAction"
import { DecimalInput } from "../DecimalInput/DecimalInput"

interface WeightEntryRowEditorProps {
  /** La pesée telle qu'enregistrée : la coche reste grisée tant que rien n'a changé. */
  entry: WeightEntry
  draft: WeightEntryDraft
  onChange: (draft: WeightEntryDraft) => void
  /** Rejetée en cas d'échec : le message s'affiche dans un toast, la ligne n'ayant pas la place d'un message. */
  onSave: () => Promise<void>
  /** Ferme sans enregistrer. */
  onClose: () => void
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * Une pesée de l'historique ouverte en modification, à sa place : un champ
 * par colonne, puis la coche (enregistrer, aussi par Entrée) et la croix
 * (fermer sans enregistrer). Un <form> ne pouvant pas englober une ligne de
 * tableau, il est posé dans la dernière cellule, et les champs des autres
 * cellules s'y rattachent par leur attribut form.
 */
export function WeightEntryRowEditor({
  entry,
  draft,
  onChange,
  onSave,
  onClose,
  showToast,
}: WeightEntryRowEditorProps) {
  const formId = useId()
  const { busy, run } = useInlineAction(showToast)
  // Le jour reste obligatoire : vide, la pesée passerait à aujourd'hui sans
  // prévenir (la date par défaut ne vaut que pour un ajout).
  const canSave =
    draft.measuredOn !== "" &&
    isEntryComplete(draft) &&
    !isSameDraft(draft, toDraft(entry))
  const day = formatFullDay(entry.measuredOn)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (canSave) await run(onSave)
  }

  return (
    <tr className="table-row-editing">
      <td>
        <input
          type="date"
          form={formId}
          aria-label="Date"
          required
          max={todayIso()}
          value={draft.measuredOn}
          onChange={e => onChange({ ...draft, measuredOn: e.target.value })}
        />
      </td>
      <td className="table-cell-number">
        <DecimalInput
          form={formId}
          label="Poids (kg)"
          value={draft.weight}
          onChange={weight => onChange({ ...draft, weight })}
        />
      </td>
      {MEASUREMENTS.map(measurement => (
        <td key={measurement.id} className="table-cell-number">
          <DecimalInput
            form={formId}
            label={`${measurement.label} (cm)`}
            value={draft.measurements[measurement.id]}
            onChange={value =>
              onChange({
                ...draft,
                measurements: {
                  ...draft.measurements,
                  [measurement.id]: value,
                },
              })
            }
          />
        </td>
      ))}
      <td>
        <form id={formId} className="table-actions" onSubmit={submit}>
          <IconButton
            type="submit"
            icon={checkIcon}
            label={`Enregistrer la pesée du ${day}`}
            busy={busy}
            disabled={!canSave}
          />
          <button
            type="button"
            className="btn-close"
            disabled={busy}
            onClick={onClose}
            aria-label="Fermer sans enregistrer"
            title="Fermer sans enregistrer"
          >
            ×
          </button>
        </form>
      </td>
    </tr>
  )
}
