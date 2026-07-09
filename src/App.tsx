import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { CalendarDocument } from './pdf/CalendarDocument'
import { monthName } from './dates'
import type { CalendarEvent, CalendarSettings, EventRule } from './types'
import './App.css'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const CURRENT_YEAR = new Date().getFullYear()

type RuleKind = EventRule['kind']

interface EventDraft {
  label: string
  kind: RuleKind
  monthDay: number
  date: string
}

const EMPTY_DRAFT: EventDraft = {
  label: '',
  kind: 'daily',
  monthDay: 1,
  date: `${CURRENT_YEAR}-01-01`,
}

function buildRule(draft: EventDraft): EventRule {
  switch (draft.kind) {
    case 'daily':
      return { kind: 'daily' }
    case 'monthly':
      return { kind: 'monthly', day: draft.monthDay }
    case 'once':
      return { kind: 'once', date: draft.date }
  }
}

function describeRule(rule: EventRule): string {
  switch (rule.kind) {
    case 'daily':
      return 'tous les jours'
    case 'monthly':
      return `le ${rule.day} de chaque mois`
    case 'once':
      return `le ${rule.date.split('-').reverse().join('/')}`
  }
}

export default function App() {
  const [settings, setSettings] = useState<CalendarSettings>({
    title: '',
    year: CURRENT_YEAR + 1,
    startMonth: 1,
    monthCount: 12,
    illustration: null,
    events: [],
  })
  const [draft, setDraft] = useState<EventDraft>(EMPTY_DRAFT)
  const [generating, setGenerating] = useState(false)

  function update<K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K],
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function addEvent() {
    const label = draft.label.trim()
    if (!label) return
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      label,
      rule: buildRule(draft),
    }
    update('events', [...settings.events, event])
    setDraft((prev) => ({ ...EMPTY_DRAFT, kind: prev.kind }))
  }

  function removeEvent(id: string) {
    update(
      'events',
      settings.events.filter((event) => event.id !== id),
    )
  }

  function onIllustrationChange(file: File | undefined) {
    if (!file) {
      update('illustration', null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => update('illustration', reader.result as string)
    reader.readAsDataURL(file)
  }

  async function generatePdf() {
    setGenerating(true)
    try {
      const blob = await pdf(<CalendarDocument settings={settings} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${settings.title.trim() || 'calendrier'}-${settings.year}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <main className="app">
      <h1>Calendor</h1>
      <p className="tagline">Générateur de calendriers façon papier</p>

      <section className="card">
        <h2>Période</h2>
        <div className="row">
          <label>
            Titre du calendrier
            <input
              type="text"
              value={settings.title}
              placeholder="Mon calendrier"
              onChange={(e) => update('title', e.target.value)}
            />
          </label>
          <label>
            Année
            <input
              type="number"
              value={settings.year}
              onChange={(e) => update('year', Number(e.target.value))}
            />
          </label>
          <label>
            Premier mois
            <select
              value={settings.startMonth}
              onChange={(e) => update('startMonth', Number(e.target.value))}
            >
              {MONTHS.map((m) => (
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
              onChange={(e) =>
                update(
                  'monthCount',
                  Math.max(1, Math.min(24, Number(e.target.value) || 1)),
                )
              }
            />
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Illustration</h2>
        <label>
          Image affichée en haut de chaque page (PNG ou JPEG)
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => onIllustrationChange(e.target.files?.[0])}
          />
        </label>
        {settings.illustration && (
          <img
            className="illustration-preview"
            src={settings.illustration}
            alt="Aperçu de l'illustration"
          />
        )}
      </section>

      <section className="card">
        <h2>Événements</h2>
        <div className="row">
          <label>
            Libellé
            <input
              type="text"
              value={draft.label}
              placeholder="Arroser les plantes"
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, label: e.target.value }))
              }
              onKeyDown={(e) => e.key === 'Enter' && addEvent()}
            />
          </label>
          <label>
            Récurrence
            <select
              value={draft.kind}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  kind: e.target.value as RuleKind,
                }))
              }
            >
              <option value="daily">Quotidien</option>
              <option value="monthly">Mensuel</option>
              <option value="once">Date unique</option>
            </select>
          </label>
          {draft.kind === 'monthly' && (
            <label>
              Jour du mois
              <input
                type="number"
                min={1}
                max={31}
                value={draft.monthDay}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    monthDay: Math.max(
                      1,
                      Math.min(31, Number(e.target.value) || 1),
                    ),
                  }))
                }
              />
            </label>
          )}
          {draft.kind === 'once' && (
            <label>
              Date
              <input
                type="date"
                value={draft.date}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </label>
          )}
          <button type="button" onClick={addEvent}>
            Ajouter
          </button>
        </div>

        {settings.events.length > 0 && (
          <ul className="event-list">
            {settings.events.map((event) => (
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

      <button
        type="button"
        className="generate"
        disabled={generating}
        onClick={generatePdf}
      >
        {generating ? 'Génération…' : 'Générer le PDF'}
      </button>
    </main>
  )
}
