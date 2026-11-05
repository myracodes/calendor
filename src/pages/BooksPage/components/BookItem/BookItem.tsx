import checkIcon from "../../../../assets/icons/check.svg"
import pencilIcon from "../../../../assets/icons/pencil.svg"
import { formatAuthors } from "../../../../books/format"
import type { Book } from "../../../../books/types"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
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
  const finishLabel = `J'ai terminé « ${book.title} »`
  const editLabel = `Modifier « ${book.title} »`

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
          <ActionButton
            className="book-item-icon-button"
            busy={pending}
            aria-label={finishLabel}
            title={finishLabel}
            onClick={onFinish}
          >
            {/* alt vide : le bouton porte déjà le libellé (aria-label). */}
            <img src={checkIcon} alt="" />
          </ActionButton>
        )}
        <ActionButton
          variant="secondary"
          className="book-item-icon-button"
          aria-label={editLabel}
          title={editLabel}
          onClick={onEdit}
        >
          <img src={pencilIcon} alt="" />
        </ActionButton>
      </div>
    </div>
  )
}
