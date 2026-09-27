/** Une saison ; son numéro est sa position dans Series.seasons (1re = saison 1). */
export interface Season {
  episodeCount: number
}

export interface Series {
  id: string
  name: string
  seasons: Season[]
}

/** Série en cours d'édition dans le paramétrage ; id null = pas encore enregistrée. */
export interface SeriesDraft {
  id: string | null
  name: string
  seasons: Season[]
}
