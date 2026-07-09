import type { EventRule } from "./types"

export interface Preset {
  name: string
  events: { label: string; rule: EventRule }[]
}

export const PRESETS: Preset[] = [
  {
    name: "My",
    events: [
      { label: "piano", rule: { kind: "daily" } },
      { label: "chant", rule: { kind: "daily" } },
      { label: "duolingo", rule: { kind: "daily" } },
      {
        label: "B12",
        rule: { kind: "weekly", weekdays: [6], interval: 1, anchor: "2026-01-01" },
      },
      {
        label: "arroser les plantes",
        rule: { kind: "weekly", weekdays: [6], interval: 1, anchor: "2026-01-01" },
      },
    ],
  },
]
