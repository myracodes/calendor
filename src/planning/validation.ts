import type { PlanningTaskDraft } from "./types"

/** Une tâche s'enregistre dès qu'elle a un titre et qu'elle ne finit pas avant d'avoir commencé. */
export function isTaskComplete(draft: PlanningTaskDraft): boolean {
  return (
    draft.title.trim() !== "" &&
    draft.startDate !== "" &&
    draft.endDate !== "" &&
    draft.endDate >= draft.startDate
  )
}
