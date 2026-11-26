import { useAuth } from "../../auth/useAuth"
import { Card } from "../../shared/Card/Card"
import { NewPasswordForm } from "./components/NewPasswordForm/NewPasswordForm"
import { SignInForm } from "./components/SignInForm/SignInForm"
import "./LoginPage.css"

/**
 * Écran d'accès, affiché à la place de l'app : la connexion tant que personne
 * n'est connecté, ou le choix du nouveau mot de passe quand la session vient
 * d'être ouverte par un lien de réinitialisation reçu par email.
 */
export function LoginPage() {
  const { session, passwordRecovery } = useAuth()

  return (
    <main className="app login">
      <h1>Calendor</h1>
      <Card className="login-card">
        {passwordRecovery && session !== null ? (
          <NewPasswordForm accountEmail={session.user.email ?? ""} />
        ) : (
          <SignInForm />
        )}
      </Card>
    </main>
  )
}
