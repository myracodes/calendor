import { Fragment, useState } from "react"
import { MONTH, type Month } from "../../../../constants/months"
import { monthOf } from "../../../../dates"
import { isSameDraft, toDraft } from "../../../../lifeEvents/drafts"
import type {
  LifeEventDraft,
  LifeEventEntry,
} from "../../../../lifeEvents/types"
import type { LifeEventsLibrary } from "../../../../lifeEvents/useLifeEvents"
import { isDraftComplete } from "../../../../lifeEvents/validation"
import {
  lifeEventTitle,
  monthSectionTitle,
} from "../../../../lifeEvents/wording"
import { Accordion } from "../../../../shared/Accordion/Accordion"
import { EntryForm } from "../../../../shared/EntryForm/EntryForm"
import type { useToast } from "../../../../shared/Toast/useToast"
import { LifeEventFields } from "../LifeEventFields/LifeEventFields"
import { LifeEventItem } from "../LifeEventItem/LifeEventItem"
import "./LifeEventList.css"

const MONTHS: Month[] = Object.values(MONTH)

interface LifeEventListProps {
  library: LifeEventsLibrary
  showToast: ReturnType<typeof useToast>["showToast"]
}

// Les anniversaires et décès, une section repliable par mois (seuls les mois
// qui en ont), chacun modifiable à sa place.
export function LifeEventList({ library, showToast }: LifeEventListProps) {
  const { entries } = library
  // Entrée ouverte dans l'éditeur (une seule à la fois).
  const [editing, setEditing] = useState<LifeEventDraft | null>(null)
  const monthGroups = MONTHS.map(month => ({
    month,
    entries: entries.filter(entry => entry.month === month),
  })).filter(group => group.entries.length > 0)
  const currentMonth = monthOf(new Date())

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

  function edit(entry: LifeEventEntry) {
    if (entry.id === editing?.id || !canLeaveEditing()) return
    setEditing(toDraft(entry))
  }

  function cancelEditing() {
    if (canLeaveEditing()) setEditing(null)
  }

  async function saveEditing() {
    if (editing === null) return
    const saved = await library.save(editing)
    setEditing(null)
    showToast("success", `${lifeEventTitle(saved)} enregistré.`)
  }

  async function undoRemove(entry: LifeEventEntry) {
    try {
      await library.restore(entry)
    } catch (caught) {
      showToast(
        "error",
        `${lifeEventTitle(entry)} non restauré : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `${lifeEventTitle(entry)} restauré.`)
  }

  // Depuis la corbeille d'une entrée, ou depuis son éditeur.
  async function remove(deleted: LifeEventEntry) {
    await library.remove(deleted.id)
    if (editing?.id === deleted.id) setEditing(null)
    showToast("success", `${lifeEventTitle(deleted)} supprimé.`, {
      label: "Annuler",
      onClick: () => undoRemove(deleted),
    })
  }

  if (entries.length === 0) {
    return <p className="hint">Aucun anniversaire enregistré.</p>
  }

  return (
    <div className="life-event-list-groups">
      {monthGroups.map((group, index) => (
        <Fragment key={group.month}>
          {index > 0 && <hr />}
          <Accordion
            title={monthSectionTitle(group.month, group.entries.length)}
            // Seul le mois en cours s'ouvre : ce sont les prochaines dates.
            defaultOpen={group.month === currentMonth}
          >
            <ul className="life-event-list">
              {group.entries.map(entry => (
                <li key={entry.id}>
                  {editing?.id === entry.id ? (
                    <EntryForm
                      submitLabel="Enregistrer"
                      canSubmit={
                        isDraftComplete(editing) &&
                        !isSameDraft(editing, toDraft(entry))
                      }
                      onSubmit={saveEditing}
                      onClose={cancelEditing}
                      deletion={{
                        label: "Supprimer",
                        confirmation: `Supprimer : ${lifeEventTitle(entry)} ?`,
                        onDelete: () => remove(entry),
                      }}
                    >
                      <div className="row row-compact">
                        <LifeEventFields
                          draft={editing}
                          onChange={setEditing}
                        />
                      </div>
                    </EntryForm>
                  ) : (
                    <LifeEventItem
                      entry={entry}
                      onEdit={() => edit(entry)}
                      onRemove={() => remove(entry)}
                      showToast={showToast}
                    />
                  )}
                </li>
              ))}
            </ul>
          </Accordion>
        </Fragment>
      ))}
    </div>
  )
}
