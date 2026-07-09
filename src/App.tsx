import { pdf } from "@react-pdf/renderer"
import { useState } from "react"
import "./App.css"
import { monthName, weekdayNames } from "./dates"
import { CalendarDocument } from "./pdf/CalendarDocument"
import { PRESETS } from "./presets"
import type { CalendarEvent, CalendarSettings, EventRule } from "./types"
import { COMMIT_HASH } from "./version"

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const WEEKDAYS = weekdayNames()
const CURRENT_YEAR = new Date().getFullYear()
const TODAY_ISO = new Date().toISOString().slice(0, 10)

type RuleKind = EventRule["kind"]

interface EventDraft {
  label: string
  kind: RuleKind
  weekdays: number[]
  interval: number
  anchor: string
  monthDay: number
  date: string
}

const EMPTY_DRAFT: EventDraft = {
  label: "",
  kind: "daily",
  weekdays: [],
  interval: 1,
  anchor: TODAY_ISO,
  monthDay: 1,
  date: `${CURRENT_YEAR}-01-01`,
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
      return `toutes les ${rule.interval} semaines le ${days} (à partir de la semaine du ${frenchDate(rule.anchor)})`
    }
    case "monthly":
      return `le ${rule.day} de chaque mois`
    case "once":
      return `le ${frenchDate(rule.date)}`
  }
}

export default function App() {
  const [settings, setSettings] = useState<CalendarSettings>({
    title: "",
    year: CURRENT_YEAR + 1,
    startMonth: 1,
    monthCount: 12,
    illustration: null,
    events: [],
  })
  const [draft, setDraft] = useState<EventDraft>(EMPTY_DRAFT)
  const [presetName, setPresetName] = useState(PRESETS[0]?.name ?? "")
  const [generating, setGenerating] = useState(false)

  function update<K extends keyof CalendarSettings>(key: K, value: CalendarSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

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
    }
    update("events", [...settings.events, event])
    setDraft(prev => ({ ...EMPTY_DRAFT, kind: prev.kind }))
  }

  function applyPreset(name: string) {
    const preset = PRESETS.find(p => p.name === name)
    if (!preset) return
    const existing = new Set(settings.events.map(event => `${event.rule.kind}:${event.label}`))
    const added = preset.events
      .filter(event => !existing.has(`${event.rule.kind}:${event.label}`))
      .map(event => ({ ...event, id: crypto.randomUUID() }))
    if (added.length > 0) {
      update("events", [...settings.events, ...added])
    }
  }

  function removeEvent(id: string) {
    update(
      "events",
      settings.events.filter(event => event.id !== id),
    )
  }

  function onIllustrationChange(file: File | undefined) {
    if (!file) {
      update("illustration", null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => update("illustration", reader.result as string)
    reader.readAsDataURL(file)
  }

  async function generatePdf() {
    setGenerating(true)
    try {
      const blob = await pdf(<CalendarDocument settings={settings} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${settings.title.trim() || "calendrier"}-${settings.year}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <main className="app">
      <h1>Calendor</h1>
      <p className="tagline">Générateur de calendriers personnalisés</p>

      <section className="card">
        <h2>Période</h2>
        <div className="row">
          <label>
            Titre du calendrier
            <input
              type="text"
              value={settings.title}
              placeholder="Mon calendrier"
              onChange={e => update("title", e.target.value)}
            />
          </label>
          <label>
            Année
            <input type="number" value={settings.year} onChange={e => update("year", Number(e.target.value))} />
          </label>
          <label>
            Premier mois
            <select value={settings.startMonth} onChange={e => update("startMonth", Number(e.target.value))}>
              {MONTHS.map(m => (
                <option key={m} value={m}>
                  {monthName(m)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Nombre de mois
            <input
              type="number"
              min={1}
              max={24}
              value={settings.monthCount}
              onChange={e => update("monthCount", Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
            />
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Illustration</h2>
        <label>
          Image affichée en haut de chaque page (PNG ou JPEG)
          <input type="file" accept="image/png,image/jpeg" onChange={e => onIllustrationChange(e.target.files?.[0])} />
        </label>
        {settings.illustration && (
          <img className="illustration-preview" src={settings.illustration} alt="Aperçu de l'illustration" />
        )}
      </section>

      <section className="card">
        <h2>Événements</h2>
        <div className="row preset-row">
          <label>
            Preset
            <select value={presetName} onChange={e => setPresetName(e.target.value)}>
              {PRESETS.map(preset => (
                <option key={preset.name} value={preset.name}>
                  {preset.name} — {preset.events.map(event => event.label).join(", ")}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => applyPreset(presetName)}>
            Appliquer le preset
          </button>
        </div>
        <div className="row">
          <label>
            Libellé
            <input
              type="text"
              value={draft.label}
              placeholder="Arroser les plantes"
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
          {draft.kind === "weekly" && (
            <>
              <div className="weekday-picker" role="group" aria-label="Jours de la semaine">
                <span className="picker-caption">Jours</span>
                <div className="weekday-options">
                  {WEEKDAYS.map((name, day) => (
                    <label key={name} className="weekday-option">
                      <input
                        type="checkbox"
                        checked={draft.weekdays.includes(day)}
                        onChange={() => toggleWeekday(day)}
                      />
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
              <li key={event.id}>
                <span>
                  <strong>{event.label}</strong> — {describeRule(event.rule)}
                </span>
                <button type="button" onClick={() => removeEvent(event.id)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" className="generate" disabled={generating} onClick={generatePdf}>
        {generating ? "Génération…" : "Générer le PDF"}
      </button>

      <footer style={{ marginTop: "2rem", textAlign: "center", color: "var(--ink-light)", fontSize: "0.85rem" }}>
        <p>v{COMMIT_HASH}</p>
      </footer>
    </main>
  )
}
