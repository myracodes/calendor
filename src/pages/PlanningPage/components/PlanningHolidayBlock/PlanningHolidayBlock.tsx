import "../../taskCategories.css"
import "../PlanningTaskBlock/PlanningTaskBlock.css"
import "./PlanningHolidayBlock.css"

interface PlanningHolidayBlockProps {
  /** « Noël », « Lundi de Pâques »… */
  name: string
}

/**
 * Un jour férié, en tête de la ligne de son jour : il a l'allure d'une tâche
 * off, mais il est calculé (pas en base), donc ni modifiable ni déplaçable.
 */
export function PlanningHolidayBlock({ name }: PlanningHolidayBlockProps) {
  return (
    <div className="planning-task planning-holiday task-category--off">
      <span className="planning-task-title" title={name}>
        {name}
      </span>
    </div>
  )
}
