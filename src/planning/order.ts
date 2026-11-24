// Ordre des tâches qui commencent le même jour, de gauche à droite dans la
// grille, que le glisser-déposer change (colonne sort_order). Les tâches d'un
// seul jour et celles de plusieurs jours sont rangées à des endroits
// différents (voir layout.ts) : chacune ne s'ordonne qu'avec celles de sa
// sorte.

import { isMultiDay } from "./layout"
import type { PlanningTask } from "./types"

/**
 * Les tâches de la même sorte que `task` (un seul jour, ou plusieurs) qui
 * commencent le jour `startDate`, sauf `task` elle-même, de gauche à droite.
 */
export function tasksStartingOn(
  tasks: PlanningTask[],
  startDate: string,
  task: PlanningTask,
): PlanningTask[] {
  return tasks
    .filter(
      other =>
        other.startDate === startDate &&
        other.id !== task.id &&
        isMultiDay(other) === isMultiDay(task),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * La place (sortOrder) de `task` posée juste avant la tâche `beforeId` (null :
 * après toutes) parmi celles de sa sorte qui commencent le jour `startDate` : entre ses
 * deux voisines, sans toucher aux autres. Sa place actuelle si elle y est
 * déjà, pour ne rien enregistrer quand rien ne change.
 */
export function sortOrderBefore(
  tasks: PlanningTask[],
  task: PlanningTask,
  startDate: string,
  beforeId: string | null,
): number {
  const sameDay = tasksStartingOn(tasks, startDate, task)
  const index =
    beforeId === null
      ? sameDay.length
      : sameDay.findIndex(other => other.id === beforeId)
  const previous = sameDay[index - 1]
  const next = sameDay[index]
  if (
    (previous === undefined || previous.sortOrder < task.sortOrder) &&
    (next === undefined || task.sortOrder < next.sortOrder)
  ) {
    return task.sortOrder
  }
  if (previous === undefined) return next.sortOrder - 1
  if (next === undefined) return previous.sortOrder + 1
  return (previous.sortOrder + next.sortOrder) / 2
}

/** Ses voisines de gauche et de droite parmi les tâches de sa sorte qui commencent le même jour qu'elle. */
export function neighborsOf(
  tasks: PlanningTask[],
  task: PlanningTask,
): { previous?: PlanningTask; next?: PlanningTask } {
  const sameDay = tasksStartingOn(tasks, task.startDate, task)
  const nextIndex = sameDay.findIndex(other => other.sortOrder > task.sortOrder)
  if (nextIndex === -1) return { previous: sameDay.at(-1) }
  return { previous: sameDay[nextIndex - 1], next: sameDay[nextIndex] }
}
