import { useState } from "react"
import pencilIcon from "../../../../assets/icons/pencil.svg"
import { describeSeasons, formatEpisode } from "../../../../series/format"
import { nextEpisode, watchedPercent } from "../../../../series/progress"
import { seriesStatus } from "../../../../series/status"
import type { Series } from "../../../../series/types"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import { ProgressPie } from "../../../../shared/ProgressPie/ProgressPie"
import { NewSeasonForm } from "../NewSeasonForm/NewSeasonForm"
import "./SeriesItem.css"

interface SeriesItemProps {
  series: Series
  /** Enregistrement de sa progression en cours : désactive son bouton. */
  pending: boolean
  onMarkNext: () => void
  /** Ajoute une saison en fin de série ; rejetée en cas d'échec. */
  onAddSeason: (episodeCount: number) => Promise<void>
  onEdit: () => void
}

/** Une série de la liste : où j'en suis, marquer l'épisode suivant, et accès à l'édition. */
export function SeriesItem({
  series,
  pending,
  onMarkNext,
  onAddSeason,
  onEdit,
}: SeriesItemProps) {
  const [addingSeason, setAddingSeason] = useState(false)
  const next = nextEpisode(series)
  const status = seriesStatus(series)
  const editLabel = `Modifier « ${series.name} »`

  async function addSeason(episodeCount: number) {
    await onAddSeason(episodeCount)
    setAddingSeason(false)
  }

  return (
    <div className="series-item">
      <ProgressPie percent={watchedPercent(series)} label="des épisodes vus" />
      <div>
        <p className="series-item-name">{series.name}</p>
        <p className="series-item-detail">{describeSeasons(series.seasons)}</p>
        <p className="series-item-detail">
          {series.lastWatched === null
            ? "Pas encore commencée"
            : `Dernier vu : ${formatEpisode(series.lastWatched)}`}
          {status === "upToDate" && " — à jour"}
          {status === "finished" && " — terminée"}
        </p>
      </div>
      <div className="series-item-actions">
        {next !== null ? (
          <ActionButton
            className="series-item-action"
            busy={pending}
            onClick={onMarkNext}
          >
            {formatEpisode(next)} vu
          </ActionButton>
        ) : (
          // Plus rien à voir : on attend la suite, sauf si la série est terminée.
          !series.finished &&
          !addingSeason && (
            <ActionButton
              variant="secondary"
              className="series-item-action"
              onClick={() => setAddingSeason(true)}
            >
              Ajouter
            </ActionButton>
          )
        )}
        <ActionButton
          variant="secondary"
          className="series-item-edit"
          aria-label={editLabel}
          title={editLabel}
          onClick={onEdit}
        >
          {/* alt vide : le bouton porte déjà le libellé (aria-label). */}
          <img src={pencilIcon} alt="" />
        </ActionButton>
      </div>
      {addingSeason && (
        <div className="series-item-new-season">
          <NewSeasonForm
            seasonNumber={series.seasons.length + 1}
            onAdd={addSeason}
            onCancel={() => setAddingSeason(false)}
          />
        </div>
      )}
    </div>
  )
}
