import type { CSSProperties, PointerEvent } from "react"
import copyIcon from "../../../../assets/icons/copy.svg"
import { categoryLabel } from "../../../../planning/categories"
import type { TaskPlacement } from "../../../../planning/layout"
import type { PlanningTask } from "../../../../planning/types"
import { taskPeriod } from "../../../../planning/wording"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import type { useToast } from "../../../../shared/Toast/useToast"
import { useInlineAction } from "../../../../shared/useInlineAction"
import type { DragKind } from "../PlanningGrid/useTaskDrag"
import "../../taskCategories.css"
import "./PlanningTaskBlock.css"

interface PlanningTaskBlockProps {
  task: PlanningTask
  /**
   * Tâche de plusieurs jours : sa place dans la grille (ses lignes de jours,
   * sa colonne). Absente pour une tâche d'un seul jour, posée dans la ligne
   * de son jour.
   */
  placement?: TaskPlacement
  /** En cours de glisser-déposer (ou d'enregistrement après le lâcher). */
  dragging: boolean
  onDragStart: (event: PointerEvent, kind: DragKind) => void
  onOpen: () => void
  /** Rejetée en cas d'échec : le message s'affiche dans un toast. */
  onDuplicate: () => Promise<void>
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * Une tâche dans la ligne de son jour, ou sur la hauteur de ses jours dans
 * une colonne à droite si elle en a plusieurs : un clic l'ouvre,
 * un glisser la déplace, sa poignée du bas l'étend sur d'autres jours, et le
 * bouton copie la duplique.
 */
export function PlanningTaskBlock({
  task,
  placement,
  dragging,
  onDragStart,
  onOpen,
  onDuplicate,
  showToast,
}: PlanningTaskBlockProps) {
  const { busy, run } = useInlineAction(showToast)
  const category = categoryLabel(task.category)

  // Exception à la règle "pas de CSS inline" (voir AGENTS.md) : seule la
  // place de la tâche dans la grille (ses lignes de jours et sa colonne)
  // passe par style, tout le dessin reste dans le .css. Le cast est
  // nécessaire, CSSProperties ne connaît pas les variables CSS.
  const placementStyle =
    placement === undefined
      ? undefined
      : ({
          "--first-row": placement.firstDayIndex + 1,
          "--row-span": placement.lastDayIndex - placement.firstDayIndex + 1,
          // + 3 : la grille commence par la colonne des dates, puis celle des
          // tâches d'un seul jour.
          "--lane-column": placement.lane + 3,
        } as CSSProperties)

  const classes = [
    "planning-task",
    `task-category--${task.category}`,
    placement !== undefined && "planning-task--multi-day",
    placement?.startsBefore && "planning-task--starts-before",
    placement?.endsAfter && "planning-task--ends-after",
    dragging && "planning-task--dragging",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    // data-task-* : disent à useTaskDrag où sont les tâches de chaque jour,
    // pour poser celle qu'on déplace avant ou après l'une d'elles.
    <div
      className={classes}
      style={placementStyle}
      data-task-id={task.id}
      data-task-start={task.startDate}
      data-task-end={task.endDate}
      onPointerDown={event => onDragStart(event, "move")}
    >
      <button
        type="button"
        className="planning-task-title"
        // La couleur dit la catégorie : le texte aussi, pour qui ne la voit pas.
        title={`${task.title} (${category})`}
        aria-label={`${task.title}, ${category}, ${taskPeriod(task)} : modifier`}
        onClick={onOpen}
      >
        {task.title}
      </button>
      {/* Pas de glisser depuis le bouton : un clic dessus duplique. */}
      <div
        className="planning-task-actions"
        onPointerDown={event => event.stopPropagation()}
      >
        <IconButton
          icon={copyIcon}
          label={`Dupliquer « ${task.title} »`}
          variant="secondary"
          size="small"
          busy={busy}
          onClick={() => run(onDuplicate)}
        />
      </div>
      {/* Poignée réservée à la souris et au doigt : au clavier, les dates se
          changent dans la fenêtre de la tâche. */}
      <div
        className="planning-task-resize"
        aria-hidden="true"
        title="Tirer pour changer le dernier jour"
        onPointerDown={event => {
          event.stopPropagation()
          onDragStart(event, "resize")
        }}
      />
    </div>
  )
}
