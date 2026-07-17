import { useState } from "react"
import eyeOffIcon from "../../../../assets/icons/eye-off.svg"
import eyeIcon from "../../../../assets/icons/eye.svg"
import "./PasswordInput.css"

/**
 * Champ mot de passe avec un bouton œil pour afficher ou masquer la saisie.
 * Composant contrôlé : la valeur reste gérée par le formulaire parent.
 */
export function PasswordInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [visible, setVisible] = useState(false)
  const toggleLabel = visible ? "Masquer le mot de passe" : "Afficher le mot de passe"

  return (
    <span className="password-input">
      <input
        type={visible ? "text" : "password"}
        value={value}
        autoComplete="current-password"
        required
        onChange={e => onChange(e.target.value)}
      />
      <button
        type="button"
        className="password-input-toggle"
        aria-label={toggleLabel}
        title={toggleLabel}
        onClick={() => setVisible(v => !v)}
      >
        {/* alt vide : le bouton porte déjà le libellé (aria-label). */}
        <img src={visible ? eyeOffIcon : eyeIcon} alt="" />
      </button>
    </span>
  )
}
