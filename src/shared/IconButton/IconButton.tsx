import {
  ActionButton,
  type ActionButtonVariant,
} from "../ActionButton/ActionButton"
import "./IconButton.css"

interface IconButtonProps {
  /** Icône de src/assets/icons/, importée comme URL. */
  icon: string
  /** Ce que fait le bouton : lu par les lecteurs d'écran et affiché en infobulle. */
  label: string
  variant?: ActionButtonVariant
  /** Action en cours : désactive le bouton et affiche un curseur d'attente. */
  busy?: boolean
  onClick: () => void
}

/** Petit bouton carré à icône, posé sur une ligne de liste (crayon d'édition, coche…). */
export function IconButton({
  icon,
  label,
  variant,
  busy,
  onClick,
}: IconButtonProps) {
  return (
    <ActionButton
      size="small"
      variant={variant}
      className="icon-button"
      busy={busy}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {/* alt vide : le bouton porte déjà le libellé (aria-label). */}
      <img src={icon} alt="" />
    </ActionButton>
  )
}
