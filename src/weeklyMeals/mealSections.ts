import type { MealSection } from "./types"

/** Les sections de chaque journée, dans l'ordre de la journée. */
export const MEAL_SECTIONS: MealSection[] = [
  { label: "Petit déjeuner", lineCount: 3 },
  { label: "Matinée", lineCount: 2 },
  { label: "Déjeuner", lineCount: 5 },
  { label: "Goûter", lineCount: 2 },
  { label: "Dîner", lineCount: 5 },
]
