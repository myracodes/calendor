import type { Series } from "./types"

/** Texte sans accents ni majuscules, pour une recherche tolérante ("pokemon" trouve "Pokémon"). */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

/** Les séries dont le nom contient la recherche ; toutes si la recherche est vide. */
export function filterSeries(series: Series[], query: string): Series[] {
  const normalizedQuery = normalize(query)
  if (normalizedQuery === "") return series
  return series.filter(item => normalize(item.name).includes(normalizedQuery))
}
