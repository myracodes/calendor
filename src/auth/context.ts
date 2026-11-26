// Le contexte d'authentification, dans son propre module pour que
// AuthProvider.tsx n'exporte qu'un composant (exigence du fast refresh).

import type { Session } from "@supabase/supabase-js"
import { createContext } from "react"

export interface AuthState {
  /** Session de la personne connectée, ou null (déconnectée ou Supabase non configuré). */
  session: Session | null
  /** true le temps de relire la session depuis le localStorage au démarrage. */
  loading: boolean
  /** true tant que la session, ouverte par un lien de réinitialisation, attend le nouveau mot de passe. */
  passwordRecovery: boolean
  /** À appeler une fois le nouveau mot de passe enregistré : l'app s'ouvre. */
  finishPasswordRecovery: () => void
  /** true si l'app a été ouverte depuis un lien d'email expiré ou déjà utilisé, jusqu'à la connexion. */
  invalidEmailLink: boolean
}

export const AuthContext = createContext<AuthState>({
  session: null,
  loading: true,
  passwordRecovery: false,
  finishPasswordRecovery: () => {},
  invalidEmailLink: false,
})
