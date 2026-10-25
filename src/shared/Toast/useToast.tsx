import { type ReactNode, useCallback, useState } from "react"
import { Toast, type ToastVariant } from "./Toast"

interface ToastState {
  // Change à chaque appel de showToast : remonte le Toast, donc relance son
  // minuteur, même si le même message est affiché deux fois de suite.
  id: number
  variant: ToastVariant
  message: string
}

/**
 * État d'un toast pour une page : `showToast` l'affiche (en remplaçant le
 * précédent), `toast` est l'élément à rendre n'importe où dans la page.
 */
export function useToast(): {
  toast: ReactNode
  showToast: (variant: ToastVariant, message: string) => void
} {
  const [state, setState] = useState<ToastState | null>(null)

  const showToast = useCallback((variant: ToastVariant, message: string) => {
    setState(previous => ({ id: (previous?.id ?? 0) + 1, variant, message }))
  }, [])

  const toast = state && (
    <Toast
      key={state.id}
      variant={state.variant}
      message={state.message}
      onClose={() => setState(null)}
    />
  )

  return { toast, showToast }
}
