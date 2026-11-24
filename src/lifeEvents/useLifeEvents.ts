import { useEffect, useState } from "react"
import { isSupabaseConfigured } from "../supabase/client"
import {
  deleteLifeEvent,
  fetchLifeEvents,
  restoreLifeEvent,
  saveLifeEvent,
} from "./lifeEventsRepository"
import { sortByDate } from "./order"
import type { LifeEventDraft, LifeEventEntry } from "./types"

/**
 * Les anniversaires et décès du compte connecté, dans l'ordre de l'année,
 * chargés au montage, et les actions pour les modifier : la liste locale n'est
 * mise à jour qu'une fois la base d'accord.
 *
 * Sans Supabase (dev sans .env.local), la liste reste vide : les pages qui
 * s'en servent (calendriers, accueil) fonctionnent alors sans.
 */
export function useLifeEvents() {
  const [entries, setEntries] = useState<LifeEventEntry[]>([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    // Ignore une réponse arrivée après le démontage (ex. changement de page).
    let cancelled = false
    fetchLifeEvents()
      .then(list => {
        if (!cancelled) setEntries(sortByDate(list))
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

  function put(saved: LifeEventEntry) {
    setEntries(previous =>
      sortByDate([...previous.filter(entry => entry.id !== saved.id), saved]),
    )
  }

  async function save(draft: LifeEventDraft): Promise<LifeEventEntry> {
    const saved = await saveLifeEvent(draft)
    put(saved)
    return saved
  }

  async function remove(id: string): Promise<void> {
    await deleteLifeEvent(id)
    setEntries(previous => previous.filter(entry => entry.id !== id))
  }

  /** Remet une entrée supprimée, à sa place dans l'année. */
  async function restore(entry: LifeEventEntry): Promise<void> {
    put(await restoreLifeEvent(entry))
  }

  return { entries, loading, loadError, save, remove, restore }
}

export type LifeEventsLibrary = ReturnType<typeof useLifeEvents>
