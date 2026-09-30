import { useState } from "react"
import { describeSeasons, formatEpisode } from "../../../../series/format"
import {
  nextEpisode,
  previousEpisode,
  watchedPercent,
} from "../../../../series/progress"
import { filterSeries } from "../../../../series/search"
import type { EpisodeRef, Series } from "../../../../series/types"
import { useSeries } from "../../../../series/useSeries"
import { Alert } from "../../../../shared/Alert/Alert"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import { Card } from "../../../../shared/Card/Card"
import { ProgressPie } from "../../../../shared/ProgressPie/ProgressPie"
import { EpisodeCorrection } from "../EpisodeCorrection/EpisodeCorrection"
import "./WatchTab.css"

// Onglet d'utilisation : où j'en suis de chaque série, et marquer l'épisode suivant.
export function WatchTab({
  onCreateSeries,
}: {
  onCreateSeries: (name: string) => void
}) {
  const { series, loading, loadError, markNextWatched, setLastWatched } =
    useSeries()
  const [search, setSearch] = useState("")
  // Série dont l'enregistrement est en cours, pour ne désactiver que son bouton.
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const matches = filterSeries(series, search)
  const canCreateFromSearch = search.trim() !== "" && matches.length === 0

  // Enregistre une modification de la progression d'une série, en gardant
  // l'erreur éventuelle à afficher.
  async function save(item: Series, action: () => Promise<void>) {
    setPendingId(item.id)
    setError(null)
    try {
      await action()
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      setPendingId(null)
    }
  }

  const markNext = (item: Series) => save(item, () => markNextWatched(item))
  const correct = (item: Series, lastWatched: EpisodeRef | null) =>
    save(item, () => setLastWatched(item, lastWatched))

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
        <Alert variantColor="danger" title="Modification non enregistrée">
          {error}
        </Alert>
      )}

      {canCreateFromSearch ? (
        <>
          <p className="hint">Aucune série ne correspond à « {search} ».</p>
          <ActionButton onClick={() => onCreateSeries(search.trim())}>
            Créer « {search.trim()} »
          </ActionButton>
        </>
      ) : series.length === 0 ? (
        <p className="hint">
          Aucune série pour l'instant : ajoute-en une dans l'onglet Paramétrage.
        </p>
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
                <div className="watch-item-buttons">
                  <ActionButton
                    variant="secondary"
                    disabled={item.lastWatched === null}
                    busy={pendingId === item.id}
                    onClick={() => correct(item, previousEpisode(item))}
                  >
                    Annuler l'épisode
                  </ActionButton>
                  <ActionButton
                    disabled={next === null}
                    busy={pendingId === item.id}
                    onClick={() => markNext(item)}
                  >
                    {next === null
                      ? "Épisode suivant vu"
                      : `${formatEpisode(next)} vu`}
                  </ActionButton>
                </div>
                <EpisodeCorrection
                  series={item}
                  disabled={pendingId === item.id}
                  onChange={lastWatched => correct(item, lastWatched)}
                />
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
