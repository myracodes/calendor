import { useEffect, useState } from "react"
import { deleteSeries, fetchSeries, saveSeries } from "./seriesRepository"
import type { Series, SeriesDraft } from "./types"

function byName(first: Series, second: Series): number {
  return first.name.localeCompare(second.name, "fr")
}

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

  async function save(draft: SeriesDraft): Promise<Series> {
    const saved = await saveSeries(draft)
    setSeries(previous =>
      [...previous.filter(item => item.id !== saved.id), saved].sort(byName),
    )
    return saved
  }

  async function remove(id: string): Promise<void> {
    await deleteSeries(id)
    setSeries(previous => previous.filter(item => item.id !== id))
  }

  return { series, loading, loadError, save, remove }
}
