import { useContext } from "react"
import { type AuthState, AuthContext } from "./context"

/** L'état d'authentification courant (session + chargement initial). */
export function useAuth(): AuthState {
  return useContext(AuthContext)
}
