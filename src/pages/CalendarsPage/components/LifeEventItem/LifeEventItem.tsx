import pencilIcon from "../../../../assets/icons/pencil.svg"
import trashIcon from "../../../../assets/icons/trash.svg"
import { LIFE_EVENT_EMOJIS } from "../../../../lifeEvents/kinds"
import type { LifeEventEntry } from "../../../../lifeEvents/types"
import { lifeEventTitle } from "../../../../lifeEvents/wording"
import { lifeEventLabel } from "../../../../pdf/calendar/calendarData"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import type { useToast } from "../../../../shared/Toast/useToast"
import { useInlineAction } from "../../../../shared/useInlineAction"
import "./LifeEventItem.css"

interface LifeEventItemProps {
  entry: LifeEventEntry
  onEdit: () => void
  /** Rejetée en cas d'échec : le message s'affiche dans un toast. */
  onRemove: () => Promise<void>
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * Un anniversaire ou un décès de la liste : le jour, le libellé tel qu'il
 * s'écrit sur le calendrier, avec l'âge atteint cette année quand l'année de
 * naissance est connue (« 🎂 Lilou (1997 — 29 ans) », « 🎂 Papi (1924-2003) »),
 * puis le crayon et la corbeille (sans confirmation : le toast propose « Annuler »).
 */
export function LifeEventItem({
  entry,
  onEdit,
  onRemove,
  showToast,
}: LifeEventItemProps) {
  const { busy, run } = useInlineAction(showToast)
  const title = lifeEventTitle(entry)

  return (
    <div className="life-event-item">
      <span className="life-event-item-day">{entry.day}</span>
      <p className="life-event-item-label">
        {lifeEventLabel(
          LIFE_EVENT_EMOJIS[entry.kind],
          entry,
          new Date().getFullYear(),
          entry.kind === "birthday",
        )}
      </p>
      <div className="life-event-item-actions">
        <IconButton
          icon={pencilIcon}
          label={`Modifier : ${title}`}
          variant="secondary"
          size="small"
          disabled={busy}
          onClick={onEdit}
        />
        <IconButton
          icon={trashIcon}
          label={`Supprimer : ${title}`}
          variant="secondary"
          size="small"
          busy={busy}
          onClick={() => run(onRemove)}
        />
      </div>
    </div>
  )
}
