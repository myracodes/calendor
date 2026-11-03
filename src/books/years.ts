import type { Book } from "./types"

export interface BookYearGroup {
  year: number
  books: Book[]
}

/** Les livres regroupés par année de lecture, la plus récente d'abord ; dans une année, dans l'ordre d'ajout. */
export function groupBooksByYear(books: Book[]): BookYearGroup[] {
  const sorted = [...books].sort(
    (first, second) =>
      second.readYear - first.readYear ||
      Date.parse(first.createdAt) - Date.parse(second.createdAt),
  )
  const groups: BookYearGroup[] = []
  for (const book of sorted) {
    const lastGroup = groups.at(-1)
    if (lastGroup?.year === book.readYear) lastGroup.books.push(book)
    else groups.push({ year: book.readYear, books: [book] })
  }
  return groups
}
