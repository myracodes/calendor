import {
  ActionButton,
  type ActionButtonVariant,
} from "../ActionButton/ActionButton"
import type { ControlSize } from "../controlSize"
import "./IconButton.css"

export type IconButtonSize = Extract<ControlSize, "small" | "medium">

interface IconButtonProps {
  /** Icône de src/assets/icons/, importée comme URL. */
  icon: string
  /** Ce que fait le bouton : lu par les lecteurs d'écran et affiché en infobulle. */
  label: string
  variant?: ActionButtonVariant
  /** « small » : pour une liste serrée où le bouton ne doit pas espacer les lignes (les idées cadeaux). */
  size?: IconButtonSize
  /** Action en cours : désactive le bouton et affiche un curseur d'attente. */
  busy?: boolean
  /** Action impossible pour l'instant (rien à enregistrer…) : le bouton reste à sa place, grisé. */
  disabled?: boolean
  /**
   * « submit » : bouton d'enregistrement d'un formulaire, qui l'envoie aussi
   * par Entrée. Sans onClick : l'enregistrement passe par le onSubmit du
   * formulaire, qui serait sinon appelé deux fois.
   */
  type?: "button" | "submit"
  onClick?: () => void
}

/** Petit bouton carré à icône, posé sur une ligne de liste (crayon d'édition, coche…). */
export function IconButton({
  icon,
  label,
  variant,
  size = "medium",
  busy,
  disabled,
  type,
  onClick,
}: IconButtonProps) {
  return (
    <ActionButton
      size="medium"
      variant={variant}
      className={`icon-button${size === "small" ? " icon-button--small" : ""}`}
      busy={busy}
      disabled={disabled}
      type={type}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {/* alt vide : le bouton porte déjà le libellé (aria-label). */}
      <img src={icon} alt="" />
    </ActionButton>
  )
}
