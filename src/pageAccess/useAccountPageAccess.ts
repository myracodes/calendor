import { useEffect, useState } from "react"
import { fetchAccessiblePages } from "./pageAccessRepository"
import type { RestrictedPage } from "./restrictedPages"

export interface PageAccess {
  /** Les pages réservées que le compte connecté peut ouvrir. */
  pages: ReadonlySet<RestrictedPage>
  /**
   * true tant que les accès ne sont pas chargés : une page réservée attend
   * plutôt que de renvoyer vers l'accueil un compte qui y a droit.
   */
  loading: boolean
}

/** Les pages réservées accessibles au compte connecté, chargées au montage. */
export function useAccountPageAccess(): PageAccess {
  const [access, setAccess] = useState<PageAccess>({
    pages: new Set(),
    loading: true,
  })

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage (déconnexion).
    let cancelled = false
    fetchAccessiblePages()
      .then(pages => {
        if (!cancelled) setAccess({ pages, loading: false })
      })
      .catch((error: Error) => {
        // Rien à l'écran : les pages réservées restent fermées sans gêner le
        // reste de l'app. Le message aide seulement à comprendre en dev
        // (table pas encore créée…).
        console.error(error)
        if (!cancelled) setAccess({ pages: new Set(), loading: false })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return access
}
