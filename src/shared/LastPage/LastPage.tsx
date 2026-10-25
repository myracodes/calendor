import { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { NAV_LINKS } from "../Navbar/Navbar"

const STORAGE_KEY = "app.lastPage"
const DEFAULT_PAGE = "/calendars"

// Mémorise la page affichée à chaque navigation, pour la rouvrir au prochain
// lancement de l'app.
export function LastPageTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (NAV_LINKS.some(link => link.to === pathname))
      localStorage.setItem(STORAGE_KEY, pathname)
  }, [pathname])

  return null
}

// Redirige la racine vers la dernière page consultée. Une valeur inconnue
// (page renommée ou supprimée depuis) retombe sur la page par défaut.
export function LastPageRedirect() {
  const stored = localStorage.getItem(STORAGE_KEY)
  const target = NAV_LINKS.some(link => link.to === stored)
    ? stored!
    : DEFAULT_PAGE
  return <Navigate to={target} replace />
}
