import { MY, QQ } from "./colors"
import type { CalendarSettings, EventRule } from "./types"

export interface Preset {
  name: string
  includeBirthdays?: boolean
  includeDeaths?: boolean
  includeOtherEvents?: boolean
  includeSchedules?: boolean
  // true si les événements de ce modèle (libellés/récurrences) n'ont de sens qu'en format mensuel — impose alors le mensuel et masque le sélecteur Format
  requiresMonthly?: boolean
  // dans certains presets (ex. "Planning ménage"), on ne souhaite pas afficher les événements de vie et les horaires,
  // donc on masque les cases à cocher correspondantes.
  hideEventsCheckboxes?: boolean
  events: { label: string; rule: EventRule; color?: string }[]
}

// Ajoute les événements d'un preset (sans doublons) et applique ses options d'affichage.
export function applyPresetToSettings(settings: CalendarSettings, preset: Preset): CalendarSettings {
  const existing = new Set(settings.events.map(event => `${event.rule.kind}:${event.label}`))
  const added = preset.events
    .filter(event => !existing.has(`${event.rule.kind}:${event.label}`))
    .map(event => ({ ...event, id: crypto.randomUUID() }))
  return {
    ...settings,
    includeBirthdays: Boolean(preset.includeBirthdays),
    includeDeaths: Boolean(preset.includeDeaths),
    includeOtherEvents: Boolean(preset.includeOtherEvents),
    includeSchedules: Boolean(preset.includeSchedules),
    events: [...settings.events, ...added],
  }
}

export const PRESETS: Preset[] = [
  {
    name: "To do list",
    includeBirthdays: true,
    includeDeaths: true,
    includeOtherEvents: true,
    includeSchedules: true,
    requiresMonthly: true,
    events: [
      { label: "piano · chant · duolingo", rule: { kind: "daily" }, color: "#A5522B" },
      { label: "vitamine D", rule: { kind: "daily" }, color: "#246F29" },
      {
        label: "B12",
        rule: { kind: "weekly", weekdays: [6], interval: 1, anchor: "2026-01-01" },
        color: "#246F29",
      },
      {
        label: "Step 11h30",
        rule: { kind: "weekly", weekdays: [6], interval: 1, anchor: "2026-01-01" },
        color: "#DC3C0F",
      },
      {
        label: "arroser les plantes 🪴",
        rule: { kind: "weekly", weekdays: [6], interval: 1, anchor: "2026-01-01" },
        color: "#516F24",
      },
    ],
  },
  {
    name: "Planning ménage",
    includeBirthdays: false,
    includeDeaths: false,
    includeOtherEvents: true,
    includeSchedules: false,
    requiresMonthly: true,
    hideEventsCheckboxes: true,
    events: [
      {
        label: "Aspirateur",
        rule: { kind: "weekly", weekdays: [0], interval: 2, anchor: "2026-01-01" },
        color: QQ,
      },
      {
        label: "Aspirateur",
        rule: { kind: "weekly", weekdays: [6], interval: 2, anchor: "2026-01-08" },
        color: MY,
      },
      {
        label: "Evier sdb",
        rule: { kind: "weekly", weekdays: [5], interval: 2, anchor: "2026-01-01" },
        color: QQ,
      },
      {
        label: "Evier sdb",
        rule: { kind: "weekly", weekdays: [5], interval: 2, anchor: "2026-01-08" },
        color: MY,
      },
      {
        label: "Lessive",
        rule: { kind: "weekly", weekdays: [1], interval: 2, anchor: "2026-01-01" },
        color: QQ,
      },
      {
        label: "Lessive",
        rule: { kind: "weekly", weekdays: [5], interval: 2, anchor: "2026-01-08" },
        color: MY,
      },
    ],
  },
]
