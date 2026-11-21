import type { GiftIdea, GiftRecipient } from "../../../../giftIdeas/types"
import type { GiftIdeasLibrary } from "../../../../giftIdeas/useGiftIdeas"
import { Card, type CardVariantColor } from "../../../../shared/Card/Card"
import type { useToast } from "../../../../shared/Toast/useToast"
import { GiftIdeaList } from "../GiftIdeaList/GiftIdeaList"
import { RecipientHeader } from "../RecipientHeader/RecipientHeader"

interface RecipientCardProps {
  recipient: GiftRecipient
  /** Ses idées, la plus récente en premier. */
  ideas: GiftIdea[]
  variantColor: CardVariantColor
  library: GiftIdeasLibrary
  /** Toast de la page, partagé par les cards : un seul affiché à la fois. */
  showToast: ReturnType<typeof useToast>["showToast"]
}

// La card d'une personne : son nom, l'ajout d'une idée, puis ses idées.
export function RecipientCard({
  recipient,
  ideas,
  variantColor,
  library,
  showToast,
}: RecipientCardProps) {
  return (
    <Card variantColor={variantColor}>
      <RecipientHeader
        recipient={recipient}
        ideas={ideas}
        library={library}
        showToast={showToast}
      />
      <GiftIdeaList
        recipient={recipient}
        ideas={ideas}
        library={library}
        showToast={showToast}
      />
    </Card>
  )
}
