import { useRef, useState } from "react"

/** Au-delà de ce délai depuis la précédente, une tape ne s'ajoute plus à la série : elle en recommence une. */
const MAX_DELAY_BETWEEN_TAPS_MS = 1000

/**
 * Vrai une fois `count` tapes (ou clics) rapprochées sur un élément, comme le
 * numéro de build d'Android : le second élément est à brancher sur son
 * onClick. Gardé en mémoire seulement : un rechargement le remet à faux.
 */
export function useRepeatedTaps(count: number): [boolean, () => void] {
  const [reached, setReached] = useState(false)
  // La série en cours ; dans une ref, car une tape ne change rien à l'écran.
  const streak = useRef({ taps: 0, lastTapAt: 0 })

  function tap() {
    const now = Date.now()
    const current = streak.current
    current.taps =
      now - current.lastTapAt <= MAX_DELAY_BETWEEN_TAPS_MS
        ? current.taps + 1
        : 1
    current.lastTapAt = now
    if (current.taps >= count) setReached(true)
  }

  return [reached, tap]
}
