/** Une catégorie du catalogue de courses = un rayon du magasin. */
export interface CategorieCourses {
  /** identifiant stable (clés React) */
  id: string
  /** nom affiché, à l'écran comme dans le PDF */
  nom: string
  /** articles proposés en cases à cocher — libellés uniques au sein de la catégorie */
  articles: readonly string[]
}

/** Un achat ponctuel ajouté à la main, hors catalogue (ex. "ampoule E27"). */
export interface ArticleLibre {
  /** identifiant stable (clés React), généré à l'ajout */
  id: string
  label: string
}

/** Une section de la liste finale envoyée au PDF : un rayon et ses articles retenus. */
export interface SectionListe {
  nom: string
  articles: string[]
}
