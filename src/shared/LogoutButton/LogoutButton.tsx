import { useAuth } from "../../auth/useAuth"
import { requireSupabase } from "../../supabase/client"
import "./LogoutButton.css"

/** Bouton de déconnexion de l'en-tête, à côté du titre de l'app. */
export function LogoutButton() {
  // Session absente = Supabase non configuré ou personne de connectée :
  // dans les deux cas, pas de bouton de déconnexion.
  const { session } = useAuth()
  if (session === null) return null

  return (
    <button
      type="button"
      className="logout-button"
      onClick={() => requireSupabase().auth.signOut()}
    >
      Déconnexion
    </button>
  )
}
