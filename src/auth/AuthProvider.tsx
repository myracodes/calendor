// Fournit la session Supabase courante à toute l'app (via useAuth). La session
// est persistée par le SDK dans le localStorage du navigateur : on reste
// connecté sur un appareil jusqu'à la durée maximale de session
// (sessionMaxAge.ts), puis on doit se reconnecter.

import type { Session } from "@supabase/supabase-js"
import { type ReactNode, useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import { AuthContext } from "./context"
import { openedFromInvalidLink, openedFromRecoveryLink } from "./emailLink"
import { sessionExpiresAt } from "./sessionMaxAge"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  // Sans Supabase configuré il n'y a rien à relire : on démarre déjà "chargé".
  const [loading, setLoading] = useState(supabase !== null)
  const [passwordRecovery, setPasswordRecovery] = useState(
    openedFromRecoveryLink,
  )
  const [invalidEmailLink, setInvalidEmailLink] = useState(
    openedFromInvalidLink,
  )

  useEffect(() => {
    if (supabase === null) return

    // Relit la session persistée, puis suit les changements (connexion,
    // déconnexion, rafraîchissement automatique du jeton).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession === null) {
        // Lien de réinitialisation refusé par Supabase, ou déconnexion : plus
        // de mot de passe à choisir.
        setPasswordRecovery(false)
      } else {
        // Connectée : le message du lien invalide n'a plus lieu d'être.
        setInvalidEmailLink(false)
      }
    })
    return () => data.subscription.unsubscribe()
  }, [])

  // Déconnecte une fois la durée maximale de session atteinte : tout de suite
  // si elle l'est déjà au démarrage, sinon à l'échéance. Un minuteur peut
  // prendre du retard pendant la mise en veille de l'appareil, mais au réveil
  // le SDK renouvelle le jeton : la session change, et ce calcul est refait.
  useEffect(() => {
    if (supabase === null || session === null) return
    const expiresAt = sessionExpiresAt(session)
    if (expiresAt === null) return

    const client = supabase
    const timer = setTimeout(
      () => {
        // "local" : ne déconnecte que cet appareil, pas les autres sessions.
        void client.auth.signOut({ scope: "local" })
      },
      Math.max(0, expiresAt - Date.now()),
    )
    return () => clearTimeout(timer)
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        passwordRecovery,
        finishPasswordRecovery: () => setPasswordRecovery(false),
        invalidEmailLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
