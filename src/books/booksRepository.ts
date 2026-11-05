// Lecture et écriture des livres lus dans Supabase (table `books`, voir supabase/books.sql).

import { requireSupabase } from "../supabase/client"
import type { Book, BookDraft } from "./types"

const COLUMNS =
  "id, title, authors, read_year, in_progress, series_id, volume, created_at"

type BookRow = {
  id: string
  title: string
  authors: string[]
  read_year: number
  in_progress: boolean
  series_id: string | null
  volume: number | null
  created_at: string
}

/** Code PostgreSQL d'une violation de contrainte unique (ici : tome déjà enregistré). */
const UNIQUE_VIOLATION = "23505"

function toBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    authors: row.authors,
    readYear: row.read_year,
    inProgress: row.in_progress,
    seriesId: row.series_id,
    volume: row.volume,
    createdAt: row.created_at,
  }
}

function toError(error: { code: string; message: string }): Error {
  if (error.code === UNIQUE_VIOLATION) {
    return new Error("Ce tome est déjà enregistré.")
  }
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/** Tous les livres lus du compte connecté (l'ordre d'affichage est fait par groupBooksByYear). */
export async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await requireSupabase().from("books").select(COLUMNS)
  if (error !== null) throw toError(error)
  return (data as BookRow[]).map(toBook)
}

/** Crée le livre s'il est nouveau (id null), sinon le met à jour. */
export async function saveBook(draft: BookDraft): Promise<Book> {
  const isVolume = draft.seriesId !== null
  const values = {
    // Un tome prend le titre et les autrices de sa série.
    title: isVolume ? "" : draft.title.trim(),
    // Les champs d'autrice laissés vides sont ignorés.
    authors: isVolume
      ? []
      : draft.authors
          .map(author => author.trim())
          .filter(author => author !== ""),
    read_year: draft.readYear,
    in_progress: draft.inProgress,
    series_id: draft.seriesId,
    volume: draft.volume,
  }
  const table = requireSupabase().from("books")
  const { data, error } =
    draft.id === null
      ? await table.insert(values).select(COLUMNS).single()
      : await table.update(values).eq("id", draft.id).select(COLUMNS).single()
  if (error !== null) throw toError(error)
  return toBook(data as BookRow)
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await requireSupabase().from("books").delete().eq("id", id)
  if (error !== null) throw toError(error)
}
