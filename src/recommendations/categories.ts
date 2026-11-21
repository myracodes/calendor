import type { RecommendationCategory } from "./types"

/** Mots propres à une catégorie, là où la page en parle. */
export interface CategoryWording {
  /** Libellé de l'onglet. */
  tabLabel: string
  /** Titre de la card de l'onglet. */
  cardTitle: string
  /** La liste dans une phrase : « ajouté aux films à voir ». */
  collection: string
}

/** Les catégories, dans l'ordre des onglets. */
export const RECOMMENDATION_CATEGORIES: RecommendationCategory[] = [
  "film",
  "musical",
  "book",
  "series",
]

export const CATEGORY_WORDING: Record<RecommendationCategory, CategoryWording> =
  {
    film: {
      tabLabel: "Films",
      cardTitle: "Films à voir",
      collection: "films à voir",
    },
    musical: {
      tabLabel: "Comédies musicales",
      cardTitle: "Comédies musicales à voir",
      collection: "comédies musicales à voir",
    },
    book: {
      tabLabel: "Livres",
      cardTitle: "Livres à lire",
      collection: "livres à lire",
    },
    series: {
      tabLabel: "Séries",
      cardTitle: "Séries à voir",
      collection: "séries à voir",
    },
  }
