import { useState } from "react"
import { Card } from "../../../../shared/Card/Card"
import { Table } from "../../../../shared/Table/Table"
import type { useToast } from "../../../../shared/Toast/useToast"
import { isSameDraft, toDraft } from "../../../../weight/drafts"
import { MEASUREMENTS } from "../../../../weight/measurements"
import { sortNewestFirst } from "../../../../weight/order"
import type { WeightEntry, WeightEntryDraft } from "../../../../weight/types"
import type { WeightTracking } from "../../../../weight/useWeightTracking"
import { entryLabel } from "../../../../weight/wording"
import { WeightEntryRow } from "../WeightEntryRow/WeightEntryRow"
import { WeightEntryRowEditor } from "../WeightEntryRowEditor/WeightEntryRowEditor"

interface WeightHistoryCardProps {
  tracking: WeightTracking
  showToast: ReturnType<typeof useToast>["showToast"]
}

// Les pesées en tableau, la plus récente en premier : la date, le poids, les
// mesures, puis le crayon (la ligne passe en modification à sa place) et la
// corbeille. Rien à afficher tant qu'il n'y a pas de pesée.
export function WeightHistoryCard({
  tracking,
  showToast,
}: WeightHistoryCardProps) {
  const { entries, saveEntry, removeEntry, restoreEntry } = tracking
  // Pesée ouverte en modification (une seule à la fois).
  const [editing, setEditing] = useState<WeightEntryDraft | null>(null)
  // Pesée en cours de suppression, pour ne désactiver que ses boutons.
  const [pendingId, setPendingId] = useState<string | null>(null)

  function hasUnsavedChanges(): boolean {
    if (editing === null) return false
    const saved = entries.find(entry => entry.id === editing.id)
    return saved !== undefined && !isSameDraft(editing, toDraft(saved))
  }

  // Protège les modifications en cours avant de fermer l'éditeur ou d'en ouvrir un autre.
  function canLeaveEditing(): boolean {
    return (
      !hasUnsavedChanges() ||
      window.confirm("Abandonner les modifications en cours ?")
    )
  }

  function edit(entry: WeightEntry) {
    if (!canLeaveEditing()) return
    setEditing(toDraft(entry))
  }

  function cancelEditing() {
    if (canLeaveEditing()) setEditing(null)
  }

  async function saveEditing() {
    if (editing === null) return
    const saved = await saveEntry(editing)
    setEditing(null)
    showToast("success", `${entryLabel(saved)} enregistrée.`)
  }

  async function undoRemove(entry: WeightEntry) {
    try {
      await restoreEntry(entry)
    } catch (caught) {
      showToast(
        "error",
        `${entryLabel(entry)} non restaurée : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `${entryLabel(entry)} restaurée.`)
  }

  // Sans confirmation : le toast propose « Annuler ».
  async function remove(entry: WeightEntry) {
    setPendingId(entry.id)
    try {
      await removeEntry(entry.id)
    } catch (caught) {
      showToast(
        "error",
        `${entryLabel(entry)} non supprimée : ${(caught as Error).message}`,
      )
      return
    } finally {
      setPendingId(null)
    }
    showToast("success", `${entryLabel(entry)} supprimée.`, {
      label: "Annuler",
      onClick: () => undoRemove(entry),
    })
  }

  if (entries.length === 0) return null

  return (
    <Card>
      <h2>Historique</h2>
      <Table label="Historique des pesées">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col" className="table-cell-number">
              Poids
            </th>
            {MEASUREMENTS.map(measurement => (
              <th
                key={measurement.id}
                scope="col"
                className="table-cell-number"
              >
                {measurement.label}
              </th>
            ))}
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortNewestFirst(entries).map(entry =>
            editing?.id === entry.id ? (
              <WeightEntryRowEditor
                key={entry.id}
                entry={entry}
                draft={editing}
                onChange={setEditing}
                onSave={saveEditing}
                onClose={cancelEditing}
                showToast={showToast}
              />
            ) : (
              <WeightEntryRow
                key={entry.id}
                entry={entry}
                busy={pendingId === entry.id}
                onEdit={() => edit(entry)}
                onDelete={() => remove(entry)}
              />
            ),
          )}
        </tbody>
      </Table>
    </Card>
  )
}
