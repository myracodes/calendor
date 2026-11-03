import pencilIcon from "../../../../assets/icons/pencil.svg"
import { formatAuthors } from "../../../../books/format"
import type { Book } from "../../../../books/types"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import "./BookItem.css"

interface BookItemProps {
  book: Book
  onEdit: () => void
}

/** Un livre de la liste : titre, autrices et accès à l'édition. */
export function BookItem({ book, onEdit }: BookItemProps) {
  const editLabel = `Modifier « ${book.title} »`

  return (
    <div className="book-item">
      <div>
        <p className="book-item-title">{book.title}</p>
        <p className="book-item-authors">{formatAuthors(book.authors)}</p>
      </div>
      <ActionButton
        variant="secondary"
        className="book-item-edit"
        aria-label={editLabel}
        title={editLabel}
        onClick={onEdit}
      >
        {/* alt vide : le bouton porte déjà le libellé (aria-label). */}
        <img src={pencilIcon} alt="" />
      </ActionButton>
    </div>
  )
}
