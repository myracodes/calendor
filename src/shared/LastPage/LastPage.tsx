import { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { HOME_PATH } from "../../home/homePath"
import { NAV_LINKS } from "../Navbar/Navbar"

const STORAGE_KEY = "app.lastPage"
const DEFAULT_PAGE = HOME_PATH
// Pages que l'app sait rouvrir : l'accueil (sans onglet) et celles de la navbar.
const REOPENABLE_PAGES = [HOME_PATH, ...NAV_LINKS.map(link => link.to)]

// Mémorise la page affichée à chaque navigation, pour la rouvrir au prochain
// lancement de l'app.
export function LastPageTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (REOPENABLE_PAGES.includes(pathname))
      localStorage.setItem(STORAGE_KEY, pathname)
  }, [pathname])

  return null
}

// Redirige la racine vers la dernière page consultée. Une valeur inconnue
// (page renommée ou supprimée depuis) retombe sur la page par défaut.
export function LastPageRedirect() {
  const stored = localStorage.getItem(STORAGE_KEY)
  const target =
    stored !== null && REOPENABLE_PAGES.includes(stored) ? stored : DEFAULT_PAGE
  return <Navigate to={target} replace />
}
