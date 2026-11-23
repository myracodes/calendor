import type { TaskCategory } from "./categories"

/** Une tâche du planning : sur un jour, ou sur plusieurs jours d'affilée. */
export interface PlanningTask {
  id: string
  title: string
  /** Premier jour, au format ISO « aaaa-mm-jj ». */
  startDate: string
  /** Dernier jour, inclus : égal à startDate pour une tâche d'un seul jour. */
  endDate: string
  /** Pro, médical ou perso : donne sa couleur à la tâche. */
  category: TaskCategory
  /**
   * Place parmi les tâches qui commencent le même jour, de gauche à droite
   * (voir order.ts) : la plus petite d'abord.
   */
  sortOrder: number
  /** Date d'ajout (ISO 8601), tenue par la base. */
  createdAt: string
}

/** Tâche en cours de saisie ou de modification ; id null = pas encore enregistrée. */
export type PlanningTaskDraft = Omit<
  PlanningTask,
  "id" | "sortOrder" | "createdAt"
> & {
  id: string | null
  /**
   * Absente : la place ne change pas pour une tâche enregistrée, et une
   * nouvelle tâche se range après celles de son premier jour.
   */
  sortOrder?: number
}
