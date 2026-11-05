import type { BookFormat } from "./types"

/** Ce qui change d'un format à l'autre : seulement des mots, le suivi est le même. */
export interface BookFormatWording {
  cardTitle: string
  /** Fin des messages d'ajout : « ajouté à tes lectures de 2026 ». */
  collection: string
  /** Libellé du champ d'année. */
  yearLabel: string
  /** Participe accordé : « tome 3 lu », « tomes 3 à 5 lus ». */
  doneSingular: string
  donePlural: string
}

export const BOOK_FORMAT_WORDING: Record<BookFormat, BookFormatWording> = {
  print: {
    cardTitle: "Mes lectures",
    collection: "tes lectures",
    yearLabel: "Lu en",
    doneSingular: "lu",
    donePlural: "lus",
  },
  audio: {
    cardTitle: "Livres audio",
    collection: "tes livres audio",
    yearLabel: "Écouté en",
    doneSingular: "écouté",
    donePlural: "écoutés",
  },
}
