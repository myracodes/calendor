/** Première année acceptée par le formulaire, pour écarter une faute de frappe (« 226 »). */
export const FIRST_READ_YEAR = 1900

/** Année en cours : l'année de lecture par défaut, un livre s'ajoutant dès qu'il est fini. */
export function currentYear(): number {
  return new Date().getFullYear()
}
