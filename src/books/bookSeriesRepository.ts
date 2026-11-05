// Lecture et écriture des séries de livres dans Supabase (table `book_series`,
// voir supabase/book_series.sql).

import { requireSupabase } from "../supabase/client"
import type { BookSeries, BookSeriesDraft } from "./types"

const COLUMNS = "id, name, authors, published_volumes, complete, abandoned"

type BookSeriesRow = {
  id: string
  name: string
  authors: string[]
  published_volumes: number | null
  complete: boolean
  abandoned: boolean
}

/** Code PostgreSQL d'une violation de contrainte unique (ici : nom déjà pris). */
const UNIQUE_VIOLATION = "23505"

function toBookSeries(row: BookSeriesRow): BookSeries {
  return {
    id: row.id,
    name: row.name,
    authors: row.authors,
    publishedVolumes: row.published_volumes,
    complete: row.complete,
    abandoned: row.abandoned,
  }
}

function toError(error: { code: string; message: string }): Error {
  if (error.code === UNIQUE_VIOLATION) {
    return new Error("Une série porte déjà ce nom.")
  }
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/** Toutes les séries de livres du compte connecté. */
export async function fetchBookSeries(): Promise<BookSeries[]> {
  const { data, error } = await requireSupabase()
    .from("book_series")
    .select(COLUMNS)
  if (error !== null) throw toError(error)
  return (data as BookSeriesRow[]).map(toBookSeries)
}

/** Crée la série si elle est nouvelle (id null), sinon la met à jour. */
export async function saveBookSeries(
  draft: BookSeriesDraft,
): Promise<BookSeries> {
  const values = {
    name: draft.name.trim(),
    // Les champs d'autrice laissés vides sont ignorés.
    authors: draft.authors
      .map(author => author.trim())
      .filter(author => author !== ""),
    published_volumes: draft.publishedVolumes,
    complete: draft.complete,
    abandoned: draft.abandoned,
  }
  const table = requireSupabase().from("book_series")
  const { data, error } =
    draft.id === null
      ? await table.insert(values).select(COLUMNS).single()
      : await table.update(values).eq("id", draft.id).select(COLUMNS).single()
  if (error !== null) throw toError(error)
  return toBookSeries(data as BookSeriesRow)
}

/** Supprime la série et, en base, tous ses tomes (on delete cascade). */
export async function deleteBookSeries(id: string): Promise<void> {
  const { error } = await requireSupabase()
    .from("book_series")
    .delete()
    .eq("id", id)
  if (error !== null) throw toError(error)
}
