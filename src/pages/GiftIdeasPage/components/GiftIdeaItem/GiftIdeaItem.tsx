import pencilIcon from "../../../../assets/icons/pencil.svg"
import type { GiftIdea } from "../../../../giftIdeas/types"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import "./GiftIdeaItem.css"

interface GiftIdeaItemProps {
  idea: GiftIdea
  onEdit: () => void
}

/** Une idée de la liste d'une personne, et l'accès à son édition. */
export function GiftIdeaItem({ idea, onEdit }: GiftIdeaItemProps) {
  return (
    <div className="gift-idea-item">
      <p className="gift-idea-item-title">{idea.title}</p>
      <IconButton
        icon={pencilIcon}
        label={`Modifier « ${idea.title} »`}
        variant="secondary"
        onClick={onEdit}
      />
    </div>
  )
}
