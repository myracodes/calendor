import type { ReactNode } from "react"
import "./Accordion.css"

interface AccordionProps {
  title: string
  /** Ouvert au premier affichage ; ensuite l'utilisateur garde la main. */
  defaultOpen?: boolean
  children: ReactNode
}

/** Section repliable, basée sur les éléments natifs details/summary. */
export function Accordion({ title, defaultOpen, children }: AccordionProps) {
  return (
    <details className="accordion" open={defaultOpen}>
      <summary className="accordion-title">{title}</summary>
      <div className="accordion-content">{children}</div>
    </details>
  )
}
