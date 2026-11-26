import { type CSSProperties, useRef } from "react"
import { gridRowsOf, startsMonth } from "../../../../planning/gridRows"
import { layoutTasks, type TaskPlacement } from "../../../../planning/layout"
import { publicHolidaysIn } from "../../../../planning/publicHolidays"
import { type DayRange, daysOf } from "../../../../planning/range"
import type {
  PlanningTask,
  PlanningTaskDraft,
} from "../../../../planning/types"
import type { useToast } from "../../../../shared/Toast/useToast"
import { PlanningDayRow } from "../PlanningDayRow/PlanningDayRow"
import { PlanningMonthHeader } from "../PlanningMonthHeader/PlanningMonthHeader"
import { PlanningTaskBlock } from "../PlanningTaskBlock/PlanningTaskBlock"
import "./PlanningGrid.css"
import { useTaskDrag } from "./useTaskDrag"

interface PlanningGridProps {
  range: DayRange
  today: string
  tasks: PlanningTask[]
  onAddOnDay: (day: string) => void
  onOpenTask: (task: PlanningTask) => void
  /** Rejetée en cas d'échec : le message s'affiche dans un toast. */
  onDuplicateTask: (task: PlanningTask) => Promise<void>
  /** Tâche lâchée à de nouvelles dates ou à une autre place ; ne rejette pas (voir useTaskDrag). */
  onDropTask: (task: PlanningTask, draft: PlanningTaskDraft) => Promise<void>
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * Le planning : l'intitulé de chaque mois sur sa propre ligne, une ligne par
 * jour avec son jour férié et ses tâches d'un seul jour, et à droite les
 * tâches de plusieurs jours, sur la hauteur de leurs jours.
 */
export function PlanningGrid({
  range,
  today,
  tasks,
  onAddOnDay,
  onOpenTask,
  onDuplicateTask,
  onDropTask,
  showToast,
}: PlanningGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const { preview, start, isClickSuppressed } = useTaskDrag(
    gridRef,
    tasks,
    onDropTask,
  )
  // La tâche en cours de glisser-déposer s'affiche à ses nouvelles dates et à
  // sa nouvelle place : les autres tâches s'écartent pour lui faire de la
  // place, comme elles le feront une fois lâchée.
  const shownTasks =
    preview === null
      ? tasks
      : tasks.map(task =>
          task.id === preview.id
            ? {
                ...task,
                startDate: preview.startDate,
                endDate: preview.endDate,
                sortOrder: preview.sortOrder ?? task.sortOrder,
              }
            : task,
        )
  const { singleDayTasks, placements, laneCount } = layoutTasks(
    shownTasks,
    range,
  )
  const publicHolidays = publicHolidaysIn(range)
  const days = daysOf(range)
  const { monthHeaders, dayRows } = gridRowsOf(days)

  function taskBlock(task: PlanningTask, placement?: TaskPlacement) {
    return (
      <PlanningTaskBlock
        key={task.id}
        task={task}
        placement={placement}
        rows={
          placement && {
            first: dayRows[placement.firstDayIndex],
            last: dayRows[placement.lastDayIndex],
          }
        }
        dragging={preview?.id === task.id}
        onDragStart={(event, kind) => start(event, task, kind)}
        onOpen={() => {
          if (!isClickSuppressed()) onOpenTask(task)
        }}
        onDuplicate={() => onDuplicateTask(task)}
        showToast={showToast}
      />
    )
  }

  // Exception à la règle "pas de CSS inline" (voir AGENTS.md) : seul le
  // nombre de colonnes de tâches passe par style, tout le dessin reste dans
  // le .css. Le cast est nécessaire, CSSProperties ne connaît pas les
  // variables CSS.
  const gridStyle = { "--lane-count": laneCount } as CSSProperties

  return (
    <div className="planning-scroll">
      <div ref={gridRef} className="planning-grid" style={gridStyle}>
        {monthHeaders.map(header => (
          <PlanningMonthHeader
            key={header.firstDay}
            firstDay={header.firstDay}
            row={header.row}
          />
        ))}
        {days.map((day, index) => (
          <PlanningDayRow
            key={day}
            day={day}
            row={dayRows[index]}
            firstOfMonth={startsMonth(day, index)}
            today={today}
            publicHoliday={publicHolidays.get(day)}
            onAdd={() => onAddOnDay(day)}
          >
            {singleDayTasks.get(day)?.map(task => taskBlock(task))}
          </PlanningDayRow>
        ))}
        {placements.map(placement => taskBlock(placement.task, placement))}
      </div>
    </div>
  )
}
