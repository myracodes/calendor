import type { EpisodeRef, Season, Series } from "./types"

/**
 * L'épisode qui suit le dernier vu : le suivant dans la saison, sinon le 1er de
 * la saison suivante. null quand il n'y en a plus (série à jour), y compris si
 * le dernier vu dépasse les saisons paramétrées (saison retirée ou raccourcie).
 */
export function nextEpisode(series: Series): EpisodeRef | null {
  const { seasons, lastWatched } = series
  if (lastWatched === null) {
    return seasons.length > 0 ? { season: 1, episode: 1 } : null
  }
  const currentSeason = seasons[lastWatched.season - 1]
  if (currentSeason === undefined) return null
  if (lastWatched.episode < currentSeason.episodeCount) {
    return { season: lastWatched.season, episode: lastWatched.episode + 1 }
  }
  if (lastWatched.season < seasons.length) {
    return { season: lastWatched.season + 1, episode: 1 }
  }
  return null
}

/** Nombre total d'épisodes, toutes saisons confondues. */
export function countEpisodes(seasons: Season[]): number {
  return seasons.reduce((total, season) => total + season.episodeCount, 0)
}

/**
 * Nombre d'épisodes vus : ceux des saisons précédant le dernier vu, plus son
 * rang dans sa saison. Plafonné au total si les saisons ont été raccourcies
 * depuis.
 */
export function countWatchedEpisodes(series: Series): number {
  const { seasons, lastWatched } = series
  if (lastWatched === null) return 0
  const previousSeasons = seasons.slice(0, lastWatched.season - 1)
  return Math.min(
    countEpisodes(previousSeasons) + lastWatched.episode,
    countEpisodes(seasons),
  )
}

/**
 * Part des épisodes vus, en pourcentage arrondi à l'inférieur : 100 seulement
 * quand tout est vu (299 sur 300 donne 99). 0 pour une série sans épisode.
 */
export function watchedPercent(series: Series): number {
  const total = countEpisodes(series.seasons)
  if (total === 0) return 0
  return Math.floor((countWatchedEpisodes(series) / total) * 100)
}
