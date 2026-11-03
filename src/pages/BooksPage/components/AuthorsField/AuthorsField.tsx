import "./AuthorsField.css"

interface AuthorsFieldProps {
  authors: string[]
  onChange: (authors: string[]) => void
}

/** Un champ par autrice, pour les livres à plusieurs mains ; on en ajoute une depuis la dernière ligne. */
export function AuthorsField({ authors, onChange }: AuthorsFieldProps) {
  const lastIndex = authors.length - 1

  function setAuthor(authorIndex: number, value: string) {
    onChange(authors.map((author, i) => (i === authorIndex ? value : author)))
  }

  function removeAuthor(authorIndex: number) {
    onChange(authors.filter((_, i) => i !== authorIndex))
  }

  return (
    <ol className="authors-field">
      {authors.map((author, i) => (
        // Index en clé : les champs n'ont pas d'identifiant propre, et la
        // saisie en cours n'est pas perdue au retrait d'une autrice.
        <li key={i} className="row">
          <label className="authors-field-label">
            {authors.length > 1 ? `Autrice ${i + 1}` : "Autrice"}
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(i, e.target.value)}
            />
          </label>
          {/* La dernière autrice restante ne se retire pas : un livre en a toujours une. */}
          {authors.length > 1 && (
            <button
              type="button"
              className="btn-remove"
              onClick={() => removeAuthor(i)}
            >
              Supprimer
            </button>
          )}
          {i === lastIndex && (
            <button type="button" onClick={() => onChange([...authors, ""])}>
              Ajouter une autrice
            </button>
          )}
        </li>
      ))}
    </ol>
  )
}
