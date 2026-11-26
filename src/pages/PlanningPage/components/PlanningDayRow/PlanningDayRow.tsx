import type { CSSProperties, ReactNode } from "react"
import plusIcon from "../../../../assets/icons/plus.svg"
import { WEEKDAY } from "../../../../constants/weekdays"
import { weekdayOfIso } from "../../../../dates"
import { dayLabelParts, longDay } from "../../../../planning/wording"
import { PlanningHolidayBlock } from "../PlanningHolidayBlock/PlanningHolidayBlock"
import "./PlanningDayRow.css"

interface PlanningDayRowProps {
  /** Le jour, au format ISO « aaaa-mm-jj ». */
  day: string
  /** Sa ligne dans la grille, 0 = la première. */
  index: number
  today: string
  /** Nom du jour férié qui tombe ce jour-là, absent sinon. */
  publicHoliday?: string
  onAdd: () => void
  /** Ses tâches d'un seul jour, dans leur ordre. */
  children: ReactNode
}

/**
 * La ligne d'un jour : sa date à gauche, puis son jour férié s'il en a un et
 * ses tâches d'un seul jour, qui passent à la ligne quand elles ne tiennent plus en largeur. Tout autour
 * d'elles, un clic ouvre l'ajout d'une tâche ce jour-là.
 */
export function PlanningDayRow({
  day,
  index,
  today,
  publicHoliday,
  onAdd,
  children,
}: PlanningDayRowProps) {
  const label = dayLabelParts(day)
  const weekday = weekdayOfIso(day)
  // Le mois sur la première ligne, puis à chaque début de mois.
  const showsMonth = index === 0 || label.day === "1"

  const classes = [
    "planning-day",
    day === today && "planning-day--today",
    weekday >= WEEKDAY.SAMEDI && "planning-day--weekend",
    weekday === WEEKDAY.LUNDI && index > 0 && "planning-day--week-start",
  ]
    .filter(Boolean)
    .join(" ")

  // Exception à la règle "pas de CSS inline" (voir AGENTS.md) : seule la
  // ligne du jour dans la grille passe par style, tout le dessin reste dans
  // le .css. Le cast est nécessaire, CSSProperties ne connaît pas les
  // variables CSS.
  const rowStyle = { "--day-row": index + 1 } as CSSProperties

  return (
    // data-planning-day : dit à useTaskDrag sur quel jour est le pointeur.
    <div className={classes} style={rowStyle} data-planning-day={day}>
      <span className="planning-day-label">
        <span>
          {label.weekday} {label.day}
        </span>
        {showsMonth && <span>{label.month}</span>}
      </span>
      <button
        type="button"
        className="planning-day-add"
        aria-label={`Ajouter une tâche le ${longDay(day)}`}
        title="Ajouter une tâche"
        onClick={onAdd}
      >
        {/* alt vide : le bouton porte déjà le libellé (aria-label). */}
        <img src={plusIcon} alt="" />
      </button>
      <div className="planning-day-tasks">
        {publicHoliday !== undefined && (
          <PlanningHolidayBlock name={publicHoliday} />
        )}
        {children}
      </div>
    </div>
  )
}
