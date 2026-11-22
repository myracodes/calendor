import { NavLink } from "react-router-dom"
import { WEIGHT_PATH } from "../../weight/weightPath"
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
  { to: "/books", label: "Livres" },
  { to: "/recommendations", label: "Reco culturelles" },
  { to: "/gift-ideas", label: "Idées cadeaux" },
  { to: "/keyboard", label: "Clavier" },
]

/**
 * Onglets des pages cachées, ajoutés en fin de navbar une fois affichées
 * (voir App.tsx). Hors de NAV_LINKS, ils ne sont jamais retenus comme dernière page
 * (LastPage) : un rechargement ne peut pas les rouvrir.
 */
const SECRET_NAV_LINKS = [{ to: WEIGHT_PATH, label: "Poids" }]

interface NavbarProps {
  /** Affiche les onglets des pages cachées. */
  showSecretLinks: boolean
}

export function Navbar({ showSecretLinks }: NavbarProps) {
  const links = showSecretLinks
    ? [...NAV_LINKS, ...SECRET_NAV_LINKS]
    : NAV_LINKS
  return (
    <nav className="navbar">
      {links.map(link => (
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
    </nav>
  )
}
