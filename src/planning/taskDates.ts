// Déplacements, extensions et copies d'une tâche, en jours entiers.

import { addDays, dayNumber } from "../dates"
import type { PlanningTask, PlanningTaskDraft } from "./types"

/** Nombre de jours de la tâche (1 pour une tâche d'un seul jour). */
export function taskLength(task: Pick<PlanningTask, "startDate" | "endDate">) {
  return dayNumber(task.endDate) - dayNumber(task.startDate) + 1
}

/** La tâche décalée de `days` jours, sans changer sa durée (glisser-déposer). */
export function shiftedDraft(
  task: PlanningTask,
  days: number,
): PlanningTaskDraft {
  return {
    id: task.id,
    title: task.title,
    startDate: addDays(task.startDate, days),
    endDate: addDays(task.endDate, days),
    category: task.category,
  }
}

/**
 * La tâche finissant le jour `endDate` (poignée du bas), jamais avant son
 * premier jour : la poignée remontée au-dessus la ramène à un seul jour.
 */
export function resizedDraft(
  task: PlanningTask,
  endDate: string,
): PlanningTaskDraft {
  return {
    id: task.id,
    title: task.title,
    startDate: task.startDate,
    endDate: endDate < task.startDate ? task.startDate : endDate,
    category: task.category,
  }
}

/**
 * Copie de la tâche, posée juste après elle avec la même durée : le
 * lendemain pour une tâche d'un jour (« Sport » refait le lendemain).
 */
export function duplicateDraft(task: PlanningTask): PlanningTaskDraft {
  return { ...shiftedDraft(task, taskLength(task)), id: null }
}
