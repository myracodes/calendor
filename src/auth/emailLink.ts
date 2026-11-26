// Ce que l'adresse d'ouverture de l'app dit d'un lien reçu par email
// (réinitialisation du mot de passe). Supabase y renvoie avec, dans l'ancre
// (#…), soit la session qu'ouvre le lien et type=recovery, soit une erreur si
// le lien a expiré ou déjà servi (flux "implicit", celui du client par défaut).
//
// Lu une seule fois, au chargement de l'app, plutôt que d'attendre l'événement
// PASSWORD_RECOVERY du SDK : celui-ci arrive après que l'app a déjà pu
// s'afficher, et le SDK efface l'ancre dès qu'il a ouvert la session.

const hashParameters = new URLSearchParams(window.location.hash.slice(1))

/** App ouverte depuis un lien de réinitialisation, pas encore vérifié par Supabase. */
export const openedFromRecoveryLink =
  hashParameters.get("type") === "recovery" &&
  hashParameters.has("access_token")

/** App ouverte depuis un lien d'email expiré ou déjà utilisé. */
export const openedFromInvalidLink = hashParameters.has("error_code")

// Le SDK laisse l'erreur dans l'ancre, où le routeur (HashRouter) la prendrait
// pour l'adresse d'une page inexistante : on l'efface.
if (openedFromInvalidLink) {
  window.history.replaceState(
    window.history.state,
    "",
    window.location.pathname + window.location.search,
  )
}
