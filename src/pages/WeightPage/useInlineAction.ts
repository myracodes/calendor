import { useState } from "react"
import type { useToast } from "../../shared/Toast/useToast"

/**
 * Une action d'un formulaire en une ligne (ajout, enregistrement,
 * suppression) : `busy` pendant qu'elle tourne, pour désactiver ses boutons,
 * et son échec affiché en toast, la ligne n'ayant pas la place d'un message.
 * Une action lancée pendant qu'une autre tourne est ignorée.
 */
export function useInlineAction(
  showToast: ReturnType<typeof useToast>["showToast"],
): { busy: boolean; run: (action: () => Promise<void>) => Promise<void> } {
  const [busy, setBusy] = useState(false)

  async function run(action: () => Promise<void>) {
    if (busy) return
    setBusy(true)
    try {
      await action()
    } catch (caught) {
      showToast("error", (caught as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return { busy, run }
}
