import type { ReactNode } from "react"
import "./Accordion.css"

/** « regular » : chaque section est un élément de la liste (une personne…) plutôt qu'un groupe. */
export type AccordionTitleWeight = "bold" | "regular"

interface AccordionProps {
  title: string
  titleWeight?: AccordionTitleWeight
  /** Ouvert au premier affichage ; ensuite l'utilisateur garde la main. */
  defaultOpen?: boolean
  /** Un IconButton (crayon…) posé à droite du titre, pour agir sur la section elle-même. */
  action?: ReactNode
  children: ReactNode
}

/** Section repliable, basée sur les éléments natifs details/summary. */
export function Accordion({
  title,
  titleWeight = "bold",
  defaultOpen,
  action,
  children,
}: AccordionProps) {
  const details = (
    <details className="accordion" open={defaultOpen}>
      <summary
        className={`accordion-title${titleWeight === "regular" ? " accordion-title--regular" : ""}`}
      >
        {title}
      </summary>
      <div className="accordion-content">{children}</div>
    </details>
  )
  if (action === undefined) return details

  // Le bouton reste hors du <summary> : un clic dessus ouvrirait ou fermerait
  // aussi la section.
  return (
    <div className="accordion-with-action">
      {details}
      <div className="accordion-action">{action}</div>
    </div>
  )
}
