import { Fragment, useState } from "react"
import { currentYear } from "../../../../books/readYear"
import type { Book, BookDraft } from "../../../../books/types"
import { useBooks } from "../../../../books/useBooks"
import { groupBooksByYear } from "../../../../books/years"
import { Accordion } from "../../../../shared/Accordion/Accordion"
import { Alert } from "../../../../shared/Alert/Alert"
import { Card } from "../../../../shared/Card/Card"
import { useToast } from "../../../../shared/Toast/useToast"
import { BookEditor } from "../BookEditor/BookEditor"
import { BookItem } from "../BookItem/BookItem"
import "./BookList.css"

function toDraft(book: Book): BookDraft {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors,
    readYear: book.readYear,
    inProgress: book.inProgress,
  }
}

function emptyDraft(): BookDraft {
  // En cours par défaut : un livre s'ajoute souvent dès qu'on le commence.
  return {
    id: null,
    title: "",
    authors: [""],
    readYear: currentYear(),
    inProgress: true,
  }
}

function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count > 1 ? pluralForm : singular}`
}

// Les livres lus, regroupés par année, et l'ajout ou la modification d'un livre.
export function BookList() {
  const { books, loading, loadError, save, remove } = useBooks()
  // Formulaire d'ajout, toujours affiché en haut de la liste.
  const [newBook, setNewBook] = useState<BookDraft>(emptyDraft)
  // Livre dont la fin de lecture est en cours d'enregistrement, pour ne désactiver que sa coche.
  const [pendingId, setPendingId] = useState<string | null>(null)
  // Livre enregistré ouvert dans l'éditeur (un seul à la fois).
  const [draft, setDraft] = useState<BookDraft | null>(null)
  const { toast, showToast } = useToast()
  const yearGroups = groupBooksByYear(books)
  const thisYear = currentYear()

  function hasUnsavedChanges(): boolean {
    if (draft === null) return false
    const saved = books.find(book => book.id === draft.id)
    return (
      saved !== undefined &&
      JSON.stringify(draft) !== JSON.stringify(toDraft(saved))
    )
  }

  // Protège les modifications en cours avant de fermer l'éditeur ou d'en ouvrir un autre.
  function canLeaveDraft(): boolean {
    return (
      !hasUnsavedChanges() ||
      window.confirm("Abandonner les modifications en cours ?")
    )
  }

  function edit(book: Book) {
    if (book.id === draft?.id || !canLeaveDraft()) return
    setDraft(toDraft(book))
  }

  async function addBook() {
    const saved = await save(newBook)
    setNewBook(emptyDraft())
    showToast(
      "success",
      saved.inProgress
        ? `« ${saved.title} » ajouté à tes lectures en cours.`
        : `« ${saved.title} » ajouté à tes lectures de ${saved.readYear}.`,
    )
  }

  function cancelDraft() {
    if (canLeaveDraft()) setDraft(null)
  }

  // Enregistre la lecture d'un livre ; l'erreur éventuelle part en toast.
  async function saveReading(reading: BookDraft): Promise<boolean> {
    setPendingId(reading.id)
    try {
      await save(reading)
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

  async function undoFinish(book: Book) {
    // book = le livre avant le clic : on remet sa lecture en cours et son année d'alors.
    if (await saveReading(toDraft(book))) {
      showToast("info", `« ${book.title} » est de nouveau en cours.`)
    }
  }

  // Un livre compte dans l'année où il est terminé, même commencé l'année d'avant.
  async function finish(book: Book) {
    const finished = {
      ...toDraft(book),
      inProgress: false,
      readYear: currentYear(),
    }
    if (!(await saveReading(finished))) return
    showToast("success", `« ${book.title} » terminé.`, {
      label: "Annuler",
      onClick: () => undoFinish(book),
    })
  }

  async function saveDraft() {
    if (draft === null) return
    const saved = await save(draft)
    setDraft(null)
    showToast("success", `« ${saved.title} » enregistré.`)
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

  async function removeDraft() {
    if (draft === null || draft.id === null) return
    const deleted = books.find(book => book.id === draft.id)
    await remove(draft.id)
    setDraft(null)
    // Annuler recrée le livre tel qu'il était enregistré (nouvel id, nouvelle date d'ajout).
    showToast(
      "success",
      `« ${draft.title} » supprimé.`,
      deleted && { label: "Annuler", onClick: () => restore(deleted) },
    )
  }

  if (loading) return <p className="hint">Chargement des livres…</p>
  if (loadError !== null) {
    return (
      <Alert variantColor="danger" title="Impossible de charger les livres">
        {loadError}
      </Alert>
    )
  }

  return (
    <Card variantColor="sun">
      <h2>Mes lectures</h2>

      <BookEditor draft={newBook} onChange={setNewBook} onSave={addBook} />

      {books.length > 0 && (
        <div className="book-list-groups">
          {yearGroups.map((group, index) => (
            <Fragment key={group.year}>
              {index > 0 && <hr />}
              <Accordion
                title={`${group.year} (${plural(group.books.length, "livre", "livres")})`}
                // Seule l'année en cours s'ouvre : c'est là que s'ajoutent les livres.
                defaultOpen={group.year === thisYear}
              >
                <ul className="book-list">
                  {group.books.map(book => (
                    <li key={book.id} className="book-list-entry">
                      {draft !== null && draft.id === book.id ? (
                        <BookEditor
                          draft={draft}
                          onChange={setDraft}
                          onSave={saveDraft}
                          onDelete={removeDraft}
                          onCancel={cancelDraft}
                        />
                      ) : (
                        <BookItem
                          book={book}
                          pending={pendingId === book.id}
                          onFinish={() => finish(book)}
                          onEdit={() => edit(book)}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </Accordion>
            </Fragment>
          ))}
        </div>
      )}
      {toast}
    </Card>
  )
}
