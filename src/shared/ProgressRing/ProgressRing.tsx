import type { CSSProperties } from "react"
import "./ProgressRing.css"

interface ProgressRingProps {
  /** Progression en pourcentage, de 0 à 100. */
  percent: number
  /** Ce que mesure l'anneau, pour les lecteurs d'écran (ex. "des épisodes vus"). */
  label: string
}

/** Anneau de progression, avec le pourcentage au centre. */
export function ProgressRing({ percent, label }: ProgressRingProps) {
  // Exception à la règle "pas de CSS inline" (voir AGENTS.md) : seule la
  // valeur dynamique passe par style, tout le dessin reste dans le .css.
  // Le cast est nécessaire, CSSProperties ne connaît pas les variables CSS.
  const progressStyle = { "--progress": `${percent}%` } as CSSProperties

  return (
    <span className="progress-ring">
      <span
        className="progress-ring-arc"
        style={progressStyle}
        role="img"
        aria-label={`${percent} % ${label}`}
      />
      <span className="progress-ring-value" aria-hidden="true">
        {/* Espace fine insécable, typographie française. */}
        {percent}{" "}%
      </span>
    </span>
  )
}
