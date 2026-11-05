import type { Book, BookFormat, BookSeries } from "./types"

/**
 * Où en est la lecture d'une série : en cours, à jour (tout le paru est lu,
 * une suite peut sortir), terminée (tout lu, œuvre complète) ou abandonnée.
 */
export type BookSeriesStatus = "reading" | "upToDate" | "finished" | "abandoned"

/** Les tomes enregistrés d'une série. */
export function volumesOf(books: Book[], seriesId: string): Book[] {
  return books.filter(book => book.seriesId === seriesId)
}

/** La série de ce nom, sans tenir compte des majuscules ni des espaces autour. */
export function findSeriesByName(
  seriesList: BookSeries[],
  name: string,
): BookSeries | undefined {
  const wanted = name.trim().toLocaleLowerCase("fr-FR")
  if (wanted === "") return undefined
  return seriesList.find(
    series => series.name.trim().toLocaleLowerCase("fr-FR") === wanted,
  )
}

/**
 * Plus grand numéro de tome terminé, null si aucun. Les tomes lus avant
 * d'utiliser l'app ne sont pas enregistrés : une série peut commencer au tome 3.
 */
export function lastReadVolume(volumes: Book[]): number | null {
  const read = volumes
    .filter(volume => !volume.inProgress)
    .map(volume => volume.volume ?? 0)
  return read.length === 0 ? null : Math.max(...read)
}

export function volumeInProgress(volumes: Book[]): Book | undefined {
  return volumes.find(volume => volume.inProgress)
}

/** Le tome qui suit le plus grand enregistré (lu ou en cours), qu'il soit paru ou non. */
export function followingVolume(volumes: Book[]): number {
  return Math.max(0, ...volumes.map(volume => volume.volume ?? 0)) + 1
}

/** Le prochain tome à lire, null s'il n'est pas encore paru. */
export function nextVolume(series: BookSeries, volumes: Book[]): number | null {
  const next = followingVolume(volumes)
  const { publishedVolumes } = series
  return publishedVolumes !== null && next > publishedVolumes ? null : next
}

/**
 * Sans nombre de tomes parus, impossible de savoir si tout est lu : la série
 * reste en cours (sauf abandon).
 */
export function bookSeriesStatus(
  series: BookSeries,
  volumes: Book[],
): BookSeriesStatus {
  if (series.abandoned) return "abandoned"
  const { publishedVolumes } = series
  if (publishedVolumes === null || volumeInProgress(volumes) !== undefined) {
    return "reading"
  }
  if ((lastReadVolume(volumes) ?? 0) < publishedVolumes) return "reading"
  return series.complete ? "finished" : "upToDate"
}

/**
 * Part des tomes parus déjà lus, en pourcentage arrondi à l'inférieur ; null
 * sans nombre de tomes parus.
 */
export function readPercent(
  series: BookSeries,
  volumes: Book[],
): number | null {
  const { publishedVolumes } = series
  if (publishedVolumes === null) return null
  const read = lastReadVolume(volumes) ?? 0
  return Math.min(100, Math.floor((read / publishedVolumes) * 100))
}

/** Nom d'un livre dans les messages : son titre, ou « Série, tome N » pour un tome. */
export function bookLabel(book: Book, series: BookSeries | undefined): string {
  if (book.seriesId === null || series === undefined) return book.title
  return `${series.name}, tome ${book.volume}`
}

/** Les tomes terminés une année donnée, dans un format, du plus petit numéro au plus grand. */
export function volumesReadIn(
  volumes: Book[],
  year: number,
  format: BookFormat,
): Book[] {
  return volumes
    .filter(
      volume =>
        !volume.inProgress &&
        volume.readYear === year &&
        volume.format === format,
    )
    .sort((first, second) => (first.volume ?? 0) - (second.volume ?? 0))
}
