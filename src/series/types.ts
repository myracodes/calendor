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
  /** Aucune suite prévue : une fois tout vu, la série est terminée et pas seulement à jour. */
  finished: boolean
}

/** Série en cours d'édition ; id null = pas encore enregistrée. */
export type SeriesDraft = Omit<Series, "id"> & { id: string | null }
