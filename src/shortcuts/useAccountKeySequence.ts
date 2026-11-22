import { useEffect, useState } from "react"
import { fetchKeySequence } from "./shortcutsRepository"

/**
 * La séquence de touches du compte connecté, chargée au montage ; null tant
 * qu'elle n'est pas chargée, et pour un compte qui n'en a pas.
 */
export function useAccountKeySequence(): string[] | null {
  const [sequence, setSequence] = useState<string[] | null>(null)

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage (déconnexion).
    let cancelled = false
    fetchKeySequence()
      .then(loaded => {
        if (!cancelled) setSequence(loaded)
      })
      .catch((error: Error) => {
        // Rien à l'écran : les pages restent cachées sans gêner le reste de
        // l'app. Le message aide seulement à comprendre en dev (table pas
        // encore créée…).
        console.error(error)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return sequence
}
