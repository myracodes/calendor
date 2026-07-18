// Le contexte d'authentification, dans son propre module pour que
// AuthProvider.tsx n'exporte qu'un composant (exigence du fast refresh).

import type { Session } from "@supabase/supabase-js"
import { createContext } from "react"

export interface AuthState {
  /** Session de la personne connectée, ou null (déconnectée ou Supabase non configuré). */
  session: Session | null
  /** true le temps de relire la session depuis le localStorage au démarrage. */
  loading: boolean
}

export const AuthContext = createContext<AuthState>({
  session: null,
  loading: true,
})
