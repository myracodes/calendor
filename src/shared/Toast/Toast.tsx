import { useEffect, useRef } from "react"
import "./Toast.css"

export type ToastVariant = "success" | "info" | "error"

/** Bouton proposé dans le toast, typiquement « Annuler » pour défaire l'action. */
export interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastProps {
  variant: ToastVariant
  message: string
  /** Action proposée à côté du message ; le toast se ferme après le clic. */
  action?: ToastAction
  /** Appelé au clic sur la croix, ou à la fin de `duration`. */
  onClose: () => void
  /** Durée d'affichage en millisecondes avant fermeture automatique ; `null` pour la désactiver. */
  duration?: number | null
}

const DEFAULT_DURATION_MS = 5000

/** Notification flottante en bas de l'écran, fermée automatiquement ou via la croix. */
export function Toast({
  variant,
  message,
  action,
  onClose,
  duration = DEFAULT_DURATION_MS,
}: ToastProps) {
  // Dernière version de onClose, pour que le minuteur ne redémarre pas à
  // chaque rendu du parent quand celui-ci passe une fonction recréée.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (duration === null) return
    const timeoutId = window.setTimeout(() => onCloseRef.current(), duration)
    return () => window.clearTimeout(timeoutId)
  }, [duration])

  return (
    <div
      className={`toast toast--${variant}`}
      // Une erreur interrompt le lecteur d'écran, les autres attendent leur tour.
      role={variant === "error" ? "alert" : "status"}
    >
      <p className="toast-message">{message}</p>
      {action !== undefined && (
        <button
          type="button"
          className="btn-remove"
          onClick={() => {
            action.onClick()
            onClose()
          }}
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        className="btn-remove toast-close"
        onClick={onClose}
        aria-label="Fermer la notification"
      >
        ×
      </button>
    </div>
  )
}
