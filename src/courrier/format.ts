// Formatage de la ligne "lieu et date" d'un courrier.

// timeZone UTC : la date ISO saisie est interprétée telle quelle,
// sans décalage lié au fuseau de la machine.
const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

/**
 * Compose la ligne d'en-tête du courrier : "Paris, le 2 juillet 2023".
 * Chaque partie est optionnelle : "Le 2 juillet 2023" sans lieu,
 * "Paris" sans date, chaîne vide si rien n'est renseigné.
 * @param dateIso date au format "aaaa-mm-jj", ou "" si absente
 */
export function formatLieuDate(lieu: string, dateIso: string): string {
  const lieuNet = lieu.trim()
  const dateTexte = dateIso === "" ? "" : DATE_FORMAT.format(new Date(`${dateIso}T00:00:00Z`))
  if (lieuNet === "") {
    return dateTexte === "" ? "" : `Le ${dateTexte}`
  }
  return dateTexte === "" ? lieuNet : `${lieuNet}, le ${dateTexte}`
}
