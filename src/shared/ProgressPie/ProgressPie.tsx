import type { CSSProperties } from "react"
import "./ProgressPie.css"

interface ProgressPieProps {
  /** Progression en pourcentage, de 0 à 100. */
  percent: number
  /** Ce que mesure le camembert, pour les lecteurs d'écran (ex. "des épisodes vus"). */
  label: string
}

/** Anneau de progression, avec le pourcentage au centre. */
export function ProgressPie({ percent, label }: ProgressPieProps) {
  // Exception à la règle "pas de CSS inline" (voir AGENTS.md) : seule la
  // valeur dynamique passe par style, tout le dessin reste dans le .css.
  // Le cast est nécessaire, CSSProperties ne connaît pas les variables CSS.
  const progressStyle = { "--progress": `${percent}%` } as CSSProperties

  return (
    <span className="progress-pie">
      <span
        className="progress-pie-ring"
        style={progressStyle}
        role="img"
        aria-label={`${percent} % ${label}`}
      />
      <span className="progress-pie-value" aria-hidden="true">
        {/* Espace fine insécable, typographie française. */}
        {percent}{" "}%
      </span>
    </span>
  )
}
