import { type CSSProperties, useRef } from "react"
import { layoutTasks } from "../../../../planning/layout"
import { type DayRange, daysOf } from "../../../../planning/range"
import type {
  PlanningTask,
  PlanningTaskDraft,
} from "../../../../planning/types"
import type { useToast } from "../../../../shared/Toast/useToast"
import { PlanningDayRow } from "../PlanningDayRow/PlanningDayRow"
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
 * Le planning : une ligne par jour, les tâches posées sur leurs jours, côte à
 * côte quand elles en partagent.
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
  const { placements, laneCount } = layoutTasks(shownTasks, range)

  // Exception à la règle "pas de CSS inline" (voir AGENTS.md) : seul le
  // nombre de colonnes de tâches passe par style, tout le dessin reste dans
  // le .css. Le cast est nécessaire, CSSProperties ne connaît pas les
  // variables CSS.
  const gridStyle = { "--lane-count": laneCount } as CSSProperties

  return (
    <div className="planning-scroll">
      <div ref={gridRef} className="planning-grid" style={gridStyle}>
        {daysOf(range).map((day, index) => (
          <PlanningDayRow
            key={day}
            day={day}
            index={index}
            today={today}
            onAdd={() => onAddOnDay(day)}
          />
        ))}
        {placements.map(placement => (
          <PlanningTaskBlock
            key={placement.task.id}
            placement={placement}
            dragging={preview?.id === placement.task.id}
            onDragStart={(event, kind) => start(event, placement.task, kind)}
            onOpen={() => {
              if (!isClickSuppressed()) onOpenTask(placement.task)
            }}
            onDuplicate={() => onDuplicateTask(placement.task)}
            showToast={showToast}
          />
        ))}
      </div>
    </div>
  )
}
