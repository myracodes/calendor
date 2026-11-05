import type { ReactNode } from "react"
import "./Tag.css"

interface TagProps {
  children: ReactNode
}

/** Petite étiquette d'état posée à côté d'un libellé (ex. « En cours » sur un livre). */
export function Tag({ children }: TagProps) {
  return <span className="tag">{children}</span>
}
