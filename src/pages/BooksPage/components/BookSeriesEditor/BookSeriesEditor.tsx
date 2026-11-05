import { plural } from "../../../../books/format"
import type { BookSeriesDraft } from "../../../../books/types"
import {
  isSeriesDraftComplete,
  publishedVolumesError,
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
  onSave,
  onDelete,
  onCancel,
}: BookSeriesEditorProps) {
  const volumesError = publishedVolumesError(draft, highestVolume)

  return (
    <BookForm
      submitLabel="Enregistrer"
      canSubmit={isSeriesDraftComplete(draft) && volumesError === null}
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
      {volumesError !== null && <p className="hint">{volumesError}</p>}

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
