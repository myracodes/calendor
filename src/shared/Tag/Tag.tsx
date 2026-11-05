import type { ReactNode } from "react"
import "./Tag.css"

/** mint : en cours ; sun : en attente (ex. à jour d'une série) ; neutral : fini, rien à faire. */
export type TagVariantColor = "mint" | "sun" | "neutral"

interface TagProps {
  variantColor: TagVariantColor
  children: ReactNode
}

/** Petite étiquette d'état posée à côté d'un libellé (ex. « En cours » sur un livre). */
export function Tag({ variantColor, children }: TagProps) {
  return <span className={`tag tag--${variantColor}`}>{children}</span>
}
