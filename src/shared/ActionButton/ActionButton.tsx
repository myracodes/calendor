import type { ButtonHTMLAttributes } from "react"
import "./ActionButton.css"

export type ActionButtonVariant = "primary" | "secondary"

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant
  /** Action en cours : désactive le bouton et affiche un curseur d'attente. */
  busy?: boolean
}

/**
 * Grand bouton pleine largeur pour l'action principale d'une page (générer le
 * PDF, enregistrer…) ; la variante secondaire sert aux actions d'à côté
 * (réinitialiser…).
 */
export function ActionButton({
  variant = "primary",
  busy = false,
  className,
  disabled,
  type = "button",
  ...buttonProps
}: ActionButtonProps) {
  const classes = [
    "action-button",
    variant === "secondary" && "action-button--secondary",
    className,
  ]
    .filter(Boolean)
    .join(" ")
  return (
    <button
      {...buttonProps}
      type={type}
      className={classes}
      disabled={disabled || busy}
      aria-busy={busy}
    />
  )
}
