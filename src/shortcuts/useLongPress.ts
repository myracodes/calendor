import { type MouseEvent, useEffect, useRef, useState } from "react"

/** Gestionnaires à brancher sur l'élément à presser. */
export interface LongPressHandlers {
  onPointerDown: () => void
  onPointerUp: () => void
  onPointerLeave: () => void
  onPointerCancel: () => void
  onContextMenu: (e: MouseEvent) => void
}

/**
 * Vrai une fois l'élément maintenu enfoncé `durationMs` (doigt ou clic).
 * Lâcher, sortir de l'élément ou faire défiler la page avant la fin annule
 * l'appui. Gardé en mémoire seulement : un rechargement le remet à faux.
 */
export function useLongPress(
  durationMs: number,
): [boolean, LongPressHandlers] {
  const [reached, setReached] = useState(false)
  // L'appui en cours ; dans une ref, car il ne change rien à l'écran.
  const timer = useRef<number | null>(null)

  function cancel() {
    if (timer.current === null) return
    window.clearTimeout(timer.current)
    timer.current = null
  }

  function start() {
    cancel()
    timer.current = window.setTimeout(() => {
      timer.current = null
      setReached(true)
    }, durationMs)
  }

  // Un appui encore en cours au démontage (déconnexion) ne doit pas finir.
  useEffect(() => cancel, [])

  return [
    reached,
    {
      onPointerDown: start,
      onPointerUp: cancel,
      onPointerLeave: cancel,
      // Le navigateur reprend la main sur le doigt (défilement de la page).
      onPointerCancel: cancel,
      // Sur Android, l'appui long ouvre le menu contextuel par-dessus la page.
      onContextMenu: e => e.preventDefault(),
    },
  ]
}
