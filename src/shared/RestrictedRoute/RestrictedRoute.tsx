import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { HOME_PATH } from "../../home/homePath"
import type { RestrictedPage } from "../../pageAccess/restrictedPages"
import type { PageAccess } from "../../pageAccess/useAccountPageAccess"

interface RestrictedRouteProps {
  page: RestrictedPage
  access: PageAccess
  children: ReactNode
}

/**
 * Affiche une page réservée au compte qui y a accès ; les autres (adresse
 * tapée à la main, dernière page rouverte au lancement) repartent vers
 * l'accueil. Rien ne s'affiche le temps de charger les accès.
 */
export function RestrictedRoute({
  page,
  access,
  children,
}: RestrictedRouteProps) {
  if (access.loading) return null
  if (!access.pages.has(page)) return <Navigate to={HOME_PATH} replace />
  return children
}
