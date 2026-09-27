import { countEpisodes } from "./progress"
import type { EpisodeRef, Season } from "./types"

function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count > 1 ? pluralForm : singular}`
}

/** Résumé des saisons d'une série, ex. "2 saisons · 37 épisodes". */
export function describeSeasons(seasons: Season[]): string {
  const episodeTotal = countEpisodes(seasons)
  return `${plural(seasons.length, "saison", "saisons")} · ${plural(episodeTotal, "épisode", "épisodes")}`
}

/** Épisode en abrégé, ex. "S1E5" (S = saison, E = épisode). */
export function formatEpisode(episode: EpisodeRef): string {
  return `S${episode.season}E${episode.episode}`
}
