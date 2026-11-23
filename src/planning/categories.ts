// Catégories des tâches du planning : chacune donne sa couleur à la tâche
// (src/pages/PlanningPage/taskCategories.css).

export const TASK_CATEGORIES = [
  { id: "work", label: "Pro" },
  { id: "medical", label: "Médical" },
  { id: "personal", label: "Perso" },
] as const

/** Identifiant d'une catégorie, tel qu'enregistré en base (colonne `category`). */
export type TaskCategory = (typeof TASK_CATEGORIES)[number]["id"]

/** Catégorie d'une nouvelle tâche, avant qu'on en choisisse une autre. */
export const DEFAULT_TASK_CATEGORY: TaskCategory = "personal"

/** « Pro », « Médical », « Perso » : le nom affiché d'une catégorie. */
export function categoryLabel(category: TaskCategory): string {
  return (
    TASK_CATEGORIES.find(option => option.id === category)?.label ?? category
  )
}
