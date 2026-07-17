// Fournit la session Supabase courante à toute l'app (via useAuth). La session
// est persistée par le SDK dans le localStorage du navigateur : on ne se
// connecte qu'une fois par appareil.

import type { Session } from "@supabase/supabase-js"
import { type ReactNode, useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import { AuthContext } from "./context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  // Sans Supabase configuré il n'y a rien à relire : on démarre déjà "chargé".
  const [loading, setLoading] = useState(supabase !== null)

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
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>
}
