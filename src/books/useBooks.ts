import { useEffect, useState } from "react"
import { deleteBook, fetchBooks, saveBook } from "./booksRepository"
import type { Book, BookDraft } from "./types"

/**
 * Les livres lus du compte connecté, chargés au montage, et les actions pour
 * les modifier : la liste locale n'est mise à jour qu'une fois la base d'accord.
 */
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage (ex. changement de page).
    let cancelled = false
    fetchBooks()
      .then(list => {
        if (!cancelled) setBooks(list)
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function save(draft: BookDraft): Promise<Book> {
    const saved = await saveBook(draft)
    setBooks(previous => [
      ...previous.filter(book => book.id !== saved.id),
      saved,
    ])
    return saved
  }

  async function remove(id: string): Promise<void> {
    await deleteBook(id)
    setBooks(previous => previous.filter(book => book.id !== id))
  }

  return { books, loading, loadError, save, remove }
}
