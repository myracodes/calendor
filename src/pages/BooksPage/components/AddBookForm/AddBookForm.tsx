import { useId } from "react"
import {
  findSeriesByName,
  followingVolume,
  volumesOf,
} from "../../../../books/bookSeries"
import { BOOK_FORMAT_WORDING } from "../../../../books/bookFormats"
import type {
  Book,
  BookFormat,
  BookSeries,
  NewBookForm,
} from "../../../../books/types"
import { isNewBookComplete, readYearError } from "../../../../books/validation"
import { AuthorsField } from "../AuthorsField/AuthorsField"
import { BookForm } from "../BookForm/BookForm"
import { ReadingFields } from "../ReadingFields/ReadingFields"

interface AddBookFormProps {
  format: BookFormat
  form: NewBookForm
  books: Book[]
  seriesList: BookSeries[]
  onChange: (form: NewBookForm) => void
  /** Rejetée en cas d'échec : le message s'affiche sous les champs. */
  onAdd: () => Promise<void>
}

/**
 * Formulaire d'ajout, toujours affiché en haut de la liste. Sans série, c'est
 * un livre seul ; avec une série connue, seul le tome est demandé ; avec un
 * nouveau nom, la série est créée avec ce premier tome.
 */
export function AddBookForm({
  format,
  form,
  books,
  seriesList,
  onChange,
  onAdd,
}: AddBookFormProps) {
  // Une card par format, donc un formulaire par format : l'id de la liste de séries doit être unique.
  const seriesListId = useId()
  const isVolume = form.seriesName.trim() !== ""
  const existingSeries = findSeriesByName(seriesList, form.seriesName)

  // Série reconnue : le numéro passe au tome suivant le dernier enregistré.
  function setSeriesName(seriesName: string) {
    const series = findSeriesByName(seriesList, seriesName)
    onChange({
      ...form,
      seriesName,
      volume:
        series === undefined
          ? form.volume
          : followingVolume(volumesOf(books, series.id)),
    })
  }

  return (
    <BookForm
      submitLabel="Ajouter"
      canSubmit={
        isNewBookComplete(form, seriesList) &&
        readYearError(form.readYear) === null
      }
      onSubmit={onAdd}
    >
      <div className="row">
        <label>
          Série (optionnel)
          <input
            type="text"
            list={seriesListId}
            value={form.seriesName}
            onChange={e => setSeriesName(e.target.value)}
          />
          <datalist id={seriesListId}>
            {seriesList.map(series => (
              <option key={series.id} value={series.name} />
            ))}
          </datalist>
        </label>

        {isVolume && (
          <label>
            Tome
            <input
              type="number"
              min={1}
              step={1}
              // Champ vidé = 0, refusé par isNewBookComplete tant qu'il n'est pas rempli.
              value={form.volume === 0 ? "" : form.volume}
              onChange={e =>
                onChange({
                  ...form,
                  volume: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
            />
          </label>
        )}
      </div>

      {!isVolume && (
        <label>
          Titre
          <input
            type="text"
            value={form.title}
            onChange={e => onChange({ ...form, title: e.target.value })}
          />
        </label>
      )}

      {isVolume && existingSeries === undefined && (
        <p className="hint">Nouvelle série : elle sera créée avec ce tome.</p>
      )}

      {/* Une série connue a déjà ses autrices. */}
      {existingSeries === undefined && (
        <AuthorsField
          authors={form.authors}
          onChange={authors => onChange({ ...form, authors })}
        />
      )}

      <ReadingFields
        yearLabel={BOOK_FORMAT_WORDING[format].yearLabel}
        reading={form}
        onChange={reading => onChange({ ...form, ...reading })}
      />
    </BookForm>
  )
}
