import pencilIcon from "../../../../assets/icons/pencil.svg"
import trashIcon from "../../../../assets/icons/trash.svg"
import { IconButton } from "../../../../shared/IconButton/IconButton"
import {
  formatDecimal,
  formatFullDay,
  formatShortDay,
} from "../../../../weight/format"
import { MEASUREMENTS } from "../../../../weight/measurements"
import type { WeightEntry } from "../../../../weight/types"

interface WeightEntryRowProps {
  entry: WeightEntry
  /** Suppression en cours : désactive les boutons de la ligne. */
  busy: boolean
  onEdit: () => void
  onDelete: () => void
}

/** Une pesée de l'historique : sa date, son poids, ses mesures, puis le crayon et la corbeille. */
export function WeightEntryRow({
  entry,
  busy,
  onEdit,
  onDelete,
}: WeightEntryRowProps) {
  const day = formatFullDay(entry.measuredOn)
  return (
    <tr>
      <th scope="row">{formatShortDay(entry.measuredOn)}</th>
      <td className="table-cell-number">{formatDecimal(entry.weightKg)}</td>
      {MEASUREMENTS.map(measurement => {
        const value = entry.measurements[measurement.id]
        return (
          <td key={measurement.id} className="table-cell-number">
            {value === null ? (
              // Un tiret à l'écran, des mots pour les lecteurs d'écran.
              <>
                <span aria-hidden="true">—</span>
                <span className="sr-only">Non mesuré</span>
              </>
            ) : (
              formatDecimal(value)
            )}
          </td>
        )
      })}
      <td>
        <div className="table-actions">
          <IconButton
            icon={pencilIcon}
            label={`Modifier la pesée du ${day}`}
            variant="secondary"
            busy={busy}
            onClick={onEdit}
          />
          <IconButton
            icon={trashIcon}
            label={`Supprimer la pesée du ${day}`}
            variant="secondary"
            busy={busy}
            onClick={onDelete}
          />
        </div>
      </td>
    </tr>
  )
}
