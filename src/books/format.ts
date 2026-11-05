const LIST_FORMAT = new Intl.ListFormat("fr-FR", {
  style: "long",
  type: "conjunction",
})

/** Les autrices en une phrase, ex. "Ursula K. Le Guin et Octavia E. Butler". */
export function formatAuthors(authors: string[]): string {
  return LIST_FORMAT.format(authors)
}

/** Des numéros de tomes, suites regroupées : "Tome 3", "Tomes 3 à 5 et 8". */
export function formatVolumes(volumes: number[]): string {
  const sorted = [...volumes].sort((first, second) => first - second)
  const ranges: string[] = []
  let start = 0
  for (let i = 1; i <= sorted.length; i++) {
    // Fin d'une suite : dernier tome, ou trou avant le suivant.
    if (i === sorted.length || sorted[i] !== sorted[i - 1] + 1) {
      ranges.push(
        i - 1 === start
          ? `${sorted[start]}`
          : `${sorted[start]} à ${sorted[i - 1]}`,
      )
      start = i
    }
  }
  return `${sorted.length > 1 ? "Tomes" : "Tome"} ${LIST_FORMAT.format(ranges)}`
}

/** Un nombre et son nom accordé, ex. "1 livre", "3 livres". */
export function plural(
  count: number,
  singular: string,
  pluralForm: string,
): string {
  return `${count} ${count > 1 ? pluralForm : singular}`
}
