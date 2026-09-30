// Lecture et écriture des séries dans Supabase (table `series`, voir supabase/series.sql).

import { requireSupabase } from "../supabase/client"
import type { EpisodeRef, Season, Series, SeriesDraft } from "./types"

/** Colonnes lues en base ; `seasons` est un jsonb, renvoyé non typé par Supabase. */
const COLUMNS = "id, name, seasons, last_watched_season, last_watched_episode"

type SeriesRow = {
  id: string
  name: string
  seasons: Season[]
  last_watched_season: number | null
  last_watched_episode: number | null
}

/** Code PostgreSQL d'une violation de contrainte unique (ici : nom déjà pris). */
const UNIQUE_VIOLATION = "23505"

function toSeries(row: SeriesRow): Series {
  return {
    id: row.id,
    name: row.name,
    seasons: row.seasons.map(season => ({
      episodeCount: season.episodeCount,
    })),
    // Les deux colonnes sont vides ou remplies ensemble (contrainte en base).
    lastWatched:
      row.last_watched_season === null || row.last_watched_episode === null
        ? null
        : {
            season: row.last_watched_season,
            episode: row.last_watched_episode,
          },
  }
}

function toError(error: { code: string; message: string }): Error {
  if (error.code === UNIQUE_VIOLATION) {
    return new Error("Une série porte déjà ce nom.")
  }
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/** Toutes les séries du compte connecté, triées par nom. */
export async function fetchSeries(): Promise<Series[]> {
  const { data, error } = await requireSupabase()
    .from("series")
    .select(COLUMNS)
    .order("name")
  if (error !== null) throw toError(error)
  return (data as SeriesRow[]).map(toSeries)
}

/** Crée la série si elle est nouvelle (id null), sinon la met à jour. */
export async function saveSeries(draft: SeriesDraft): Promise<Series> {
  const values = { name: draft.name.trim(), seasons: draft.seasons }
  const table = requireSupabase().from("series")
  const { data, error } =
    draft.id === null
      ? await table.insert(values).select(COLUMNS).single()
      : await table.update(values).eq("id", draft.id).select(COLUMNS).single()
  if (error !== null) throw toError(error)
  return toSeries(data as SeriesRow)
}

/** Enregistre le dernier épisode vu de la série (null : pas commencée). */
export async function saveLastWatched(
  id: string,
  lastWatched: EpisodeRef | null,
): Promise<Series> {
  const { data, error } = await requireSupabase()
    .from("series")
    .update({
      last_watched_season: lastWatched?.season ?? null,
      last_watched_episode: lastWatched?.episode ?? null,
    })
    .eq("id", id)
    .select(COLUMNS)
    .single()
  if (error !== null) throw toError(error)
  return toSeries(data as SeriesRow)
}

export async function deleteSeries(id: string): Promise<void> {
  const { error } = await requireSupabase().from("series").delete().eq("id", id)
  if (error !== null) throw toError(error)
}
