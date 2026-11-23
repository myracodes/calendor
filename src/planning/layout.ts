// Placement des tâches dans la grille du planning : une ligne par jour, et
// les tâches qui ont des jours en commun côte à côte, chacune dans sa colonne
// (son « couloir »), qu'elle garde sur toute sa durée.

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

/** Une tâche placée dans la grille. */
export interface TaskPlacement extends VisibleDays {
  task: PlanningTask
  /** Colonne de la tâche, 0 = la première après les dates. */
  lane: number
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

/**
 * Les tâches qui sont dans la fenêtre, placées, et le nombre de colonnes
 * nécessaires (au moins une, pour pouvoir cliquer sur un jour vide). Les plus
 * anciennes passent les premières, à gauche ; celles qui commencent le même
 * jour, dans leur ordre (sortOrder) : chacune prend la première colonne
 * libre, donc une colonne à droite de celles qui la précèdent.
 */
export function layoutTasks(
  tasks: PlanningTask[],
  range: DayRange,
): { placements: TaskPlacement[]; laneCount: number } {
  const visible = tasks
    .filter(task => isVisible(task, range))
    .sort(
      (a, b) =>
        a.startDate.localeCompare(b.startDate) ||
        a.sortOrder - b.sortOrder ||
        a.createdAt.localeCompare(b.createdAt),
    )

  // Dernier jour occupé de chaque colonne.
  const laneEnds: number[] = []
  const placements = visible.map(task => {
    const days = visibleDays(task, range)
    let lane = laneEnds.findIndex(laneEnd => laneEnd < days.firstDayIndex)
    if (lane === -1) lane = laneEnds.length
    laneEnds[lane] = days.lastDayIndex
    return { task, lane, ...days }
  })

  return { placements, laneCount: Math.max(1, laneEnds.length) }
}
