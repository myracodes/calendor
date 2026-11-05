import { type FormEvent, type ReactNode, useState } from "react"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import "./BookForm.css"

interface BookFormProps {
  /** Libellé du bouton d'enregistrement (« Ajouter », « Enregistrer »). */
  submitLabel: string
  canSubmit: boolean
  /** Rejetée en cas d'échec : le message s'affiche sous les champs. */
  onSubmit: () => Promise<void>
  /** Modification : encadre le formulaire, avec une croix pour fermer sans enregistrer. */
  onClose?: () => void
  /** Modification : bouton secondaire de suppression, demandé après confirmation. */
  deletion?: {
    label: string
    confirmation: string
    onDelete: () => Promise<void>
  }
  children: ReactNode
}

/**
 * Cadre commun des formulaires de la page (ajout, livre, série) : champs, erreur
 * d'enregistrement, suppression et enregistrement. Entrée dans un champ enregistre.
 */
export function BookForm({
  submitLabel,
  canSubmit,
  onSubmit,
  onClose,
  deletion,
  children,
}: BookFormProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  function submit(e: FormEvent) {
    e.preventDefault()
    if (canSubmit && !busy) run(onSubmit)
  }

  function confirmDelete() {
    if (deletion === undefined || !window.confirm(deletion.confirmation)) return
    run(deletion.onDelete)
  }

  return (
    <form
      className={`book-form${onClose === undefined ? "" : " book-form--framed"}`}
      onSubmit={submit}
    >
      {onClose !== undefined && (
        <button
          type="button"
          className="btn-close book-form-close"
          disabled={busy}
          onClick={onClose}
          aria-label="Fermer sans enregistrer"
          title="Fermer sans enregistrer"
        >
          ×
        </button>
      )}

      {children}

      {error !== null && <p className="book-form-error">{error}</p>}

      <div>
        {deletion !== undefined && (
          <ActionButton
            variant="secondary"
            disabled={busy}
            onClick={confirmDelete}
          >
            {deletion.label}
          </ActionButton>
        )}
        <ActionButton type="submit" busy={busy} disabled={!canSubmit}>
          {busy ? "Enregistrement…" : submitLabel}
        </ActionButton>
      </div>
    </form>
  )
}
