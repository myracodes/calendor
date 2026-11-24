import { MONTH, type Month } from "../../../../constants/months"
import { monthName } from "../../../../dates"
import {
  LIFE_EVENT_KIND_LABELS,
  LIFE_EVENT_KINDS,
} from "../../../../lifeEvents/kinds"
import type {
  LifeEventDraft,
  LifeEventKind,
} from "../../../../lifeEvents/types"
import { maxDayOf } from "../../../../lifeEvents/validation"

const MONTHS: Month[] = Object.values(MONTH)

interface LifeEventFieldsProps {
  draft: LifeEventDraft
  onChange: (draft: LifeEventDraft) => void
}

/**
 * Champs d'un anniversaire ou d'un décès, communs à l'ajout et à la
 * modification : le type, le nom, le jour et le mois, puis les années
 * facultatives. Sans conteneur : à poser dans une ligne (.row).
 */
export function LifeEventFields({ draft, onChange }: LifeEventFieldsProps) {
  return (
    <>
      <label>
        Type
        <select
          value={draft.kind}
          onChange={e =>
            onChange({ ...draft, kind: e.target.value as LifeEventKind })
          }
        >
          {LIFE_EVENT_KINDS.map(kind => (
            <option key={kind} value={kind}>
              {LIFE_EVENT_KIND_LABELS[kind]}
            </option>
          ))}
        </select>
      </label>
      <label>
        Nom
        <input
          type="text"
          placeholder="Maman"
          value={draft.name}
          onChange={e => onChange({ ...draft, name: e.target.value })}
        />
      </label>
      <label>
        Jour
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={maxDayOf(draft.month)}
          value={draft.day}
          onChange={e => onChange({ ...draft, day: e.target.value })}
        />
      </label>
      <label>
        Mois
        <select
          value={draft.month}
          onChange={e =>
            onChange({ ...draft, month: Number(e.target.value) as Month })
          }
        >
          {MONTHS.map(month => (
            <option key={month} value={month}>
              {monthName(month)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {draft.kind === "birthday" ? "Année de naissance" : "Année du décès"}
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={9999}
          value={draft.year}
          onChange={e => onChange({ ...draft, year: e.target.value })}
        />
      </label>
      {/* Anniversaire d'une personne disparue : le calendrier affiche « naissance-décès » au lieu de l'âge. */}
      {draft.kind === "birthday" && (
        <label>
          Année du décès
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={9999}
            value={draft.deathYear}
            onChange={e => onChange({ ...draft, deathYear: e.target.value })}
          />
        </label>
      )}
    </>
  )
}
