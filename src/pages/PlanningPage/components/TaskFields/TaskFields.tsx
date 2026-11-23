import { useId } from "react"
import { TASK_CATEGORIES } from "../../../../planning/categories"
import type { PlanningTaskDraft } from "../../../../planning/types"
import "../../taskCategories.css"
import "./TaskFields.css"

interface TaskFieldsProps {
  draft: PlanningTaskDraft
  onChange: (draft: PlanningTaskDraft) => void
}

/** Les champs d'une tâche : son titre, sa catégorie, puis ses premier et dernier jours. */
export function TaskFields({ draft, onChange }: TaskFieldsProps) {
  // Nom du groupe de boutons radio, propre à chaque fenêtre ouverte.
  const categoryName = useId()

  function changeStart(startDate: string) {
    // Un premier jour après le dernier repousse le dernier : la tâche garde
    // au moins un jour.
    const endDate =
      startDate !== "" && startDate > draft.endDate ? startDate : draft.endDate
    onChange({ ...draft, startDate, endDate })
  }

  return (
    <>
      <label className="task-fields-full-line">
        Tâche
        <input
          type="text"
          value={draft.title}
          placeholder="Ex. : Rendez-vous chez le médecin"
          onChange={e => onChange({ ...draft, title: e.target.value })}
        />
      </label>
      <fieldset className="task-fields-full-line task-fields-categories">
        <legend>Catégorie</legend>
        {TASK_CATEGORIES.map(category => (
          <label key={category.id} className="checkbox-option">
            <input
              type="radio"
              name={categoryName}
              value={category.id}
              checked={draft.category === category.id}
              onChange={() => onChange({ ...draft, category: category.id })}
            />
            <span
              className={`task-fields-swatch task-category--${category.id}`}
              aria-hidden="true"
            />
            {category.label}
          </label>
        ))}
      </fieldset>
      <label>
        Du
        <input
          type="date"
          value={draft.startDate}
          required
          onChange={e => changeStart(e.target.value)}
        />
      </label>
      <label>
        Au
        <input
          type="date"
          value={draft.endDate}
          min={draft.startDate}
          required
          onChange={e => onChange({ ...draft, endDate: e.target.value })}
        />
      </label>
    </>
  )
}
