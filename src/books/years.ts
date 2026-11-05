import type { Book, BookSeries } from "./types"

/** Une ligne de la liste d'une année : un livre seul, ou les tomes d'une série lus cette année-là. */
export type BookYearEntry =
  | { kind: "book"; book: Book }
  | { kind: "series"; series: BookSeries; volumes: Book[] }

export interface BookYearGroup {
  year: number
  /** Livres lus dans l'année, chaque tome comptant pour un. */
  bookCount: number
  entries: BookYearEntry[]
}

/**
 * Les livres regroupés par année de lecture, la plus récente d'abord. Dans une
 * année, dans l'ordre d'ajout ; une série prend la place de son premier tome
 * ajouté cette année-là, ses tomes triés par numéro.
 */
export function groupBooksByYear(
  books: Book[],
  seriesList: BookSeries[],
): BookYearGroup[] {
  const sorted = [...books].sort(
    (first, second) =>
      second.readYear - first.readYear ||
      Date.parse(first.createdAt) - Date.parse(second.createdAt),
  )
  const groups: BookYearGroup[] = []
  for (const book of sorted) {
    let group = groups.at(-1)
    if (group?.year !== book.readYear) {
      group = { year: book.readYear, bookCount: 0, entries: [] }
      groups.push(group)
    }
    group.bookCount++
    const series = seriesList.find(item => item.id === book.seriesId)
    if (series === undefined) {
      group.entries.push({ kind: "book", book })
      continue
    }
    const seriesEntry = group.entries.find(
      entry => entry.kind === "series" && entry.series.id === series.id,
    )
    if (seriesEntry?.kind === "series") seriesEntry.volumes.push(book)
    else group.entries.push({ kind: "series", series, volumes: [book] })
  }
  for (const group of groups) {
    for (const entry of group.entries) {
      if (entry.kind === "series") {
        entry.volumes.sort(
          (first, second) => (first.volume ?? 0) - (second.volume ?? 0),
        )
      }
    }
  }
  return groups
}
