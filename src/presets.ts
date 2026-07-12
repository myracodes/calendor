import { MY, QQ } from "./colors"
import type { CalendarSettings, EventRule } from "./types"

type PresetEvent = { label: string; rule: EventRule; color?: string }

// Semaine de référence pour toutes les tâches alternées ci-dessous (voir `alternating`).
const BASE_ANCHOR = "2026-01-01"

function addDaysIso(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

// Construit les occurrences alternées (QQ / MY une fois sur deux chacune) d'une tâche
// récurrente : `days` est la durée du cycle complet en jours (multiple de 7, ex. 14 = une semaine
// sur deux au total) — exprimé en jours plutôt qu'en semaines pour pouvoir descendre sous les 7
// jours si besoin (tâche à faire plusieurs fois par semaine).
// `myWeekday` permet à MY d'avoir un jour différent de QQ (ex. "Aspirateur" : lundi vs dimanche).
function alternating(label: string, days: number, weekday: number, myWeekday: number = weekday): PresetEvent[] {
  const interval = (days / 7) * 2
  return [
    { label, rule: { kind: "weekly", weekdays: [weekday], interval, anchor: BASE_ANCHOR }, color: QQ },
    {
      label,
      rule: { kind: "weekly", weekdays: [myWeekday], interval, anchor: addDaysIso(BASE_ANCHOR, days) },
      color: MY,
    },
  ]
}

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
        rule: { kind: "weekly", weekdays: [0], interval: 1, anchor: "2026-01-01" },
        color: "#516F24",
      },
      {
        label: "lecture",
        rule: { kind: "weekly", weekdays: [6], interval: 1, anchor: "2026-01-01" },
        color: "#1073c4",
      },
      {
        label: "15 min de marche",
        rule: { kind: "daily" },
        color: "#1073c4",
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
      // alternating(libellé, durée du cycle en jours, jour de QQ, jour de MY si différent du jour de QQ)
      // jour : 0 = lundi … 6 = dimanche
      ...alternating("Aspirateur", 7, 0, 6),
      ...alternating("Evier sdb", 7, 5),
      ...alternating("Lessive", 7, 1, 5),
      ...alternating("Changer toute la parure de lit", 28, 5),
      ...alternating("Changer le drap housse du lit", 14, 5),
      ...alternating("Passer la serpillère dans tout l'appartement", 7, 2),
      ...alternating("Nettoyer les fenêtres", 56, 5),
      ...alternating("Nettoyer l'évier de la cuisine", 7, 0),
      ...alternating("Passer le balai / l'aspi sur les balcons", 14, 6),
      ...alternating("Nettoyer le fauteuil du balcon", 56, 6),
      ...alternating("Nettoyer les miroirs (chambre, entrée, salle de bains)", 14, 3),
      ...alternating("Nettoyer la porte de douche", 14, 1),
      ...alternating("Nettoyer le receveur de douche", 7, 1),
      ...alternating("Nettoyer le meuble de rangement dans la douche", 28, 1),
      ...alternating("Changer et nettoyer le tapis de bain", 14, 1),
      ...alternating("Nettoyer les toilettes", 7, 4),
      ...alternating("Nettoyer le siphon de la douche", 28, 1),
      ...alternating("Nettoyer les plaids", 56, 6),
      ...alternating("Nettoyer la table basse", 14, 2),
      ...alternating("Nettoyer le grille-pain", 28, 3),
      ...alternating("Détartrer la bouilloire", 56, 3),
      ...alternating("Nettoyer le frigo", 28, 5),
      ...alternating("Nettoyer le four", 56, 5),
      ...alternating("Faire la poussière à fond", 28, 0),
      ...alternating("Nettoyer la desserte à épices", 56, 3),
      ...alternating("Nettoyer le lave-linge (hublot, tiroir)", 28, 2),
      ...alternating("Vider le filtre du lave-linge", 28, 2),
      ...alternating("Vider / nettoyer le filtre du lave-vaisselle", 14, 0),
    ],
  },
]
