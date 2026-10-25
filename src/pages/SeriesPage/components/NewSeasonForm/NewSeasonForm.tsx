import { useState } from "react"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import "./NewSeasonForm.css"

interface NewSeasonFormProps {
  /** Numéro de la saison à ajouter (la suivante de la série). */
  seasonNumber: number
  /** Enregistre la saison ; en cas d'échec (promesse rejetée), le formulaire reste ouvert. */
  onAdd: (episodeCount: number) => Promise<void>
  onCancel: () => void
}

/** Ajout rapide d'une saison depuis la liste, sans ouvrir l'éditeur de la série. */
export function NewSeasonForm({
  seasonNumber,
  onAdd,
  onCancel,
}: NewSeasonFormProps) {
  const [episodeCount, setEpisodeCount] = useState("")
  const [busy, setBusy] = useState(false)
  const count = Number(episodeCount)
  const isValid = Number.isInteger(count) && count >= 1

  async function add() {
    setBusy(true)
    try {
      await onAdd(count)
    } catch {
      // L'erreur est déjà affichée en toast par la liste.
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="new-season-form">
      <label>
        Saison {seasonNumber} — épisodes
        <input
          type="number"
          min={1}
          step={1}
          value={episodeCount}
          autoFocus
          onChange={e => setEpisodeCount(e.target.value)}
        />
      </label>
      <div className="new-season-form-buttons">
        <ActionButton variant="secondary" disabled={busy} onClick={onCancel}>
          Annuler
        </ActionButton>
        <ActionButton busy={busy} disabled={!isValid} onClick={add}>
          Ajouter
        </ActionButton>
      </div>
    </div>
  )
}
