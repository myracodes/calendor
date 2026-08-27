import type { ReactNode } from "react"
import "./Card.css"

export type CardVariantColor = "sun" | "candy" | "sky"

interface CardProps {
  variantColor?: CardVariantColor
  className?: string
  children: ReactNode
}

export function Card({ variantColor, className, children }: CardProps) {
  const classes = ["card", variantColor && `card--${variantColor}`, className]
    .filter(Boolean)
    .join(" ")
  return <section className={classes}>{children}</section>
}
