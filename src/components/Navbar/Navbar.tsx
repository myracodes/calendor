import { NavLink } from "react-router-dom"
import { useAuth } from "../../auth/useAuth"
import { requireSupabase } from "../../supabase/client"
import "./Navbar.css"

const LINKS = [
  { to: "/calendars", label: "Calendriers" },
  { to: "/budget", label: "Budget" },
  { to: "/batch-cooking", label: "Batch cooking" },
  { to: "/courses", label: "Courses" },
  { to: "/bujo", label: "BuJo factory" },
  { to: "/courrier", label: "Courrier" },
  { to: "/cv", label: "CV" },
]

export function Navbar() {
  // Session absente = Supabase non configuré ou personne de connectée :
  // dans les deux cas, pas de bouton de déconnexion.
  const { session } = useAuth()

  return (
    <nav className="navbar">
      {LINKS.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `navbar-link${isActive ? " navbar-link--active" : ""}`}
        >
          {link.label}
        </NavLink>
      ))}
      {session !== null && (
        <button type="button" className="navbar-logout" onClick={() => requireSupabase().auth.signOut()}>
          Déconnexion
        </button>
      )}
    </nav>
  )
}
