import { useState } from "react"
import type { SeriesDraft } from "../../../../series/types"
import { validateDraft } from "../../../../series/validation"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import { LastWatchedField } from "../LastWatchedField/LastWatchedField"
import "./SeriesEditor.css"

interface SeriesEditorProps {
  draft: SeriesDraft
  onChange: (draft: SeriesDraft) => void
  onSave: () => Promise<void>
  onDelete: () => Promise<void>
  /** Ferme l'éditeur sans enregistrer. */
  onCancel: () => void
}

/**
 * Formulaire d'une série, ouvert dans la liste : nom, nombre d'épisodes de
 * chaque saison, dernier épisode vu et fin de la série.
 */
export function SeriesEditor({
  draft,
  onChange,
  onSave,
  onDelete,
  onCancel,
}: SeriesEditorProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const validationError = validateDraft(draft)
  const isNew = draft.id === null
  const lastSeasonIndex = draft.seasons.length - 1

  function setEpisodeCount(seasonIndex: number, value: string) {
    // Champ vidé = 0, refusé par validateDraft tant qu'il n'est pas rempli.
    const episodeCount = value === "" ? 0 : Number(value)
    onChange({
      ...draft,
      seasons: draft.seasons.map((season, i) =>
        i === seasonIndex ? { episodeCount } : season,
      ),
    })
  }

  function addSeason() {
    onChange({ ...draft, seasons: [...draft.seasons, { episodeCount: 0 }] })
  }

  // Seule la dernière saison se retire : retirer une saison du milieu
  // décalerait les numéros de toutes les suivantes.
  function removeLastSeason() {
    onChange({ ...draft, seasons: draft.seasons.slice(0, -1) })
  }

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError(null)
    try {
      await action()
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      setBusy(false)
    }
  }

  function confirmDelete() {
    if (!window.confirm(`Supprimer la série « ${draft.name} » ?`)) return
    run(onDelete)
  }

  return (
    <div className="series-editor">
      <button
        type="button"
        className="btn-close series-editor-close"
        disabled={busy}
        onClick={onCancel}
        aria-label="Fermer sans enregistrer"
        title="Fermer sans enregistrer"
      >
        ×
      </button>

      <div className="series-editor-columns">
        <div className="series-editor-column">
          <label>
            {isNew ? "Nom de la nouvelle série" : "Nom"}
            <input
              type="text"
              value={draft.name}
              onChange={e => onChange({ ...draft, name: e.target.value })}
            />
          </label>

          {draft.seasons.length > 0 && (
            <ol className="series-editor-seasons">
              {draft.seasons.map((season, i) => (
                // Index en clé : les saisons ne s'ajoutent et ne se retirent qu'en fin de liste.
                <li key={i} className="row">
                  <label>
                    Saison {i + 1} — épisodes
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={
                        season.episodeCount === 0 ? "" : season.episodeCount
                      }
                      onChange={e => setEpisodeCount(i, e.target.value)}
                    />
                  </label>
                  {i === lastSeasonIndex && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={removeLastSeason}
                    >
                      Supprimer
                    </button>
                  )}
                </li>
              ))}
            </ol>
          )}

          <div>
            <button type="button" onClick={addSeason}>
              Ajouter une saison
            </button>
          </div>
        </div>

        <div className="series-editor-column">
          <LastWatchedField
            seasons={draft.seasons}
            lastWatched={draft.lastWatched}
            onChange={lastWatched => onChange({ ...draft, lastWatched })}
          />

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={draft.finished}
              onChange={e => onChange({ ...draft, finished: e.target.checked })}
            />
            Série terminée (aucune suite prévue)
          </label>
        </div>
      </div>

      {validationError !== null && <p className="hint">{validationError}</p>}
      {error !== null && <p className="series-editor-error">{error}</p>}

      <div>
        {!isNew && (
          <ActionButton
            variant="secondary"
            disabled={busy}
            onClick={confirmDelete}
          >
            Supprimer la série
          </ActionButton>
        )}
        <ActionButton
          busy={busy}
          disabled={validationError !== null}
          onClick={() => run(onSave)}
        >
          {busy ? "Enregistrement…" : "Enregistrer"}
        </ActionButton>
      </div>
    </div>
  )
}
