import { useState } from "react"
import { INK } from "../../colors"
import { weekdayNames } from "../../dates"
import { applyPresetToSettings, PRESETS } from "../../presets"
import type { CalendarEvent, CalendarSettings, EventRule, SettingsUpdater } from "../../types"
import "./ParametrageSection.css"

const WEEKDAYS = weekdayNames()
const CURRENT_YEAR = new Date().getFullYear()
const TODAY_ISO = new Date().toISOString().slice(0, 10)
const DEFAULT_PRESET_NAME = PRESETS[0]?.name ?? ""
/** Couleur de base des événements — proposée par défaut dans le sélecteur de couleur. */
const BASE_COLOR = INK

type RuleKind = EventRule["kind"]

interface EventDraft {
  label: string
  kind: RuleKind
  weekdays: number[]
  interval: number
  anchor: string
  monthDay: number
  date: string
  color: string
}

const EMPTY_DRAFT: EventDraft = {
  label: "",
  kind: "daily",
  weekdays: [],
  interval: 1,
  anchor: TODAY_ISO,
  monthDay: 1,
  date: `${CURRENT_YEAR}-01-01`,
  color: BASE_COLOR,
}

function buildRule(draft: EventDraft): EventRule {
  switch (draft.kind) {
    case "daily":
      return { kind: "daily" }
    case "weekly":
      return {
        kind: "weekly",
        weekdays: [...draft.weekdays].sort((a, b) => a - b),
        interval: draft.interval,
        anchor: draft.anchor,
      }
    case "monthly":
      return { kind: "monthly", day: draft.monthDay }
    case "once":
      return { kind: "once", date: draft.date }
  }
}

function frenchDate(iso: string): string {
  return iso.split("-").reverse().join("/")
}

function describeRule(rule: EventRule): string {
  switch (rule.kind) {
    case "daily":
      return "tous les jours"
    case "weekly": {
      const days = rule.weekdays.map(d => WEEKDAYS[d]).join(", ")
      if (rule.interval <= 1) return `chaque ${days}`
      return `toutes les ${rule.interval} semaines le ${days}`
    }
    case "monthly":
      return `le ${rule.day} de chaque mois`
    case "once":
      return `le ${frenchDate(rule.date)}`
  }
}

interface ParametrageSectionProps {
  settings: CalendarSettings
  onUpdate: SettingsUpdater
}

export function ParametrageSection({ settings, onUpdate }: ParametrageSectionProps) {
  const [draft, setDraft] = useState<EventDraft>(EMPTY_DRAFT)
  const [presetName, setPresetName] = useState(DEFAULT_PRESET_NAME)

  function toggleWeekday(day: number) {
    setDraft(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(day) ? prev.weekdays.filter(d => d !== day) : [...prev.weekdays, day],
    }))
  }

  function addEvent() {
    const label = draft.label.trim()
    if (!label) return
    if (draft.kind === "weekly" && draft.weekdays.length === 0) return
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      label,
      rule: buildRule(draft),
      color: draft.color === BASE_COLOR ? undefined : draft.color,
    }
    onUpdate("events", [...settings.events, event])
    setDraft(prev => ({ ...EMPTY_DRAFT, kind: prev.kind }))
  }

  function applyPreset(name: string) {
    const preset = PRESETS.find(p => p.name === name)
    if (!preset) return
    const next = applyPresetToSettings(settings, preset)
    onUpdate("events", next.events)
    onUpdate("includeBirthdays", next.includeBirthdays)
    onUpdate("includeDeaths", next.includeDeaths)
    onUpdate("includeOtherEvents", next.includeOtherEvents)
    onUpdate("includeSchedules", next.includeSchedules)
  }

  function removeEvent(id: string) {
    onUpdate(
      "events",
      settings.events.filter(event => event.id !== id),
    )
  }

  function resetPreset() {
    onUpdate("events", [])
    onUpdate("includeBirthdays", false)
    onUpdate("includeDeaths", false)
    onUpdate("includeOtherEvents", false)
    onUpdate("includeSchedules", false)
  }

  return (
    <section className="card card--sky">
      <h2>Paramétrage</h2>
      <div className="row row-divider">
        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={settings.includeBirthdays}
            onChange={e => onUpdate("includeBirthdays", e.target.checked)}
          />
          Anniversaires
        </label>
        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={settings.includeDeaths}
            onChange={e => onUpdate("includeDeaths", e.target.checked)}
          />
          Décès
        </label>
        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={settings.includeOtherEvents}
            onChange={e => onUpdate("includeOtherEvents", e.target.checked)}
          />
          Fêtes
        </label>
        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={settings.includeSchedules}
            onChange={e => onUpdate("includeSchedules", e.target.checked)}
          />
          Horaires
        </label>
      </div>
      <div className="row row-divider">
        <label>
          Preset
          <select value={presetName} onChange={e => setPresetName(e.target.value)}>
            {PRESETS.map(preset => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => applyPreset(presetName)}>
          Ajouter
        </button>
        <button type="button" className="btn-remove" onClick={resetPreset}>
          Réinitialiser
        </button>
      </div>
      <div className="row">
        <label>
          Libellé
          <input
            type="text"
            value={draft.label}
            placeholder="to do"
            onChange={e => setDraft(prev => ({ ...prev, label: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && addEvent()}
          />
        </label>
        <label>
          Récurrence
          <select
            value={draft.kind}
            onChange={e =>
              setDraft(prev => ({
                ...prev,
                kind: e.target.value as RuleKind,
              }))
            }
          >
            <option value="daily">Quotidien</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
            <option value="once">Date unique</option>
          </select>
        </label>
        <label className="color-field">
          Couleur
          <input
            type="color"
            value={draft.color}
            onChange={e => setDraft(prev => ({ ...prev, color: e.target.value }))}
          />
        </label>
        {draft.kind === "weekly" && (
          <>
            <div className="weekday-picker" role="group" aria-label="Jours de la semaine">
              <span className="picker-caption">Jours</span>
              <div className="weekday-options">
                {WEEKDAYS.map((name, day) => (
                  <label key={name} className="weekday-option">
                    <input type="checkbox" checked={draft.weekdays.includes(day)} onChange={() => toggleWeekday(day)} />
                    {name.slice(0, 3)}.
                  </label>
                ))}
              </div>
            </div>
            <label>
              Toutes les… (semaines)
              <input
                type="number"
                min={1}
                max={12}
                value={draft.interval}
                onChange={e =>
                  setDraft(prev => ({
                    ...prev,
                    interval: Math.max(1, Math.min(12, Number(e.target.value) || 1)),
                  }))
                }
              />
            </label>
            {draft.interval > 1 && (
              <label>
                Semaine de référence
                <input
                  type="date"
                  value={draft.anchor}
                  onChange={e => setDraft(prev => ({ ...prev, anchor: e.target.value }))}
                />
              </label>
            )}
          </>
        )}
        {draft.kind === "monthly" && (
          <label>
            Jour du mois
            <input
              type="number"
              min={1}
              max={31}
              value={draft.monthDay}
              onChange={e =>
                setDraft(prev => ({
                  ...prev,
                  monthDay: Math.max(1, Math.min(31, Number(e.target.value) || 1)),
                }))
              }
            />
          </label>
        )}
        {draft.kind === "once" && (
          <label>
            Date
            <input
              type="date"
              value={draft.date}
              onChange={e => setDraft(prev => ({ ...prev, date: e.target.value }))}
            />
          </label>
        )}
        <button type="button" onClick={addEvent}>
          Ajouter
        </button>
      </div>

      {settings.events.length > 0 && (
        <ul className="event-list">
          {settings.events.map(event => (
            <li key={event.id} style={{ borderLeftColor: event.color ?? BASE_COLOR }}>
              <span>
                <strong>{event.label}</strong> — {describeRule(event.rule)}
              </span>
              <button type="button" className="btn-remove" onClick={() => removeEvent(event.id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
