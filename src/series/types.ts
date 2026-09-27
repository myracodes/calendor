/** Une saison ; son numéro est sa position dans Series.seasons (1re = saison 1). */
export interface Season {
  episodeCount: number
}

/** Un épisode repéré par sa saison et son rang dans la saison (tous deux à partir de 1). */
export interface EpisodeRef {
  season: number
  episode: number
}

export interface Series {
  id: string
  name: string
  seasons: Season[]
  /** Dernier épisode vu, null si la série n'est pas commencée. */
  lastWatched: EpisodeRef | null
}

/** Série en cours d'édition dans le paramétrage ; id null = pas encore enregistrée. */
export interface SeriesDraft {
  id: string | null
  name: string
  seasons: Season[]
}
