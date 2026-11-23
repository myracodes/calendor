import {
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import type { PlanningTaskDraft } from "../../../../planning/types"
import { isTaskComplete } from "../../../../planning/validation"
import { InlineEntryForm } from "../../../../shared/InlineEntryForm/InlineEntryForm"
import type { useToast } from "../../../../shared/Toast/useToast"
import { TaskFields } from "../TaskFields/TaskFields"
import "./TaskDialog.css"

interface TaskDialogProps {
  /** Titre de la fenêtre : le jour cliqué pour un ajout, « Modifier la tâche » sinon. */
  heading: string
  initialDraft: PlanningTaskDraft
  /** Ce que fait la coche (« Ajouter la tâche », « Enregistrer la tâche »). */
  saveLabel: string
  /** Rejetée en cas d'échec : le message s'affiche dans un toast. */
  onSave: (draft: PlanningTaskDraft) => Promise<void>
  /** Corbeille, pour une tâche déjà enregistrée ; rejetée en cas d'échec, comme onSave. */
  onDelete?: () => Promise<void>
  /** Croix, touche Échap ou clic à côté de la fenêtre : on ferme sans enregistrer. */
  onClose: () => void
  showToast: ReturnType<typeof useToast>["showToast"]
  /**
   * Le toast de la page, rendu dans la fenêtre tant qu'elle est ouverte :
   * dehors, il passerait sous le fond grisé, hors d'atteinte.
   */
  toast: ReactNode
}

/** Fenêtre d'ajout ou de modification d'une tâche, par-dessus le planning. */
export function TaskDialog({
  heading,
  initialDraft,
  saveLabel,
  onSave,
  onDelete,
  onClose,
  showToast,
  toast,
}: TaskDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingId = useId()
  const [draft, setDraft] = useState(initialDraft)
  // L'appui a commencé sur le fond grisé : un clic dont l'appui commence
  // dans un champ (sélection de texte) et finit dehors ne ferme pas.
  const pressedOnBackdropRef = useRef(false)

  // showModal plutôt que l'attribut open : fond grisé, focus gardé dans la
  // fenêtre et fermeture par Échap fournis par le navigateur.
  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  // Le contenu remplit toute la fenêtre : seul un clic sur le fond grisé
  // tombe sur la fenêtre elle-même.
  function rememberPress(event: PointerEvent<HTMLDialogElement>) {
    pressedOnBackdropRef.current = event.target === event.currentTarget
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (pressedOnBackdropRef.current && event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="task-dialog"
      aria-labelledby={headingId}
      onClose={onClose}
      onPointerDown={rememberPress}
      onClick={closeOnBackdrop}
    >
      <div className="task-dialog-content">
        <h2 id={headingId}>{heading}</h2>
        <InlineEntryForm
          saveLabel={saveLabel}
          canSave={isTaskComplete(draft)}
          onSave={() => onSave(draft)}
          deletion={
            onDelete === undefined
              ? undefined
              : { label: "Supprimer la tâche", enabled: true, onDelete }
          }
          showToast={showToast}
        >
          <TaskFields draft={draft} onChange={setDraft} />
        </InlineEntryForm>
        {/* Après le formulaire : c'est le titre de la tâche qui prend le focus
            à l'ouverture, pas la croix (placée en haut à droite par le CSS). */}
        <button
          type="button"
          className="btn-close task-dialog-close"
          onClick={onClose}
          aria-label="Fermer sans enregistrer"
          title="Fermer sans enregistrer"
        >
          ×
        </button>
      </div>
      {toast}
    </dialog>
  )
}
