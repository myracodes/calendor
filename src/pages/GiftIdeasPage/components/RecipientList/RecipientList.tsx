import { Fragment } from "react"
import type { GiftIdeasLibrary } from "../../../../giftIdeas/useGiftIdeas"
import type { useToast } from "../../../../shared/Toast/useToast"
import { RecipientAccordion } from "../RecipientAccordion/RecipientAccordion"
import "./RecipientList.css"

interface RecipientListProps {
  library: GiftIdeasLibrary
  /** Personne qu'on vient d'ajouter : son accordéon s'ouvre. */
  addedRecipientId: string | null
  showToast: ReturnType<typeof useToast>["showToast"]
}

/** Un accordéon par personne, par ordre alphabétique, fermés sauf la personne qu'on vient d'ajouter. */
export function RecipientList({
  library,
  addedRecipientId,
  showToast,
}: RecipientListProps) {
  if (library.recipients.length === 0) {
    return (
      <p className="hint">
        Aucune personne pour l'instant : ajoute la première.
      </p>
    )
  }

  return (
    <div className="recipient-list">
      {library.recipients.map((recipient, index) => (
        <Fragment key={recipient.id}>
          {index > 0 && <hr />}
          <RecipientAccordion
            recipient={recipient}
            ideas={library.ideas.filter(
              idea => idea.recipientId === recipient.id,
            )}
            defaultOpen={recipient.id === addedRecipientId}
            library={library}
            showToast={showToast}
          />
        </Fragment>
      ))}
    </div>
  )
}
