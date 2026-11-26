// Durée de vie maximale d'une session, comptée depuis la connexion (et non
// depuis la dernière visite). Sans elle, le SDK renouvelle le jeton toutes les
// heures et un appareil reste connecté indéfiniment. Le réglage Supabase
// équivalent (Auth → Sessions) n'existe que sur le plan payant : la limite est
// donc posée ici, pour déconnecter proprement, et dans la base
// (supabase/session_max_age.sql), qui refuse les données au-delà — c'est cette
// dernière qui protège vraiment, l'app ne fait que suivre.

import type { Session } from "@supabase/supabase-js"

// Doit rester égal à l'intervalle de public.session_is_fresh()
// (supabase/session_max_age.sql) : sinon l'app reste ouverte sur des pages
// vides (base plus stricte) ou déconnecte trop tôt (app plus stricte).
export const SESSION_MAX_AGE_DAYS = 14

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

/** Une entrée du champ "amr" du jeton : méthode de connexion et son instant (secondes Unix). */
interface AuthenticationMethodEntry {
  method: string
  timestamp: number
}

function isAuthenticationMethodEntry(
  value: unknown,
): value is AuthenticationMethodEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as AuthenticationMethodEntry).timestamp === "number"
  )
}

/** Lit la partie "données" (payload) du jeton, encodée en base64url. Pas de vérification de signature : la base s'en charge. */
function decodeAccessTokenPayload(accessToken: string): unknown {
  const encodedPayload = accessToken.split(".")[1]
  if (encodedPayload === undefined) return null
  const binary = atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/"))
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

/**
 * Instant (en ms) où la session atteint sa durée maximale, ou null si le jeton
 * ne dit pas quand a eu lieu la connexion.
 *
 * L'instant de connexion vient du champ "amr" du jeton, qui ne change pas
 * quand le jeton est renouvelé. S'il y a plusieurs entrées (mot de passe puis
 * second facteur…), la plus ancienne fait foi.
 */
export function sessionExpiresAt(session: Session): number | null {
  try {
    const payload = decodeAccessTokenPayload(session.access_token) as {
      amr?: unknown
    } | null
    if (!Array.isArray(payload?.amr)) return null
    const signInTimestamps = payload.amr
      .filter(isAuthenticationMethodEntry)
      .map(entry => entry.timestamp)
    if (signInTimestamps.length === 0) return null
    const signedInAt = Math.min(...signInTimestamps) * 1000
    return signedInAt + SESSION_MAX_AGE_DAYS * MILLISECONDS_PER_DAY
  } catch {
    // Jeton illisible : on laisse la base trancher plutôt que de déconnecter.
    return null
  }
}
