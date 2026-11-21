import { type FormEvent, type ReactNode, useState } from "react"
import { ActionButton } from "../ActionButton/ActionButton"
import "./EntryForm.css"

interface EntryFormProps {
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
 * Cadre commun des formulaires d'une liste enregistrée en base (livres, recos…) :
 * ajout en haut de la liste, ou modification ouverte à la place d'une entrée.
 * Champs, erreur d'enregistrement, suppression et enregistrement ; Entrée dans
 * un champ enregistre.
 */
export function EntryForm({
  submitLabel,
  canSubmit,
  onSubmit,
  onClose,
  deletion,
  children,
}: EntryFormProps) {
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
      className={`entry-form${onClose === undefined ? "" : " entry-form--framed"}`}
      onSubmit={submit}
    >
      {onClose !== undefined && (
        <button
          type="button"
          className="btn-close entry-form-close"
          disabled={busy}
          onClick={onClose}
          aria-label="Fermer sans enregistrer"
          title="Fermer sans enregistrer"
        >
          ×
        </button>
      )}

      {children}

      {error !== null && <p className="entry-form-error">{error}</p>}

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
