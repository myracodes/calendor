// Placement des tâches dans la grille du planning : une ligne par jour. Les
// tâches d'un seul jour se suivent dans leur ligne, qui grandit quand elles
// ne tiennent plus en largeur ; celles de plusieurs jours sont à droite,
// chacune dans sa colonne (son « couloir »), qu'elle garde sur toute sa durée.

import { dayNumber } from "../dates"
import type { DayRange } from "./range"
import type { PlanningTask } from "./types"

type TaskDates = Pick<PlanningTask, "startDate" | "endDate">

/** Les jours d'une tâche, coupés aux jours affichés. */
interface VisibleDays {
  /** Index (dans les jours affichés) de son premier jour visible. */
  firstDayIndex: number
  /** Index de son dernier jour visible. */
  lastDayIndex: number
  /** Commence avant le premier jour affiché : son haut ne s'arrondit pas. */
  startsBefore: boolean
  /** Finit après le dernier jour affiché : son bas ne s'arrondit pas. */
  endsAfter: boolean
}

/** Une tâche de plusieurs jours placée dans la grille. */
export interface TaskPlacement extends VisibleDays {
  task: PlanningTask
  /** Colonne de la tâche, 0 = la première des tâches de plusieurs jours. */
  lane: number
}

/** Sur plusieurs jours : dans une colonne à droite, plutôt que dans la ligne de son jour. */
export function isMultiDay(task: TaskDates): boolean {
  return task.startDate !== task.endDate
}

function isVisible(dates: TaskDates, range: DayRange): boolean {
  return dates.startDate <= range.to && dates.endDate >= range.from
}

function visibleDays(dates: TaskDates, range: DayRange): VisibleDays {
  const first = dayNumber(range.from)
  const last = dayNumber(range.to)
  return {
    firstDayIndex: Math.max(dayNumber(dates.startDate), first) - first,
    lastDayIndex: Math.min(dayNumber(dates.endDate), last) - first,
    startsBefore: dates.startDate < range.from,
    endsAfter: dates.endDate > range.to,
  }
}

/** Les plus anciennes d'abord ; celles qui commencent le même jour, dans leur ordre (sortOrder). */
function byStartThenOrder(a: PlanningTask, b: PlanningTask): number {
  return (
    a.startDate.localeCompare(b.startDate) ||
    a.sortOrder - b.sortOrder ||
    a.createdAt.localeCompare(b.createdAt)
  )
}

/**
 * Les tâches qui sont dans la fenêtre : celles d'un seul jour regroupées par
 * jour, dans leur ordre ; celles de plusieurs jours placées en colonnes, et
 * le nombre de colonnes (au moins une, vide s'il n'y en a pas). Chacune
 * prend la première colonne libre : les plus anciennes à gauche, et celles
 * qui commencent le même jour dans leur ordre.
 */
export function layoutTasks(
  tasks: PlanningTask[],
  range: DayRange,
): {
  singleDayTasks: Map<string, PlanningTask[]>
  placements: TaskPlacement[]
  laneCount: number
} {
  const visible = tasks
    .filter(task => isVisible(task, range))
    .sort(byStartThenOrder)

  const singleDayTasks = new Map<string, PlanningTask[]>()
  for (const task of visible.filter(task => !isMultiDay(task))) {
    const dayTasks = singleDayTasks.get(task.startDate) ?? []
    dayTasks.push(task)
    singleDayTasks.set(task.startDate, dayTasks)
  }

  // Dernier jour occupé de chaque colonne.
  const laneEnds: number[] = []
  const placements = visible.filter(isMultiDay).map(task => {
    const days = visibleDays(task, range)
    let lane = laneEnds.findIndex(laneEnd => laneEnd < days.firstDayIndex)
    if (lane === -1) lane = laneEnds.length
    laneEnds[lane] = days.lastDayIndex
    return { task, lane, ...days }
  })

  return {
    singleDayTasks,
    placements,
    laneCount: Math.max(1, laneEnds.length),
  }
}
