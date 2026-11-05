import { type FormEvent, useState } from "react"
import { currentYear, FIRST_READ_YEAR } from "../../../../books/readYear"
import type { BookDraft } from "../../../../books/types"
import { isDraftComplete, readYearError } from "../../../../books/validation"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import { AuthorsField } from "../AuthorsField/AuthorsField"
import "./BookEditor.css"

interface BookEditorProps {
  draft: BookDraft
  onChange: (draft: BookDraft) => void
  onSave: () => Promise<void>
  /** Modification d'un livre enregistré seulement. */
  onDelete?: () => Promise<void>
  /** Ferme l'éditeur sans enregistrer ; modification seulement. */
  onCancel?: () => void
}

/**
 * Formulaire d'un livre : titre, autrices, année de lecture et lecture en cours. Toujours affiché
 * en haut de la liste pour un ajout ; encadré, à la place du livre, pour une
 * modification.
 */
export function BookEditor({
  draft,
  onChange,
  onSave,
  onDelete,
  onCancel,
}: BookEditorProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const yearError = readYearError(draft)
  const canSave = isDraftComplete(draft) && yearError === null
  const isNew = draft.id === null

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError(null)
    try {
      await action()
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      setBusy(false)
    }
  }

  // Formulaire natif : Entrée dans un champ enregistre le livre.
  function submit(e: FormEvent) {
    e.preventDefault()
    if (canSave && !busy) run(onSave)
  }

  function confirmDelete() {
    if (onDelete === undefined) return
    if (!window.confirm(`Supprimer le livre « ${draft.title} » ?`)) return
    run(onDelete)
  }

  return (
    <form
      className={`book-editor${isNew ? "" : " book-editor--framed"}`}
      onSubmit={submit}
    >
      {onCancel !== undefined && (
        <button
          type="button"
          className="btn-close book-editor-close"
          disabled={busy}
          onClick={onCancel}
          aria-label="Fermer sans enregistrer"
          title="Fermer sans enregistrer"
        >
          ×
        </button>
      )}

      <label>
        Titre
        <input
          type="text"
          value={draft.title}
          onChange={e => onChange({ ...draft, title: e.target.value })}
        />
      </label>

      <AuthorsField
        authors={draft.authors}
        onChange={authors => onChange({ ...draft, authors })}
      />

      <div className="row row-field-aligned">
        <label>
          Lu en
          <input
            type="number"
            min={FIRST_READ_YEAR}
            max={currentYear()}
            step={1}
            // Champ vidé = 0, refusé par readYearError tant qu'il n'est pas rempli.
            value={draft.readYear === 0 ? "" : draft.readYear}
            onChange={e =>
              onChange({
                ...draft,
                readYear: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />
        </label>

        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={draft.inProgress}
            onChange={e => onChange({ ...draft, inProgress: e.target.checked })}
          />
          En cours
        </label>
      </div>

      {yearError !== null && <p className="hint">{yearError}</p>}
      {error !== null && <p className="book-editor-error">{error}</p>}

      <div>
        {onDelete !== undefined && (
          <ActionButton
            variant="secondary"
            disabled={busy}
            onClick={confirmDelete}
          >
            Supprimer le livre
          </ActionButton>
        )}
        <ActionButton type="submit" busy={busy} disabled={!canSave}>
          {busy ? "Enregistrement…" : isNew ? "Ajouter" : "Enregistrer"}
        </ActionButton>
      </div>
    </form>
  )
}
