import type { ButtonHTMLAttributes } from "react"
import "./ActionButton.css"

export type ActionButtonVariant = "primary" | "secondary"

/** « small » : pour les boutons posés sur chaque ligne d'une liste, où la grande taille étire les lignes. */
export type ActionButtonSize = "default" | "small"

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant
  size?: ActionButtonSize
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
  size = "default",
  busy = false,
  className,
  disabled,
  type = "button",
  ...buttonProps
}: ActionButtonProps) {
  const classes = [
    "action-button",
    variant === "secondary" && "action-button--secondary",
    size === "small" && "action-button--small",
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
