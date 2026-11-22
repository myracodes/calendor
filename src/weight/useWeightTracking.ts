import { useEffect, useState } from "react"
import { sortByDay } from "./order"
import type { WeightEntry, WeightEntryDraft } from "./types"
import {
  deleteWeightEntry,
  fetchWeightEntries,
  restoreWeightEntry,
  saveWeightEntry,
} from "./weightEntriesRepository"
import { fetchWeightGoal, saveWeightGoal } from "./weightGoalRepository"

/**
 * Les pesées et l'objectif, chargés au montage, et les actions pour les
 * modifier : l'état local n'est mis à jour qu'une fois la base d'accord.
 */
export function useWeightTracking() {
  /** La plus ancienne en premier. */
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [goalKg, setGoalKg] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage (ex. changement de page).
    let cancelled = false
    Promise.all([fetchWeightEntries(), fetchWeightGoal()])
      .then(([entryList, goal]) => {
        if (cancelled) return
        setEntries(sortByDay(entryList))
        setGoalKg(goal)
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

  function putEntry(saved: WeightEntry) {
    setEntries(previous =>
      sortByDay([...previous.filter(entry => entry.id !== saved.id), saved]),
    )
  }

  async function saveEntry(draft: WeightEntryDraft): Promise<WeightEntry> {
    const saved = await saveWeightEntry(draft)
    putEntry(saved)
    return saved
  }

  async function removeEntry(id: string): Promise<void> {
    await deleteWeightEntry(id)
    setEntries(previous => previous.filter(entry => entry.id !== id))
  }

  /** Remet une pesée supprimée, à sa place sur la courbe. */
  async function restoreEntry(entry: WeightEntry): Promise<void> {
    putEntry(await restoreWeightEntry(entry))
  }

  /** Enregistre l'objectif, ou le retire avec null. */
  async function saveGoal(targetKg: number | null): Promise<void> {
    setGoalKg(await saveWeightGoal(targetKg))
  }

  return {
    entries,
    goalKg,
    loading,
    loadError,
    saveEntry,
    removeEntry,
    restoreEntry,
    saveGoal,
  }
}

/** Les pesées, l'objectif et leurs actions, partagés par les cards de la page. */
export type WeightTracking = ReturnType<typeof useWeightTracking>
