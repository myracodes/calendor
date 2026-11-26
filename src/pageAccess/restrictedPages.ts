/**
 * Pages réservées à certains comptes (table page_access, voir
 * supabase/page_access.sql). Les valeurs sont celles de la colonne `page` :
 * toute nouvelle valeur s'ajoute aussi à la contrainte check de la table.
 */
export const RESTRICTED_PAGE = {
  CV: "cv",
} as const

/** Identifiant d'une page réservée, tel qu'enregistré en base. */
export type RestrictedPage =
  (typeof RESTRICTED_PAGE)[keyof typeof RESTRICTED_PAGE]

const RESTRICTED_PAGES: readonly string[] = Object.values(RESTRICTED_PAGE)

export function isRestrictedPage(value: string): value is RestrictedPage {
  return RESTRICTED_PAGES.includes(value)
}
