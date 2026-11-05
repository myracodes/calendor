// Lecture et écriture des livres lus dans Supabase (table `books`, voir supabase/books.sql).

import { requireSupabase } from "../supabase/client"
import type { Book, BookDraft } from "./types"

const COLUMNS = "id, title, authors, read_year, in_progress, created_at"

type BookRow = {
  id: string
  title: string
  authors: string[]
  read_year: number
  in_progress: boolean
  created_at: string
}

function toBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    authors: row.authors,
    readYear: row.read_year,
    inProgress: row.in_progress,
    createdAt: row.created_at,
  }
}

function toError(error: { message: string }): Error {
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
  const values = {
    title: draft.title.trim(),
    // Les champs d'autrice laissés vides sont ignorés.
    authors: draft.authors
      .map(author => author.trim())
      .filter(author => author !== ""),
    read_year: draft.readYear,
    in_progress: draft.inProgress,
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
