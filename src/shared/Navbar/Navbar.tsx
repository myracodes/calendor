import { NavLink } from "react-router-dom"
import { useAuth } from "../../auth/useAuth"
import { requireSupabase } from "../../supabase/client"
import "./Navbar.css"

export const NAV_LINKS = [
  { to: "/calendars", label: "Calendriers" },
  { to: "/budget", label: "Budget" },
  { to: "/batch-cooking", label: "Batch cooking" },
  { to: "/courses", label: "Courses" },
  { to: "/paper-factory", label: "Paper factory" },
  { to: "/courrier", label: "Courrier" },
  { to: "/cv", label: "CV" },
  { to: "/series", label: "Séries" },
]

export function Navbar() {
  // Session absente = Supabase non configuré ou personne de connectée :
  // dans les deux cas, pas de bouton de déconnexion.
  const { session } = useAuth()

  return (
    <nav className="navbar">
      {NAV_LINKS.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `navbar-link${isActive ? " navbar-link--active" : ""}`
          }
        >
          {link.label}
        </NavLink>
      ))}
      {session !== null && (
        <button
          type="button"
          className="navbar-logout"
          onClick={() => requireSupabase().auth.signOut()}
        >
          Déconnexion
        </button>
      )}
    </nav>
  )
}
