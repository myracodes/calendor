import pencilIcon from "../../../../assets/icons/pencil.svg"
import { fromWhom } from "../../../../recommendations/format"
import type { Recommendation } from "../../../../recommendations/types"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import "./RecommendationItem.css"

interface RecommendationItemProps {
  recommendation: Recommendation
  onEdit: () => void
}

/** Une reco de la liste : titre, qui l'a recommandée (si renseigné), et accès à l'édition. */
export function RecommendationItem({
  recommendation,
  onEdit,
}: RecommendationItemProps) {
  return (
    <div className="recommendation-item">
      <div>
        <p className="recommendation-item-title">{recommendation.title}</p>
        {recommendation.recommendedBy !== "" && (
          <p className="recommendation-item-from">
            {fromWhom(recommendation.recommendedBy)}
          </p>
        )}
      </div>
      <IconButton
        icon={pencilIcon}
        label={`Modifier « ${recommendation.title} »`}
        variant="secondary"
        onClick={onEdit}
      />
    </div>
  )
}
