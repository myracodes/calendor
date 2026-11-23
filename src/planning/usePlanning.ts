import { useEffect, useState } from "react"
import {
  deletePlanningTask,
  fetchPlanningTasks,
  restorePlanningTask,
  savePlanningTask,
} from "./planningTasksRepository"
import type { DayRange } from "./range"
import type { PlanningTask, PlanningTaskDraft } from "./types"

/**
 * Les tâches des jours affichés, rechargées quand la fenêtre s'élargit, et
 * les actions pour les modifier : l'état local n'est mis à jour qu'une fois
 * la base d'accord.
 */
export function usePlanning(range: DayRange) {
  const [tasks, setTasks] = useState<PlanningTask[]>([])
  // Faux jusqu'au premier chargement réussi : la page attend avant d'afficher
  // la grille, puis la garde affichée pendant les chargements suivants.
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage, ou après un nouvel
    // élargissement de la fenêtre.
    let cancelled = false
    fetchPlanningTasks(range.from, range.to)
      .then(fetched => {
        if (cancelled) return
        putTasks(fetched)
        setLoadError(null)
        setLoaded(true)
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message)
      })
    return () => {
      cancelled = true
    }
  }, [range.from, range.to])

  // Ajoute ou remplace des tâches (même id) sans toucher aux autres : un
  // chargement de la fenêtre élargie ne perd pas une tâche tout juste
  // enregistrée.
  function putTasks(saved: PlanningTask[]) {
    const savedIds = new Set(saved.map(task => task.id))
    setTasks(previous => [
      ...previous.filter(task => !savedIds.has(task.id)),
      ...saved,
    ])
  }

  async function saveTask(draft: PlanningTaskDraft): Promise<PlanningTask> {
    const saved = await savePlanningTask(draft)
    putTasks([saved])
    return saved
  }

  async function removeTask(id: string): Promise<void> {
    await deletePlanningTask(id)
    setTasks(previous => previous.filter(task => task.id !== id))
  }

  /** Remet une tâche supprimée, à sa place dans le planning. */
  async function restoreTask(task: PlanningTask): Promise<void> {
    putTasks([await restorePlanningTask(task)])
  }

  return { tasks, loaded, loadError, saveTask, removeTask, restoreTask }
}

/** Les tâches et leurs actions, partagées par les composants de la page. */
export type PlanningLibrary = ReturnType<typeof usePlanning>
