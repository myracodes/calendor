/** Une section d'une journée (un repas ou une collation) et la place prévue pour l'écrire. */
export interface MealSection {
  /** intitulé affiché en tête de ligne */
  label: string
  /** nombre de lignes pointillées pour noter ce qui a été mangé */
  lineCount: number
}
