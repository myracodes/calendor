import { type SubmitEvent, useState } from "react"
import { requireSupabase } from "../../supabase/client"
import { PasswordInput } from "./components/PasswordInput/PasswordInput"
import "./LoginPage.css"

/**
 * Écran de connexion (email + mot de passe), affiché à la place de l'app tant
 * que personne n'est connecté. Pas d'inscription : les comptes sont créés à la
 * main dans le dashboard Supabase (Authentication → Users).
 */
export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function signIn(e: SubmitEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const { error: signInError } = await requireSupabase().auth.signInWithPassword({ email, password })
      if (signInError) {
        // Message générique : ne pas révéler si l'email existe ou non.
        setError("Connexion impossible : vérifie l'email et le mot de passe.")
      }
      // En cas de succès, AuthProvider reçoit la session et l'app s'affiche.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app login">
      <h1>Calendor</h1>
      <section className="card login-card">
        <h2>Connexion</h2>
        <form className="login-form" onSubmit={signIn}>
          <label>
            Email
            <input type="email" value={email} autoComplete="email" required onChange={e => setEmail(e.target.value)} />
          </label>
          <label>
            Mot de passe
            <PasswordInput value={password} onChange={setPassword} />
          </label>
          {error !== null && <p className="login-error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </section>
    </main>
  )
}
