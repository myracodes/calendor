import type { FormEvent, ReactNode } from "react"
import checkIcon from "../../../../assets/icons/check.svg"
import trashIcon from "../../../../assets/icons/trash.svg"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import type { useToast } from "../../../../shared/Toast/useToast"
import { useInlineAction } from "../../useInlineAction"
import "./InlineEntryForm.css"

interface InlineEntryFormProps {
  /** Ce que fait la coche (« Ajouter la pesée », « Enregistrer l'objectif ») : lu par les lecteurs d'écran et affiché en infobulle. */
  saveLabel: string
  /** Faux quand il n'y a rien à enregistrer : la coche reste à sa place, grisée. */
  canSave: boolean
  /** Rejetée en cas d'échec : le message s'affiche dans un toast, la ligne n'ayant pas la place d'un message. */
  onSave: () => Promise<void>
  /** Corbeille à droite de la coche, pour supprimer ce qui est enregistré (l'objectif) ; absente pour un ajout. */
  deletion?: {
    /** Ce que supprime la corbeille (« Retirer l'objectif »). */
    label: string
    /** Faux quand il n'y a rien à supprimer : la corbeille reste à sa place, grisée. */
    enabled: boolean
    /** Rejetée en cas d'échec, comme onSave. */
    onDelete: () => Promise<void>
  }
  showToast: ReturnType<typeof useToast>["showToast"]
  /** Les champs (leurs labels), posés en ligne avant les boutons. */
  children: ReactNode
  /** Beaucoup de champs courts (une pesée et ses mesures) : ligne resserrée (.row-compact) pour tenir sur ordinateur. */
  compact?: boolean
}

/**
 * Version compacte d'EntryForm, en une ligne : les champs, puis la coche
 * (enregistrer, aussi par Entrée) et, en option, la corbeille (supprimer,
 * sans confirmation : le toast de la suppression propose « Annuler »).
 */
export function InlineEntryForm({
  saveLabel,
  canSave,
  onSave,
  deletion,
  showToast,
  children,
  compact = false,
}: InlineEntryFormProps) {
  const { busy, run } = useInlineAction(showToast)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (canSave) run(onSave)
  }

  function remove() {
    if (deletion?.enabled) run(deletion.onDelete)
  }

  return (
    <form onSubmit={submit}>
      <div className={compact ? "row row-compact" : "row"}>
        {children}
        <div className="inline-entry-form-actions">
          <IconButton
            type="submit"
            icon={checkIcon}
            label={saveLabel}
            busy={busy}
            disabled={!canSave}
          />
          {deletion !== undefined && (
            <IconButton
              icon={trashIcon}
              label={deletion.label}
              variant="secondary"
              busy={busy}
              disabled={!deletion.enabled}
              onClick={remove}
            />
          )}
        </div>
      </div>
    </form>
  )
}
