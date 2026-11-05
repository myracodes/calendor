import { useEffect, useState } from "react"
import { findSeriesByName } from "./bookSeries"
import {
  deleteBookSeries,
  fetchBookSeries,
  saveBookSeries,
} from "./bookSeriesRepository"
import { deleteBook, fetchBooks, saveBook } from "./booksRepository"
import type {
  Book,
  BookDraft,
  BookSeries,
  BookSeriesDraft,
  NewBookForm,
} from "./types"

/**
 * Les livres lus et les séries de livres du compte connecté, chargés au
 * montage, et les actions pour les modifier : l'état local n'est mis à jour
 * qu'une fois la base d'accord.
 */
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [seriesList, setSeriesList] = useState<BookSeries[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage (ex. changement de page).
    let cancelled = false
    Promise.all([fetchBooks(), fetchBookSeries()])
      .then(([bookList, bookSeriesList]) => {
        if (cancelled) return
        setBooks(bookList)
        setSeriesList(bookSeriesList)
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

  async function saveSeries(draft: BookSeriesDraft): Promise<BookSeries> {
    const saved = await saveBookSeries(draft)
    setSeriesList(previous => [
      ...previous.filter(series => series.id !== saved.id),
      saved,
    ])
    return saved
  }

  /** Supprime la série et ses tomes (la base les supprime en cascade). */
  async function removeSeries(id: string): Promise<void> {
    await deleteBookSeries(id)
    setSeriesList(previous => previous.filter(series => series.id !== id))
    setBooks(previous => previous.filter(book => book.seriesId !== id))
  }

  /**
   * Ajoute un tome à une série enregistrée. Un tome lu au-delà des tomes parus
   * est forcément paru : le nombre de tomes parus suit.
   */
  async function addVolume(
    series: BookSeries,
    volume: number,
    reading: Pick<Book, "readYear" | "inProgress">,
  ): Promise<Book> {
    const added = await save({
      id: null,
      title: "",
      authors: [],
      ...reading,
      seriesId: series.id,
      volume,
    })
    if (series.publishedVolumes !== null && volume > series.publishedVolumes) {
      await saveSeries({ ...series, publishedVolumes: volume })
    }
    return added
  }

  /**
   * Enregistre le formulaire d'ajout : un livre seul, ou un tome de la série
   * nommée, créée au passage si elle n'existe pas encore.
   */
  async function addFromForm(
    form: NewBookForm,
  ): Promise<{ book: Book; series: BookSeries | undefined }> {
    const reading = { readYear: form.readYear, inProgress: form.inProgress }
    if (form.seriesName.trim() === "") {
      const book = await save({
        id: null,
        title: form.title,
        authors: form.authors,
        ...reading,
        seriesId: null,
        volume: null,
      })
      return { book, series: undefined }
    }
    const series =
      findSeriesByName(seriesList, form.seriesName) ??
      (await saveSeries({
        id: null,
        name: form.seriesName,
        authors: form.authors,
        // Le tome qu'on ajoute est paru, donc tous ceux d'avant aussi : 1 pour
        // un premier tome. Évite d'avoir à le renseigner à chaque nouvelle série.
        publishedVolumes: form.volume,
        complete: false,
        abandoned: false,
      }))
    const book = await addVolume(series, form.volume, reading)
    return { book, series }
  }

  return {
    books,
    seriesList,
    loading,
    loadError,
    save,
    remove,
    saveSeries,
    removeSeries,
    addVolume,
    addFromForm,
  }
}
