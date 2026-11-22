import { useEffect, useState } from "react"
import { endsWithSequence, normalizeKey } from "./keySequence"

/**
 * Vrai une fois la séquence tapée au clavier. Gardé en mémoire seulement :
 * un rechargement de la page le remet à faux.
 * @param sequence la séquence du compte (useAccountKeySequence) ; null = pas
 * de séquence, rien à écouter
 */
export function useKeySequence(sequence: string[] | null): boolean {
  const [typed, setTyped] = useState(false)

  useEffect(() => {
    if (typed || sequence === null) return
    const expected = sequence.map(normalizeKey)
    // Les dernières touches de la séquence tapées, juste assez pour la contenir.
    let keys: string[] = []

    // Les touches absentes de la séquence sont ignorées plutôt que de la
    // remettre à zéro : la touche Maj, pressée pour une majuscule, ne la
    // casse pas.
    function onKeyDown(e: KeyboardEvent) {
      // Une touche maintenue ne compte qu'une fois.
      if (e.repeat) return
      const key = normalizeKey(e.key)
      if (!expected.includes(key)) return
      keys = [...keys, key].slice(-expected.length)
      if (endsWithSequence(keys, expected)) setTyped(true)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [typed, sequence])

  return typed
}
