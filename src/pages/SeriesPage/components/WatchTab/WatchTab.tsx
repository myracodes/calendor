import { useState } from "react"
import { describeSeasons, formatEpisode } from "../../../../series/format"
import { nextEpisode, watchedPercent } from "../../../../series/progress"
import { filterSeries } from "../../../../series/search"
import type { Series } from "../../../../series/types"
import { useSeries } from "../../../../series/useSeries"
import { Alert } from "../../../../shared/Alert/Alert"
import { Card } from "../../../../shared/Card/Card"
import { ProgressPie } from "../../../../shared/ProgressPie/ProgressPie"
import "./WatchTab.css"

// Onglet d'utilisation : où j'en suis de chaque série, et marquer l'épisode suivant.
export function WatchTab() {
  const { series, loading, loadError, markNextWatched } = useSeries()
  const [search, setSearch] = useState("")
  // Série dont l'enregistrement est en cours, pour ne désactiver que son bouton.
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const matches = filterSeries(series, search)

  async function markNext(item: Series) {
    setPendingId(item.id)
    setError(null)
    try {
      await markNextWatched(item)
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      setPendingId(null)
    }
  }

  if (loading) return <p className="hint">Chargement des séries…</p>
  if (loadError !== null) {
    return (
      <Alert variantColor="danger" title="Impossible de charger les séries">
        {loadError}
      </Alert>
    )
  }

  return (
    <Card variantColor="sky">
      <h2>Mes séries</h2>

      <label>
        Rechercher une série
        <input
          type="search"
          value={search}
          placeholder="Solo Leveling…"
          onChange={e => setSearch(e.target.value)}
        />
      </label>

      {error !== null && (
        <Alert variantColor="danger" title="Épisode non enregistré">
          {error}
        </Alert>
      )}

      {series.length === 0 ? (
        <p className="hint">
          Aucune série pour l'instant : ajoute-en une dans l'onglet Paramétrage.
        </p>
      ) : matches.length === 0 ? (
        <p className="hint">Aucune série ne correspond à « {search} ».</p>
      ) : (
        <ul className="watch-list">
          {matches.map(item => {
            const next = nextEpisode(item)
            return (
              <li key={item.id} className="watch-item">
                <ProgressPie
                  percent={watchedPercent(item)}
                  label="des épisodes vus"
                />
                <div className="watch-item-info">
                  <p className="watch-item-name">{item.name}</p>
                  <p className="watch-item-detail">
                    {describeSeasons(item.seasons)}
                  </p>
                  <p className="watch-item-detail">
                    {item.lastWatched === null
                      ? "Pas encore commencée"
                      : `Dernier vu : ${formatEpisode(item.lastWatched)}`}
                    {item.lastWatched !== null && next === null && " — à jour"}
                  </p>
                </div>
                <button
                  type="button"
                  className="watch-item-button"
                  disabled={next === null || pendingId === item.id}
                  onClick={() => markNext(item)}
                >
                  {next === null
                    ? "Marquer l'épisode suivant comme vu"
                    : `Marquer ${formatEpisode(next)} comme vu`}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
