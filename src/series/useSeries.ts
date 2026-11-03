import { useEffect, useState } from "react"
import { nextEpisode } from "./progress"
import {
  deleteSeries,
  fetchSeries,
  saveLastWatched,
  saveSeries,
} from "./seriesRepository"
import type { EpisodeRef, Series, SeriesDraft } from "./types"

/**
 * Les séries du compte connecté, chargées au montage, et les actions pour les
 * modifier : la liste locale n'est mise à jour qu'une fois la base d'accord.
 */
export function useSeries() {
  const [series, setSeries] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage (ex. changement d'onglet).
    let cancelled = false
    fetchSeries()
      .then(list => {
        if (!cancelled) setSeries(list)
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // L'ordre d'affichage est refait au regroupement (groupSeriesByStatus).
  function replace(saved: Series) {
    setSeries(previous => [
      ...previous.filter(item => item.id !== saved.id),
      saved,
    ])
  }

  async function save(draft: SeriesDraft): Promise<Series> {
    const saved = await saveSeries(draft)
    replace(saved)
    return saved
  }

  /** Marque comme vu l'épisode qui suit le dernier vu (rien s'il n'y en a pas). */
  async function markNextWatched(item: Series): Promise<void> {
    const next = nextEpisode(item)
    if (next === null) return
    replace(await saveLastWatched(item.id, next))
  }

  /** Corrige le dernier épisode vu (null : la série redevient non commencée). */
  async function setLastWatched(
    item: Series,
    lastWatched: EpisodeRef | null,
  ): Promise<void> {
    replace(await saveLastWatched(item.id, lastWatched))
  }

  async function remove(id: string): Promise<void> {
    await deleteSeries(id)
    setSeries(previous => previous.filter(item => item.id !== id))
  }

  return {
    series,
    loading,
    loadError,
    save,
    remove,
    markNextWatched,
    setLastWatched,
  }
}
