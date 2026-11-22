import pencilIcon from "../../../../assets/icons/pencil.svg"
import trashIcon from "../../../../assets/icons/trash.svg"
import type { GiftIdea } from "../../../../giftIdeas/types"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import type { useToast } from "../../../../shared/Toast/useToast"
import { useInlineAction } from "../../../../shared/useInlineAction"
import "./GiftIdeaItem.css"

interface GiftIdeaItemProps {
  idea: GiftIdea
  onEdit: () => void
  /** Rejetée en cas d'échec : le message s'affiche dans un toast. */
  onRemove: () => Promise<void>
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * Une idée de la liste d'une personne : l'accès à son édition, et sa
 * suppression une fois le cadeau offert (sans confirmation : le toast propose
 * « Annuler »).
 */
export function GiftIdeaItem({
  idea,
  onEdit,
  onRemove,
  showToast,
}: GiftIdeaItemProps) {
  const { busy, run } = useInlineAction(showToast)

  return (
    <div className="gift-idea-item">
      <p className="gift-idea-item-title">{idea.title}</p>
      <div className="gift-idea-item-actions">
        <IconButton
          icon={pencilIcon}
          label={`Modifier « ${idea.title} »`}
          variant="secondary"
          size="small"
          disabled={busy}
          onClick={onEdit}
        />
        <IconButton
          icon={trashIcon}
          label={`Supprimer « ${idea.title} »`}
          variant="secondary"
          size="small"
          busy={busy}
          onClick={() => run(onRemove)}
        />
      </div>
    </div>
  )
}
