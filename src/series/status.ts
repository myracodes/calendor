import { nextEpisode } from "./progress"
import type { Series } from "./types"

/**
 * Où en est une série : en cours, à jour mais une suite est prévue, pas
 * commencée, ou terminée (tout vu et aucune suite prévue).
 */
export type SeriesStatus = "watching" | "upToDate" | "notStarted" | "finished"

/**
 * Groupes de la liste : les séries terminées (tout vu et case « Série
 * terminée » cochée) à part, toutes les autres ensemble.
 */
export type SeriesGroupKey = "ongoing" | "finished"

export interface SeriesStatusGroup {
  status: SeriesGroupKey
  label: string
  series: Series[]
}

/** Ordre d'affichage des groupes : ce qu'on suit encore d'abord. */
const GROUP_LABELS: Record<SeriesGroupKey, string> = {
  ongoing: "En cours",
  finished: "Terminées",
}

export function seriesStatus(series: Series): SeriesStatus {
  if (series.lastWatched === null) return "notStarted"
  if (nextEpisode(series) !== null) return "watching"
  return series.finished ? "finished" : "upToDate"
}

function groupKey(series: Series): SeriesGroupKey {
  return seriesStatus(series) === "finished" ? "finished" : "ongoing"
}

/** Les séries regroupées, la dernière modifiée en premier dans chaque groupe ; les groupes vides sont omis. */
export function groupSeriesByStatus(series: Series[]): SeriesStatusGroup[] {
  const sorted = [...series].sort(
    (first, second) =>
      Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
  )
  return (Object.keys(GROUP_LABELS) as SeriesGroupKey[])
    .map(status => ({
      status,
      label: GROUP_LABELS[status],
      series: sorted.filter(item => groupKey(item) === status),
    }))
    .filter(group => group.series.length > 0)
}
