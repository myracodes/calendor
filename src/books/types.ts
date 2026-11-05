/** Livre papier ou livre audio : même suivi, une card chacun sur la page. */
export type BookFormat = "print" | "audio"

export interface Book {
  id: string
  /** Titre d'un livre seul ; vide pour un tome, qui prend le nom de sa série. */
  title: string
  /** Autrices d'un livre seul, une au moins ; vide pour un tome, qui prend celles de sa série. */
  authors: string[]
  /** Année de lecture (la date complète viendra peut-être plus tard). */
  readYear: number
  /** Lecture pas encore terminée. */
  inProgress: boolean
  format: BookFormat
  /** Série dont le livre est un tome, null pour un livre seul. */
  seriesId: string | null
  /** Numéro du tome (à partir de 1), null pour un livre seul. */
  volume: number | null
  /** Date d'ajout (ISO 8601), tenue par la base : ordonne les livres d'une même année, dans l'ordre d'ajout. */
  createdAt: string
}

/** Livre en cours d'édition ; id null = pas encore enregistré. */
export type BookDraft = Omit<Book, "id" | "createdAt"> & {
  id: string | null
}

/** Série de livres (BD, mangas, romans en plusieurs tomes…) : ses tomes lus sont des Book. */
export interface BookSeries {
  id: string
  name: string
  /** Une autrice au moins, dans l'ordre de la couverture. */
  authors: string[]
  /** Nombre de tomes parus, null tant qu'il n'est pas renseigné. */
  publishedVolumes: number | null
  /** Œuvre complète : plus aucun tome ne sortira. */
  complete: boolean
  /** Lecture arrêtée en route. */
  abandoned: boolean
}

/** Série en cours d'édition ; id null = pas encore enregistrée. */
export type BookSeriesDraft = Omit<BookSeries, "id"> & { id: string | null }

/**
 * Formulaire d'ajout : un livre seul, ou un tome dès que seriesName est rempli
 * (série retrouvée par son nom, ou créée avec ce premier tome).
 */
export interface NewBookForm {
  seriesName: string
  volume: number
  /** Livre seul seulement. */
  title: string
  /** Livre seul ou nouvelle série. */
  authors: string[]
  readYear: number
  inProgress: boolean
}
