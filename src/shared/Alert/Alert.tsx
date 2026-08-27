import type { ReactNode } from "react"
import "./Alert.css"

export type AlertVariantColor = "danger"

interface AlertProps {
  variantColor: AlertVariantColor
  title: string
  children: ReactNode
}

export function Alert({ variantColor, title, children }: AlertProps) {
  return (
    <div className={`alert alert--${variantColor}`}>
      <p className="alert-title">{title}</p>
      <p className="alert-text">{children}</p>
    </div>
  )
}
