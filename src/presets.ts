import type { CalendarSettings, EventRule } from "./types"

export interface Preset {
  name: string
  /** also turn on the birthdays from src/birthdays.ts */
  includeBirthdays?: boolean
  includeDeaths?: boolean
  events: { label: string; rule: EventRule }[]
}

/** Ajoute les événements d'un preset (sans doublons) et active ses options d'affichage. */
export function applyPresetToSettings(settings: CalendarSettings, preset: Preset): CalendarSettings {
  const existing = new Set(settings.events.map(event => `${event.rule.kind}:${event.label}`))
  const added = preset.events
    .filter(event => !existing.has(`${event.rule.kind}:${event.label}`))
    .map(event => ({ ...event, id: crypto.randomUUID() }))
  return {
    ...settings,
    includeBirthdays: settings.includeBirthdays || Boolean(preset.includeBirthdays),
    includeDeaths: settings.includeDeaths || Boolean(preset.includeDeaths),
    events: [...settings.events, ...added],
  }
}

export const PRESETS: Preset[] = [
  {
    name: "My",
    includeBirthdays: true,
    includeDeaths: true,
    events: [
      { label: "piano · chant · duolingo", rule: { kind: "daily" } },
      { label: "vitamine D", rule: { kind: "daily" } },
      { label: "Step 11h30", rule: { kind: "weekly", weekdays: [6], interval: 1, anchor: "2026-01-01" } },
      {
        label: "B12",
        rule: { kind: "weekly", weekdays: [6], interval: 1, anchor: "2026-01-01" },
      },
      {
        label: "arroser les plantes 🪴",
        rule: { kind: "weekly", weekdays: [6], interval: 1, anchor: "2026-01-01" },
      },
    ],
  },
  {
    name: "Ménage",
    events: [
      {
        label: "Aspirateur Quentin",
        rule: { kind: "weekly", weekdays: [0], interval: 2, anchor: "2026-01-01" },
      },
      {
        label: "Aspirateur Myriam",
        rule: { kind: "weekly", weekdays: [6], interval: 2, anchor: "2026-01-01" },
      },
    ],
  },
]
