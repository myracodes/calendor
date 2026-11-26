import type { CSSProperties } from "react"
import { monthTitle } from "../../../../planning/wording"
import "./PlanningMonthHeader.css"

interface PlanningMonthHeaderProps {
  /** Premier jour affiché du mois, au format ISO « aaaa-mm-jj ». */
  firstDay: string
  /** Sa ligne dans la grille, 1 = la première (voir gridRows.ts). */
  row: number
}

/** L'intitulé d'un mois (« Décembre 2026 »), sur une ligne entière au-dessus de ses jours. */
export function PlanningMonthHeader({ firstDay, row }: PlanningMonthHeaderProps) {
  // Exception à la règle "pas de CSS inline" (voir AGENTS.md) : seule la
  // ligne de l'intitulé dans la grille passe par style, tout le dessin reste
  // dans le .css. Le cast est nécessaire, CSSProperties ne connaît pas les
  // variables CSS.
  const rowStyle = { "--month-row": row } as CSSProperties

  return (
    <h3 className="planning-month" style={rowStyle}>
      {monthTitle(firstDay)}
    </h3>
  )
}
