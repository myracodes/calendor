import { type SubmitEvent, useState } from "react"
import { useAuth } from "../../../../auth/useAuth"
import { requireSupabase } from "../../../../supabase/client"
import { PasswordInput } from "../PasswordInput/PasswordInput"

/**
 * Choix du nouveau mot de passe, après un clic sur le lien de réinitialisation
 * reçu par email. Ce lien a déjà ouvert une session : il ne reste qu'à
 * enregistrer le mot de passe pour entrer dans l'app.
 */
export function NewPasswordForm({ accountEmail }: { accountEmail: string }) {
  const { finishPasswordRecovery } = useAuth()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function savePassword(e: SubmitEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const { error: updateError } = await requireSupabase().auth.updateUser({
        password,
      })
      if (updateError) {
        setError(newPasswordErrorMessage(updateError.code))
        return
      }
      finishPasswordRecovery()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <h2>Nouveau mot de passe</h2>
      <form className="login-form" onSubmit={savePassword}>
        {/* Lecture seule : rappelle le compte concerné, et permet au
            gestionnaire de mots de passe d'y associer le nouveau. */}
        <label>
          Compte
          <input
            type="email"
            value={accountEmail}
            autoComplete="username"
            readOnly
          />
        </label>
        <label>
          Mot de passe
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
        </label>
        {error !== null && <p className="login-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </>
  )
}

function newPasswordErrorMessage(code: string | undefined): string {
  switch (code) {
    case "same_password":
      return "C'est déjà le mot de passe actuel : choisis-en un autre."
    case "weak_password":
      return "Mot de passe trop faible : choisis-en un plus long."
    default:
      return "Le mot de passe n'a pas pu être enregistré : réessaie."
  }
}
