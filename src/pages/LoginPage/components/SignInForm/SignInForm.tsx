import { type SubmitEvent, useState } from "react"
import { useAuth } from "../../../../auth/useAuth"
import { requireSupabase } from "../../../../supabase/client"
import { PasswordInput } from "../PasswordInput/PasswordInput"
import "./SignInForm.css"

const INVALID_LINK_ERROR =
  "Ce lien a expiré ou a déjà servi : demande-en un nouveau avec « Mot de passe oublié ? »."

/** Action en cours : désactive les deux boutons, et change le libellé de celui qui a été cliqué. */
type PendingAction = "signIn" | "resetLink"

/**
 * Connexion (email + mot de passe), et envoi d'un lien de réinitialisation à
 * l'email saisi. Pas d'inscription : les comptes sont créés à la main dans le
 * dashboard Supabase (docs/ADD_USER.md).
 */
export function SignInForm() {
  const { invalidEmailLink } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(
    invalidEmailLink ? INVALID_LINK_ERROR : null,
  )
  const [notice, setNotice] = useState<string | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)

  async function signIn(e: SubmitEvent) {
    e.preventDefault()
    setPending("signIn")
    setError(null)
    setNotice(null)
    try {
      const { error: signInError } =
        await requireSupabase().auth.signInWithPassword({ email, password })
      if (signInError) {
        // Message générique : ne pas révéler si l'email existe ou non.
        setError("Connexion impossible : vérifie l'email et le mot de passe.")
      }
      // En cas de succès, AuthProvider reçoit la session et l'app s'affiche.
    } finally {
      setPending(null)
    }
  }

  async function sendResetLink() {
    setError(null)
    setNotice(null)
    if (email.trim() === "") {
      setError(
        "Renseigne d'abord ton email, puis clique à nouveau sur « Mot de passe oublié ? ».",
      )
      return
    }
    setPending("resetLink")
    try {
      const { error: resetError } =
        await requireSupabase().auth.resetPasswordForEmail(email, {
          // Le lien de l'email ramène sur l'app qui l'a demandé (en local ou en
          // ligne) si cette adresse est autorisée dans Supabase, sinon sur
          // l'adresse du site (docs/ADD_USER.md).
          redirectTo: new URL(import.meta.env.BASE_URL, window.location.origin)
            .href,
        })
      if (resetError) {
        setError(resetLinkErrorMessage(resetError.code))
        return
      }
      // Même message qu'un compte existe ou non pour cet email : ne pas
      // révéler lesquels existent.
      setNotice(
        "Si un compte existe pour cet email, un lien pour choisir un nouveau mot de passe vient d'y être envoyé.",
      )
    } finally {
      setPending(null)
    }
  }

  return (
    <>
      <h2>Connexion</h2>
      <form className="login-form" onSubmit={signIn}>
        <label>
          Email
          <input
            type="email"
            value={email}
            autoComplete="email"
            required
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label>
          Mot de passe
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
        </label>
        {error !== null && <p className="login-error">{error}</p>}
        {notice !== null && <p className="login-notice">{notice}</p>}
        <button type="submit" disabled={pending !== null}>
          {pending === "signIn" ? "Connexion…" : "Se connecter"}
        </button>
        <button
          type="button"
          className="btn-link sign-in-forgot-password"
          disabled={pending !== null}
          onClick={sendResetLink}
        >
          {pending === "resetLink" ? "Envoi du lien…" : "Mot de passe oublié ?"}
        </button>
      </form>
    </>
  )
}

/** Message d'échec de l'envoi du lien, sans dire si l'email a un compte. */
function resetLinkErrorMessage(code: string | undefined): string {
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit"
  ) {
    return "Trop d'emails demandés récemment : réessaie un peu plus tard."
  }
  return "L'email n'a pas pu être envoyé : vérifie l'adresse, ou réessaie plus tard."
}
