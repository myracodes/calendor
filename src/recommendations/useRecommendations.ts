import { useEffect, useState } from "react"
import {
  deleteRecommendation,
  fetchRecommendations,
  restoreRecommendation,
  saveRecommendation,
} from "./recommendationsRepository"
import type { Recommendation, RecommendationDraft } from "./types"

/** La plus récente en premier, comme à la lecture en base. */
function newestFirst(list: Recommendation[]): Recommendation[] {
  return [...list].sort((first, second) =>
    second.createdAt.localeCompare(first.createdAt),
  )
}

/**
 * Les recos du compte connecté, toutes catégories confondues, chargées au
 * montage, et les actions pour les modifier : l'état local n'est mis à jour
 * qu'une fois la base d'accord.
 */
export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage (ex. changement de page).
    let cancelled = false
    fetchRecommendations()
      .then(list => {
        if (!cancelled) setRecommendations(list)
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

  function replace(saved: Recommendation) {
    setRecommendations(previous =>
      newestFirst([...previous.filter(item => item.id !== saved.id), saved]),
    )
  }

  async function save(draft: RecommendationDraft): Promise<Recommendation> {
    const saved = await saveRecommendation(draft)
    replace(saved)
    return saved
  }

  /** Remet une reco supprimée, à sa place dans la liste. */
  async function restore(item: Recommendation): Promise<void> {
    replace(await restoreRecommendation(item))
  }

  async function remove(id: string): Promise<void> {
    await deleteRecommendation(id)
    setRecommendations(previous => previous.filter(item => item.id !== id))
  }

  return { recommendations, loading, loadError, save, remove, restore }
}

export type RecommendationLibrary = ReturnType<typeof useRecommendations>
