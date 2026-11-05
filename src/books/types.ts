export interface Book {
  id: string
  title: string
  /** Une autrice au moins, dans l'ordre de la couverture. */
  authors: string[]
  /** Année de lecture (la date complète viendra peut-être plus tard). */
  readYear: number
  /** Lecture pas encore terminée. */
  inProgress: boolean
  /** Date d'ajout (ISO 8601), tenue par la base : ordonne les livres d'une même année, dans l'ordre d'ajout. */
  createdAt: string
}

/** Livre en cours d'édition ; id null = pas encore enregistré. */
export type BookDraft = Omit<Book, "id" | "createdAt"> & {
  id: string | null
}
