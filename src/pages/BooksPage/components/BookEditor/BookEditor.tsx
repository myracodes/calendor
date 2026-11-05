import type { BookDraft } from "../../../../books/types"
import { isDraftComplete, readYearError } from "../../../../books/validation"
import { AuthorsField } from "../AuthorsField/AuthorsField"
import { BookForm } from "../BookForm/BookForm"
import { ReadingFields } from "../ReadingFields/ReadingFields"

interface BookEditorProps {
  draft: BookDraft
  onChange: (draft: BookDraft) => void
  onSave: () => Promise<void>
  onDelete: () => Promise<void>
  /** Ferme l'éditeur sans enregistrer. */
  onCancel: () => void
}

/** Modification d'un livre seul, ouverte dans la liste à sa place : titre, autrices et lecture. */
export function BookEditor({
  draft,
  onChange,
  onSave,
  onDelete,
  onCancel,
}: BookEditorProps) {
  return (
    <BookForm
      submitLabel="Enregistrer"
      canSubmit={
        isDraftComplete(draft) && readYearError(draft.readYear) === null
      }
      onSubmit={onSave}
      onClose={onCancel}
      deletion={{
        label: "Supprimer le livre",
        confirmation: `Supprimer le livre « ${draft.title} » ?`,
        onDelete,
      }}
    >
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

      <ReadingFields
        reading={draft}
        onChange={reading => onChange({ ...draft, ...reading })}
      />
    </BookForm>
  )
}
