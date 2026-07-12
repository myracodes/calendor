import { NavLink } from "react-router-dom"
import "./Navbar.css"

const LINKS = [
  { to: "/calendars", label: "Calendriers" },
  { to: "/budget", label: "Budget" },
  { to: "/batch-cooking", label: "Batch cooking" },
]

export function Navbar() {
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
    </nav>
  )
}
