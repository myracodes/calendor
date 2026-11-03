const AUTHORS_FORMAT = new Intl.ListFormat("fr-FR", {
  style: "long",
  type: "conjunction",
})

/** Les autrices en une phrase, ex. "Ursula K. Le Guin et Octavia E. Butler". */
export function formatAuthors(authors: string[]): string {
  return AUTHORS_FORMAT.format(authors)
}
