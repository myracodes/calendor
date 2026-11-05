import checkIcon from "../../../../assets/icons/check.svg"
import pencilIcon from "../../../../assets/icons/pencil.svg"
import plusIcon from "../../../../assets/icons/plus.svg"
import {
  type BookSeriesStatus,
  bookSeriesStatus,
  nextVolume,
  readPercent,
  volumeInProgress,
} from "../../../../books/bookSeries"
import { formatAuthors, formatVolumes, plural } from "../../../../books/format"
import type { Book, BookSeries } from "../../../../books/types"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import { ProgressPie } from "../../../../shared/ProgressPie/ProgressPie"
import { Tag, type TagVariantColor } from "../../../../shared/Tag/Tag"
import "./BookSeriesItem.css"

// Terminée et abandonnée partagent le style neutre : dans les deux cas, la lecture est finie.
const STATUS_TAGS: Record<
  BookSeriesStatus,
  { label: string; variantColor: TagVariantColor }
> = {
  reading: { label: "En cours", variantColor: "mint" },
  upToDate: { label: "À jour", variantColor: "sun" },
  finished: { label: "Terminée", variantColor: "neutral" },
  abandoned: { label: "Abandonnée", variantColor: "neutral" },
}

interface BookSeriesItemProps {
  series: BookSeries
  /** Tous les tomes enregistrés de la série, pour son état. */
  allVolumes: Book[]
  /** Les tomes lus l'année de la ligne. */
  yearVolumes: Book[]
  year: number
  /** Enregistrement d'une action de la série en cours : désactive son bouton. */
  pending: boolean
  /** Tome en cours terminé, ou tome suivant lu. */
  onReadNext: () => void
  /** Un tome de plus est paru. */
  onNewVolumePublished: () => void
  onEdit: () => void
}

/**
 * Une série dans la liste d'une année : les tomes lus cette année-là, son état
 * de lecture, le bouton du moment (tome suivant lu, nouveau tome paru) et
 * l'accès à l'édition.
 */
export function BookSeriesItem({
  series,
  allVolumes,
  yearVolumes,
  year,
  pending,
  onReadNext,
  onNewVolumePublished,
  onEdit,
}: BookSeriesItemProps) {
  const status = bookSeriesStatus(series, allVolumes)
  const tag = STATUS_TAGS[status]
  const percent = readPercent(series, allVolumes)
  const currentVolume = volumeInProgress(allVolumes)
  const toRead = currentVolume?.volume ?? nextVolume(series, allVolumes)
  const finishedThisYear = yearVolumes
    .filter(volume => !volume.inProgress)
    .map(volume => volume.volume ?? 0)
  const inProgressThisYear = yearVolumes.find(volume => volume.inProgress)
  const readNextLabel = `Tome ${toRead} de « ${series.name} » lu`
  const newVolumeLabel = `Nouveau tome de « ${series.name} » paru`
  const editLabel = `Modifier la série « ${series.name} »`

  const yearDetail = [
    finishedThisYear.length > 0 &&
      `${formatVolumes(finishedThisYear)} lu${finishedThisYear.length > 1 ? "s" : ""} en ${year}`,
    inProgressThisYear !== undefined &&
      `tome ${inProgressThisYear.volume} en cours`,
  ]
    .filter(Boolean)
    .join(" · ")
  const publicationDetail = [
    series.publishedVolumes !== null &&
      plural(series.publishedVolumes, "tome paru", "tomes parus"),
    // Une fois la série terminée, la pastille le dit déjà.
    series.complete && status !== "finished" && "série complète",
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <div
      className={`book-series-item${percent === null ? "" : " book-series-item--with-pie"}`}
    >
      {percent !== null && (
        <ProgressPie percent={percent} label="des tomes parus lus" />
      )}
      <div>
        <p className="book-series-item-name">
          {series.name}
          <Tag variantColor={tag.variantColor}>{tag.label}</Tag>
        </p>
        <p className="book-series-item-detail">
          {formatAuthors(series.authors)}
        </p>
        {/* Majuscule : la ligne peut commencer par « tome N en cours ». */}
        <p className="book-series-item-detail book-series-item-year">
          {yearDetail}
        </p>
        {publicationDetail !== "" && (
          <p className="book-series-item-detail">{publicationDetail}</p>
        )}
      </div>
      <div className="book-series-item-actions">
        {status === "reading" && toRead !== null && (
          <ActionButton
            className="book-series-item-action"
            busy={pending}
            aria-label={readNextLabel}
            title={readNextLabel}
            onClick={onReadNext}
          >
            <img src={checkIcon} alt="" />
            {/* Abrégé « t. 13 » : l'aria-label et l'infobulle disent le libellé complet. */}
            <span aria-hidden="true">t. {toRead}</span>
          </ActionButton>
        )}
        {status === "upToDate" && (
          <ActionButton
            variant="secondary"
            className="book-series-item-icon-button"
            busy={pending}
            aria-label={newVolumeLabel}
            title={newVolumeLabel}
            onClick={onNewVolumePublished}
          >
            {/* alt vide : le bouton porte déjà le libellé (aria-label). */}
            <img src={plusIcon} alt="" />
          </ActionButton>
        )}
        <ActionButton
          variant="secondary"
          className="book-series-item-icon-button"
          aria-label={editLabel}
          title={editLabel}
          onClick={onEdit}
        >
          <img src={pencilIcon} alt="" />
        </ActionButton>
      </div>
    </div>
  )
}
