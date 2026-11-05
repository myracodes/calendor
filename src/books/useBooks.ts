import { useEffect, useState } from "react"
import {
  findSeriesByName,
  followingVolume,
  volumesOf,
  volumesReadIn,
} from "./bookSeries"
import {
  deleteBookSeries,
  fetchBookSeries,
  saveBookSeries,
} from "./bookSeriesRepository"
import { deleteBook, fetchBooks, saveBook } from "./booksRepository"
import type {
  Book,
  BookDraft,
  BookFormat,
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
    reading: Pick<Book, "readYear" | "inProgress" | "format">,
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
   * Ajuste le nombre de tomes terminés une année donnée, dans un format : les
   * tomes ajoutés suivent le plus grand enregistré, les tomes retirés sont les
   * plus grands numéros de l'année. Comme pour addVolume, les tomes parus
   * suivent si les tomes ajoutés les dépassent.
   */
  async function setVolumesReadIn(
    series: BookSeries,
    year: number,
    format: BookFormat,
    count: number,
  ): Promise<void> {
    const volumes = volumesOf(books, series.id)
    const read = volumesReadIn(volumes, year, format)
    for (const extra of read.slice(count).reverse()) {
      await remove(extra.id)
    }
    const first = followingVolume(volumes)
    const last = first + count - read.length - 1
    for (let volume = first; volume <= last; volume++) {
      await save({
        id: null,
        title: "",
        authors: [],
        readYear: year,
        inProgress: false,
        format,
        seriesId: series.id,
        volume,
      })
    }
    if (series.publishedVolumes !== null && last > series.publishedVolumes) {
      await saveSeries({ ...series, publishedVolumes: last })
    }
  }

  /**
   * Enregistre le formulaire d'ajout : un livre seul, ou un tome de la série
   * nommée, créée au passage si elle n'existe pas encore.
   */
  async function addFromForm(
    form: NewBookForm,
    format: BookFormat,
  ): Promise<{ book: Book; series: BookSeries | undefined }> {
    const reading = {
      readYear: form.readYear,
      inProgress: form.inProgress,
      format,
    }
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
    setVolumesReadIn,
    addFromForm,
  }
}

/** Les livres, les séries et leurs actions, partagés par les cards de la page. */
export type BookLibrary = ReturnType<typeof useBooks>
