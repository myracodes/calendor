// Lecture et écriture des tâches du planning dans Supabase (table
// `planning_tasks`, voir supabase/planning_tasks.sql).

import { requireSupabase } from "../supabase/client"
import type { TaskCategory } from "./categories"
import type { PlanningTask, PlanningTaskDraft } from "./types"

const COLUMNS =
  "id, title, start_date, end_date, category, sort_order, created_at"

type PlanningTaskRow = {
  id: string
  title: string
  start_date: string
  end_date: string
  category: TaskCategory
  sort_order: number
  created_at: string
}

function toTask(row: PlanningTaskRow): PlanningTask {
  return {
    id: row.id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date,
    category: row.category,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }
}

function toError(error: { message: string }): Error {
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/**
 * Les tâches du compte connecté qui touchent au moins un jour entre `from` et
 * `to` (inclus) : seulement les jours affichés, la base ne renvoyant pas plus
 * de 1000 lignes par requête.
 */
export async function fetchPlanningTasks(
  from: string,
  to: string,
): Promise<PlanningTask[]> {
  const { data, error } = await requireSupabase()
    .from("planning_tasks")
    .select(COLUMNS)
    .lte("start_date", to)
    .gte("end_date", from)
  if (error !== null) throw toError(error)
  return (data as PlanningTaskRow[]).map(toTask)
}

/** Crée la tâche si elle est nouvelle (id null), sinon la met à jour. */
export async function savePlanningTask(
  draft: PlanningTaskDraft,
): Promise<PlanningTask> {
  const values = {
    title: draft.title.trim(),
    start_date: draft.startDate,
    end_date: draft.endDate,
    category: draft.category,
    // Sans place donnée, la base garde celle de la tâche, ou en donne une
    // après les autres à une nouvelle tâche (valeur par défaut de la colonne).
    ...(draft.sortOrder !== undefined && { sort_order: draft.sortOrder }),
  }
  const table = requireSupabase().from("planning_tasks")
  const { data, error } =
    draft.id === null
      ? await table.insert(values).select(COLUMNS).single()
      : await table.update(values).eq("id", draft.id).select(COLUMNS).single()
  if (error !== null) throw toError(error)
  return toTask(data as PlanningTaskRow)
}

/** Recrée une tâche supprimée telle qu'elle était (même id, même date d'ajout), pour « Annuler ». */
export async function restorePlanningTask(
  task: PlanningTask,
): Promise<PlanningTask> {
  const { data, error } = await requireSupabase()
    .from("planning_tasks")
    .insert({
      id: task.id,
      title: task.title,
      start_date: task.startDate,
      end_date: task.endDate,
      category: task.category,
      sort_order: task.sortOrder,
      created_at: task.createdAt,
    })
    .select(COLUMNS)
    .single()
  if (error !== null) throw toError(error)
  return toTask(data as PlanningTaskRow)
}

export async function deletePlanningTask(id: string): Promise<void> {
  const { error } = await requireSupabase()
    .from("planning_tasks")
    .delete()
    .eq("id", id)
  if (error !== null) throw toError(error)
}
