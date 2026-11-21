/** Catégorie d'une reco : chacune a son onglet sur la page. */
export type RecommendationCategory = "film" | "musical" | "book" | "series"

export interface Recommendation {
  id: string
  category: RecommendationCategory
  title: string
  /** Qui me l'a recommandé (« Maman », « Julie »…) ; vide si non renseigné. */
  recommendedBy: string
  /** Date d'ajout (ISO 8601), tenue par la base : la plus récente en tête de liste. */
  createdAt: string
}

/** Reco en cours de saisie ou de modification ; id null = pas encore enregistrée. */
export type RecommendationDraft = Omit<Recommendation, "id" | "createdAt"> & {
  id: string | null
}
