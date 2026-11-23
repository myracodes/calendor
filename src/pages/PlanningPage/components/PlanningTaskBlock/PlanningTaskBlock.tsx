import type { CSSProperties, PointerEvent } from "react"
import copyIcon from "../../../../assets/icons/copy.svg"
import { categoryLabel } from "../../../../planning/categories"
import type { TaskPlacement } from "../../../../planning/layout"
import { taskPeriod } from "../../../../planning/wording"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import type { useToast } from "../../../../shared/Toast/useToast"
import { useInlineAction } from "../../../../shared/useInlineAction"
import type { DragKind } from "../PlanningGrid/useTaskDrag"
import "../../taskCategories.css"
import "./PlanningTaskBlock.css"

interface PlanningTaskBlockProps {
  placement: TaskPlacement
  /** En cours de glisser-déposer (ou d'enregistrement après le lâcher). */
  dragging: boolean
  onDragStart: (event: PointerEvent, kind: DragKind) => void
  onOpen: () => void
  /** Rejetée en cas d'échec : le message s'affiche dans un toast. */
  onDuplicate: () => Promise<void>
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * Une tâche dans la grille, sur la hauteur de ses jours : un clic l'ouvre,
 * un glisser la déplace, sa poignée du bas l'étend sur d'autres jours, et le
 * bouton copie la duplique.
 */
export function PlanningTaskBlock({
  placement,
  dragging,
  onDragStart,
  onOpen,
  onDuplicate,
  showToast,
}: PlanningTaskBlockProps) {
  const { busy, run } = useInlineAction(showToast)
  const { task } = placement
  const category = categoryLabel(task.category)
  const multiDay = placement.lastDayIndex > placement.firstDayIndex

  // Exception à la règle "pas de CSS inline" (voir AGENTS.md) : seule la
  // place de la tâche dans la grille (ses lignes de jours et sa colonne)
  // passe par style, tout le dessin reste dans le .css. Le cast est
  // nécessaire, CSSProperties ne connaît pas les variables CSS.
  const placementStyle = {
    "--first-row": placement.firstDayIndex + 1,
    "--row-span": placement.lastDayIndex - placement.firstDayIndex + 1,
    // + 2 : la 1re colonne de la grille est celle des dates.
    "--lane-column": placement.lane + 2,
  } as CSSProperties

  const classes = [
    "planning-task",
    `task-category--${task.category}`,
    multiDay && "planning-task--multi-day",
    placement.startsBefore && "planning-task--starts-before",
    placement.endsAfter && "planning-task--ends-after",
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
