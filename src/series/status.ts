import { nextEpisode } from "./progress"
import type { Series } from "./types"

/**
 * Où en est une série : en cours, à jour mais une suite est prévue, pas
 * commencée, ou terminée (tout vu et aucune suite prévue).
 */
export type SeriesStatus = "watching" | "upToDate" | "notStarted" | "finished"

export interface SeriesStatusGroup {
  status: SeriesStatus
  label: string
  series: Series[]
}

/** Ordre d'affichage des groupes : ce qu'on regarde en ce moment d'abord. */
const STATUS_LABELS: Record<SeriesStatus, string> = {
  watching: "En cours",
  upToDate: "À jour, suite prévue",
  notStarted: "Pas commencées",
  finished: "Terminées",
}

export function seriesStatus(series: Series): SeriesStatus {
  if (series.lastWatched === null) return "notStarted"
  if (nextEpisode(series) !== null) return "watching"
  return series.finished ? "finished" : "upToDate"
}

/** Les séries regroupées par statut, triées par nom dans chaque groupe ; les groupes vides sont omis. */
export function groupSeriesByStatus(series: Series[]): SeriesStatusGroup[] {
  const sorted = [...series].sort((first, second) =>
    first.name.localeCompare(second.name, "fr", { sensitivity: "base" }),
  )
  return (Object.keys(STATUS_LABELS) as SeriesStatus[])
    .map(status => ({
      status,
      label: STATUS_LABELS[status],
      series: sorted.filter(item => seriesStatus(item) === status),
    }))
    .filter(group => group.series.length > 0)
}
