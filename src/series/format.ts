import type { Season } from "./types"

function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count > 1 ? pluralForm : singular}`
}

/** Résumé des saisons d'une série, ex. "2 saisons · 37 épisodes". */
export function describeSeasons(seasons: Season[]): string {
  const episodeTotal = seasons.reduce(
    (total, season) => total + season.episodeCount,
    0,
  )
  return `${plural(seasons.length, "saison", "saisons")} · ${plural(episodeTotal, "épisode", "épisodes")}`
}
