import type { Series } from "./types"

export interface SeriesLetterGroup {
  letter: string
  series: Series[]
}

/** Lettre d'accordéon d'un nom, sans accent ("Élite" → "E") ; "#" si ça ne commence pas par une lettre. */
function firstLetter(name: string): string {
  const letter = name
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .charAt(0)
    .toUpperCase()
  return /^[A-Z]$/.test(letter) ? letter : "#"
}

/** Les séries triées par ordre alphabétique et regroupées par initiale ("#" en dernier). */
export function groupSeriesByLetter(series: Series[]): SeriesLetterGroup[] {
  const sorted = [...series].sort((a, b) =>
    a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
  )
  const groups: SeriesLetterGroup[] = []
  for (const item of sorted) {
    const letter = firstLetter(item.name)
    const group = groups.find(existing => existing.letter === letter)
    if (group === undefined) groups.push({ letter, series: [item] })
    else group.series.push(item)
  }
  return groups.sort((a, b) => {
    if (a.letter === "#") return 1
    if (b.letter === "#") return -1
    return a.letter.localeCompare(b.letter)
  })
}
