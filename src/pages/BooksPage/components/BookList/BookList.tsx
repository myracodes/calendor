import { Fragment, useState } from "react"
import {
  bookLabel,
  nextVolume,
  volumeInProgress,
  volumesOf,
  volumesReadIn,
} from "../../../../books/bookSeries"
import { BOOK_FORMAT_WORDING } from "../../../../books/bookFormats"
import { plural } from "../../../../books/format"
import { currentYear } from "../../../../books/readYear"
import type {
  Book,
  BookDraft,
  BookFormat,
  BookSeries,
  BookSeriesDraft,
  NewBookForm,
} from "../../../../books/types"
import type { BookLibrary } from "../../../../books/useBooks"
import { groupBooksByYear } from "../../../../books/years"
import { Accordion } from "../../../../shared/Accordion/Accordion"
import { Card, type CardVariantColor } from "../../../../shared/Card/Card"
import type { useToast } from "../../../../shared/Toast/useToast"
import { AddBookForm } from "../AddBookForm/AddBookForm"
import { BookEditor } from "../BookEditor/BookEditor"
import { BookItem } from "../BookItem/BookItem"
import { BookSeriesEditor } from "../BookSeriesEditor/BookSeriesEditor"
import { BookSeriesItem } from "../BookSeriesItem/BookSeriesItem"
import "./BookList.css"

function toDraft(book: Book): BookDraft {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors,
    readYear: book.readYear,
    inProgress: book.inProgress,
    format: book.format,
    seriesId: book.seriesId,
    volume: book.volume,
  }
}

function toSeriesDraft(series: BookSeries): BookSeriesDraft {
  return {
    id: series.id,
    name: series.name,
    authors: series.authors,
    publishedVolumes: series.publishedVolumes,
    complete: series.complete,
    abandoned: series.abandoned,
  }
}

function emptyForm(): NewBookForm {
  // En cours par défaut : un livre s'ajoute souvent dès qu'on le commence.
  return {
    seriesName: "",
    volume: 1,
    title: "",
    authors: [""],
    readYear: currentYear(),
    inProgress: true,
  }
}

/**
 * Ce qui est ouvert dans un éditeur (un seul à la fois) : un livre seul ou une
 * série. Une série apparaît dans chaque année où un tome a été lu : l'éditeur
 * s'ouvre dans l'année cliquée, dont il modifie le nombre de tomes lus.
 */
type Editing =
  | { kind: "book"; draft: BookDraft }
  | {
      kind: "series"
      draft: BookSeriesDraft
      year: number
      yearReadCount: number
    }

interface BookListProps {
  /** Format de la card : seuls ses livres sont listés, et ceux ajoutés le prennent. */
  format: BookFormat
  variantColor: CardVariantColor
  /** Livres et séries de tous les formats, chargés une fois pour la page. */
  library: BookLibrary
  /** Toast de la page, partagé par les cards : un seul affiché à la fois. */
  showToast: ReturnType<typeof useToast>["showToast"]
}

// Une card de la page : les livres d'un format, regroupés par année (tomes
// d'une même série réunis), l'ajout et la modification d'un livre ou d'une
// série. Les séries sont communes aux formats : leur état tient compte de tous
// leurs tomes.
export function BookList({
  format,
  variantColor,
  library,
  showToast,
}: BookListProps) {
  const {
    books,
    seriesList,
    save,
    remove,
    saveSeries,
    removeSeries,
    addVolume,
    setVolumesReadIn,
    addFromForm,
  } = library
  const wording = BOOK_FORMAT_WORDING[format]
  // Formulaire d'ajout, toujours affiché en haut de la liste.
  const [newBook, setNewBook] = useState<NewBookForm>(emptyForm)
  // Livre ou série dont une action est en cours d'enregistrement, pour ne désactiver que ses boutons.
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Editing | null>(null)
  const yearGroups = groupBooksByYear(
    books.filter(book => book.format === format),
    seriesList,
  )
  const thisYear = currentYear()

  function yearReadCount(series: BookSeries, year: number): number {
    return volumesReadIn(volumesOf(books, series.id), year, format).length
  }

  function hasUnsavedChanges(): boolean {
    if (editing === null) return false
    if (
      editing.kind === "series" &&
      editing.draft.id !== null &&
      editing.yearReadCount !==
        yearReadCount(
          seriesList.find(series => series.id === editing.draft.id)!,
          editing.year,
        )
    ) {
      return true
    }
    const saved =
      editing.kind === "book"
        ? books.find(book => book.id === editing.draft.id)
        : seriesList.find(series => series.id === editing.draft.id)
    if (saved === undefined) return false
    const savedDraft =
      editing.kind === "book"
        ? toDraft(saved as Book)
        : toSeriesDraft(saved as BookSeries)
    return JSON.stringify(editing.draft) !== JSON.stringify(savedDraft)
  }

  // Protège les modifications en cours avant de fermer l'éditeur ou d'en ouvrir un autre.
  function canLeaveEditing(): boolean {
    return (
      !hasUnsavedChanges() ||
      window.confirm("Abandonner les modifications en cours ?")
    )
  }

  function editBook(book: Book) {
    if (book.id === editing?.draft.id || !canLeaveEditing()) return
    setEditing({ kind: "book", draft: toDraft(book) })
  }

  function editSeries(series: BookSeries, year: number) {
    const alreadyOpen =
      editing?.kind === "series" &&
      editing.draft.id === series.id &&
      editing.year === year
    if (alreadyOpen || !canLeaveEditing()) return
    setEditing({
      kind: "series",
      draft: toSeriesDraft(series),
      year,
      yearReadCount: yearReadCount(series, year),
    })
  }

  function cancelEditing() {
    if (canLeaveEditing()) setEditing(null)
  }

  async function addBook() {
    const { book, series } = await addFromForm(newBook, format)
    setNewBook(emptyForm())
    const label = bookLabel(book, series)
    showToast(
      "success",
      book.inProgress
        ? `« ${label} » ajouté à ${wording.collection} en cours.`
        : `« ${label} » ajouté à ${wording.collection} de ${book.readYear}.`,
    )
  }

  // Enregistre une action d'un livre ou d'une série ; l'erreur éventuelle part en toast.
  async function runPending(
    id: string,
    action: () => Promise<unknown>,
  ): Promise<boolean> {
    setPendingId(id)
    try {
      await action()
      return true
    } catch (caught) {
      showToast(
        "error",
        `Modification non enregistrée : ${(caught as Error).message}`,
      )
      return false
    } finally {
      setPendingId(null)
    }
  }

  /** Un livre compte dans l'année où il est terminé, même commencé l'année d'avant. */
  function finishedDraft(book: Book): BookDraft {
    return { ...toDraft(book), inProgress: false, readYear: currentYear() }
  }

  async function finish(book: Book) {
    if (!(await runPending(book.id, () => save(finishedDraft(book))))) return
    showToast("success", `« ${book.title} » terminé.`, {
      label: "Annuler",
      // book = le livre avant le clic : on remet sa lecture en cours et son année d'alors.
      onClick: async () => {
        if (await runPending(book.id, () => save(toDraft(book)))) {
          showToast("info", `« ${book.title} » est de nouveau en cours.`)
        }
      },
    })
  }

  // Le tome en cours est terminé ; sinon le tome suivant est ajouté, lu cette année.
  async function readNextVolume(series: BookSeries) {
    const volumes = volumesOf(books, series.id)
    const current = volumeInProgress(volumes)
    const volume = current?.volume ?? nextVolume(series, volumes)
    if (volume === null) return
    let undo: () => Promise<unknown> = async () => {}
    let undoMessage = ""
    const ok = await runPending(series.id, async () => {
      if (current !== undefined) {
        await save(finishedDraft(current))
        undo = () => save(toDraft(current))
        undoMessage = `tome ${volume} de nouveau en cours`
      } else {
        const added = await addVolume(series, volume, {
          readYear: currentYear(),
          inProgress: false,
          format,
        })
        undo = () => remove(added.id)
        undoMessage = `tome ${volume} retiré`
      }
    })
    if (!ok) return
    showToast(
      "success",
      `« ${series.name} » : tome ${volume} ${wording.doneSingular}.`,
      {
        label: "Annuler",
        onClick: async () => {
          if (await runPending(series.id, undo)) {
            showToast("info", `« ${series.name} » : ${undoMessage}.`)
          }
        },
      },
    )
  }

  async function publishNewVolume(series: BookSeries) {
    const published = (series.publishedVolumes ?? 0) + 1
    const ok = await runPending(series.id, () =>
      saveSeries({ ...toSeriesDraft(series), publishedVolumes: published }),
    )
    if (!ok) return
    showToast("success", `« ${series.name} » : tome ${published} paru.`, {
      label: "Annuler",
      onClick: async () => {
        if (await runPending(series.id, () => saveSeries(series))) {
          showToast("info", `« ${series.name} » : tome ${published} retiré.`)
        }
      },
    })
  }

  async function saveEditing() {
    if (editing === null) return
    if (editing.kind === "book") {
      const saved = await save(editing.draft)
      showToast("success", `« ${saved.title} » enregistré.`)
    } else {
      const saved = await saveSeries(editing.draft)
      await setVolumesReadIn(saved, editing.year, format, editing.yearReadCount)
      showToast("success", `Série « ${saved.name} » enregistrée.`)
    }
    setEditing(null)
  }

  async function restore(book: Book) {
    try {
      await save({ ...toDraft(book), id: null })
    } catch (caught) {
      showToast(
        "error",
        `« ${book.title} » non restauré : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `« ${book.title} » restauré.`)
  }

  async function removeEditedBook() {
    if (editing?.kind !== "book" || editing.draft.id === null) return
    const deleted = books.find(book => book.id === editing.draft.id)
    await remove(editing.draft.id)
    setEditing(null)
    // Annuler recrée le livre tel qu'il était enregistré (nouvel id, nouvelle date d'ajout).
    showToast(
      "success",
      `« ${editing.draft.title} » supprimé.`,
      deleted && { label: "Annuler", onClick: () => restore(deleted) },
    )
  }

  // Pas d'« Annuler » : il faudrait recréer la série et tous ses tomes.
  async function removeEditedSeries() {
    if (editing?.kind !== "series" || editing.draft.id === null) return
    await removeSeries(editing.draft.id)
    setEditing(null)
    showToast("success", `Série « ${editing.draft.name} » supprimée.`)
  }

  return (
    <Card variantColor={variantColor}>
      <h2>{wording.cardTitle}</h2>

      <AddBookForm
        format={format}
        form={newBook}
        books={books}
        seriesList={seriesList}
        onChange={setNewBook}
        onAdd={addBook}
      />

      {yearGroups.length > 0 && (
        <div className="book-list-groups">
          {yearGroups.map((group, index) => (
            <Fragment key={group.year}>
              {index > 0 && <hr />}
              <Accordion
                title={`${group.year} (${plural(group.bookCount, "livre", "livres")})`}
                // Seule l'année en cours s'ouvre : c'est là que s'ajoutent les livres.
                defaultOpen={group.year === thisYear}
              >
                <ul className="book-list">
                  {group.entries.map(entry => {
                    if (entry.kind === "book") {
                      const { book } = entry
                      return (
                        <li key={book.id} className="book-list-entry">
                          {editing?.kind === "book" &&
                          editing.draft.id === book.id ? (
                            <BookEditor
                              draft={editing.draft}
                              onChange={draft =>
                                setEditing({ kind: "book", draft })
                              }
                              onSave={saveEditing}
                              onDelete={removeEditedBook}
                              onCancel={cancelEditing}
                            />
                          ) : (
                            <BookItem
                              book={book}
                              pending={pendingId === book.id}
                              onFinish={() => finish(book)}
                              onEdit={() => editBook(book)}
                            />
                          )}
                        </li>
                      )
                    }
                    const { series, volumes } = entry
                    const allVolumes = volumesOf(books, series.id)
                    return (
                      <li key={series.id} className="book-list-entry">
                        {editing?.kind === "series" &&
                        editing.draft.id === series.id &&
                        editing.year === group.year ? (
                          <BookSeriesEditor
                            draft={editing.draft}
                            highestVolume={Math.max(
                              0,
                              ...allVolumes.map(volume => volume.volume ?? 0),
                            )}
                            volumeCount={allVolumes.length}
                            onChange={draft =>
                              setEditing({ ...editing, draft })
                            }
                            yearReadLabel={`Tomes ${wording.donePlural} en ${group.year}`}
                            yearReadCount={editing.yearReadCount}
                            onYearReadCountChange={count =>
                              setEditing({ ...editing, yearReadCount: count })
                            }
                            onSave={saveEditing}
                            onDelete={removeEditedSeries}
                            onCancel={cancelEditing}
                          />
                        ) : (
                          <BookSeriesItem
                            series={series}
                            allVolumes={allVolumes}
                            wording={wording}
                            yearVolumes={volumes}
                            year={group.year}
                            pending={pendingId === series.id}
                            onReadNext={() => readNextVolume(series)}
                            onNewVolumePublished={() =>
                              publishNewVolume(series)
                            }
                            onEdit={() => editSeries(series, group.year)}
                          />
                        )}
                      </li>
                    )
                  })}
                </ul>
              </Accordion>
            </Fragment>
          ))}
        </div>
      )}
    </Card>
  )
}
