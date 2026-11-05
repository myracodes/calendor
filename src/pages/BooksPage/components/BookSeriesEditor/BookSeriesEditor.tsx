import { plural } from "../../../../books/format"
import type { BookSeriesDraft } from "../../../../books/types"
import {
  isSeriesDraftComplete,
  publishedVolumesError,
  yearReadCountError,
} from "../../../../books/validation"
import { AuthorsField } from "../AuthorsField/AuthorsField"
import { BookForm } from "../BookForm/BookForm"

interface BookSeriesEditorProps {
  draft: BookSeriesDraft
  /** Plus grand numéro de tome enregistré : minimum des tomes parus. */
  highestVolume: number
  /** Tomes enregistrés, supprimés avec la série. */
  volumeCount: number
  onChange: (draft: BookSeriesDraft) => void
  /** « Tomes lus en 2025 » : l'année de la ligne où l'éditeur est ouvert, dans le format de la card. */
  yearReadLabel: string
  yearReadCount: number
  onYearReadCountChange: (count: number) => void
  onSave: () => Promise<void>
  onDelete: () => Promise<void>
  /** Ferme l'éditeur sans enregistrer. */
  onCancel: () => void
}

/** Modification d'une série de livres, ouverte dans la liste à sa place. */
export function BookSeriesEditor({
  draft,
  highestVolume,
  volumeCount,
  onChange,
  yearReadLabel,
  yearReadCount,
  onYearReadCountChange,
  onSave,
  onDelete,
  onCancel,
}: BookSeriesEditorProps) {
  const volumesError = publishedVolumesError(draft, highestVolume)
  const countError = yearReadCountError(yearReadCount)

  return (
    <BookForm
      submitLabel="Enregistrer"
      canSubmit={
        isSeriesDraftComplete(draft) &&
        volumesError === null &&
        countError === null
      }
      onSubmit={onSave}
      onClose={onCancel}
      deletion={{
        label: "Supprimer la série",
        confirmation: `Supprimer la série « ${draft.name} » et ses ${plural(volumeCount, "tome enregistré", "tomes enregistrés")} ?`,
        onDelete,
      }}
    >
      <label>
        Nom de la série
        <input
          type="text"
          value={draft.name}
          onChange={e => onChange({ ...draft, name: e.target.value })}
        />
      </label>

      <AuthorsField
        authors={draft.authors}
        onChange={authors => onChange({ ...draft, authors })}
      />

      <div className="row">
        <label>
          Tomes parus
          <input
            type="number"
            min={Math.max(1, highestVolume)}
            step={1}
            // Champ vide = nombre inconnu (null) : la série reste « en cours ».
            value={draft.publishedVolumes ?? ""}
            onChange={e =>
              onChange({
                ...draft,
                publishedVolumes:
                  e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </label>

        <label>
          {yearReadLabel}
          <input
            type="number"
            min={0}
            step={1}
            // Champ vidé = NaN, refusé par yearReadCountError tant qu'il n'est pas rempli.
            value={Number.isNaN(yearReadCount) ? "" : yearReadCount}
            onChange={e =>
              onYearReadCountChange(
                e.target.value === "" ? Number.NaN : Number(e.target.value),
              )
            }
          />
        </label>
      </div>
      {volumesError !== null && <p className="hint">{volumesError}</p>}
      {countError !== null && <p className="hint">{countError}</p>}

      <label className="checkbox-option">
        <input
          type="checkbox"
          checked={draft.complete}
          onChange={e => onChange({ ...draft, complete: e.target.checked })}
        />
        Série complète (plus aucun tome à paraître)
      </label>

      <label className="checkbox-option">
        <input
          type="checkbox"
          checked={draft.abandoned}
          onChange={e => onChange({ ...draft, abandoned: e.target.checked })}
        />
        Abandonnée
      </label>
    </BookForm>
  )
}
