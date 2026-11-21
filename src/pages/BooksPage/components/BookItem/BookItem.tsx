import checkIcon from "../../../../assets/icons/check.svg"
import pencilIcon from "../../../../assets/icons/pencil.svg"
import { formatAuthors } from "../../../../books/format"
import type { Book } from "../../../../books/types"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import { Tag } from "../../../../shared/Tag/Tag"
import "./BookItem.css"

interface BookItemProps {
  book: Book
  /** Enregistrement de la fin de lecture en cours : désactive la coche. */
  pending: boolean
  onFinish: () => void
  onEdit: () => void
}

/**
 * Un livre de la liste : titre (avec « En cours » si la lecture n'est pas
 * finie), autrices, coche pour terminer la lecture et accès à l'édition.
 */
export function BookItem({ book, pending, onFinish, onEdit }: BookItemProps) {
  return (
    <div className="book-item">
      <div>
        <p className="book-item-title">
          {book.title}
          {book.inProgress && <Tag variantColor="mint">En cours</Tag>}
        </p>
        <p className="book-item-authors">{formatAuthors(book.authors)}</p>
      </div>
      <div className="book-item-actions">
        {book.inProgress && (
          <IconButton
            icon={checkIcon}
            label={`J'ai terminé « ${book.title} »`}
            busy={pending}
            onClick={onFinish}
          />
        )}
        <IconButton
          icon={pencilIcon}
          label={`Modifier « ${book.title} »`}
          variant="secondary"
          onClick={onEdit}
        />
      </div>
    </div>
  )
}
