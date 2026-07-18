import { MY, QQ } from "./colors"
import { WEEKDAY, type Weekday } from "./constants/weekdays"
import type { CalendarSettings, EventRule } from "./types"

type PresetEvent = { label: string; rule: EventRule; color?: string }

// Semaine de référence pour toutes les tâches alternées ci-dessous (voir `alternating`).
const BASE_ANCHOR = "2026-01-01"

function addDaysIso(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

// Unité dans laquelle s'exprime le cycle d'une tâche alternée. La récurrence restant
// calée sur un jour fixe de la semaine (règle "weekly"), un "mois" vaut 4 semaines et
// une "année" 52 : les cycles longs dérivent donc légèrement du calendrier civil.
type CycleUnit = "jour" | "semaine" | "mois" | "année"

const DAYS_PER_UNIT: Record<CycleUnit, number> = {
  jour: 1,
  semaine: 7,
  mois: 28, // 4 semaines
  année: 364, // 52 semaines
}

// Construit les occurrences alternées (QQ / MY une fois sur deux chacune) d'une tâche récurrente.
// `cycleLength` × `cycleUnit` = temps entre deux occurrences de la tâche, exécutantes confondues :
// alternating("Lessive", "semaine", 1, …) = une lessive chaque semaine, chacune en fait donc une
// toutes les deux semaines.
// `myWeekday` permet à MY d'avoir un jour différent de QQ (ex. "Aspirateur" : lundi vs dimanche).
function alternating(
  label: string,
  cycleUnit: CycleUnit,
  cycleLength: number,
  weekday: Weekday,
  myWeekday: Weekday = weekday,
): PresetEvent[] {
  const days = cycleLength * DAYS_PER_UNIT[cycleUnit]
  // Intervalle de chaque personne (2 cycles), en semaines — la règle "weekly" exige un entier,
  // le cycle doit donc représenter un multiple de 3,5 jours (garde-fou pour l'unité "jour").
  const interval = (days / 7) * 2
  if (!Number.isInteger(interval)) {
    throw new Error(
      `alternating("${label}") : un cycle de ${days} jours ne tombe pas sur un nombre entier de semaines`,
    )
  }
  return [
    {
      label,
      rule: {
        kind: "weekly",
        weekdays: [weekday],
        interval,
        anchor: BASE_ANCHOR,
      },
      color: QQ,
    },
    {
      label,
      rule: {
        kind: "weekly",
        weekdays: [myWeekday],
        interval,
        anchor: addDaysIso(BASE_ANCHOR, days),
      },
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
export function applyPresetToSettings(
  settings: CalendarSettings,
  preset: Preset,
): CalendarSettings {
  const existing = new Set(
    settings.events.map(event => `${event.rule.kind}:${event.label}`),
  )
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
      {
        label: "piano · chant · duolingo",
        rule: { kind: "daily" },
        color: "#A5522B",
      },
      { label: "vitamine D", rule: { kind: "daily" }, color: "#246F29" },
      {
        label: "B12",
        rule: {
          kind: "weekly",
          weekdays: [WEEKDAY.DIMANCHE],
          interval: 1,
          anchor: "2026-01-01",
        },
        color: "#246F29",
      },
      {
        label: "Step 11h30",
        rule: {
          kind: "weekly",
          weekdays: [WEEKDAY.DIMANCHE],
          interval: 1,
          anchor: "2026-01-01",
        },
        color: "#DC3C0F",
      },
      {
        label: "arroser les plantes 🪴",
        rule: {
          kind: "weekly",
          weekdays: [WEEKDAY.LUNDI],
          interval: 1,
          anchor: "2026-01-01",
        },
        color: "#516F24",
      },
      {
        label: "lecture",
        rule: {
          kind: "weekly",
          weekdays: [WEEKDAY.DIMANCHE],
          interval: 1,
          anchor: "2026-01-01",
        },
        color: "#1073c4",
      },
      {
        label: "15 min de marche",
        rule: { kind: "daily" },
        color: "#1073c4",
      },
      {
        label: "chanson cahier musique",
        rule: { kind: "monthly", day: 1 },
        color: "#1073c4",
      },
      {
        label: "administratif",
        rule: { kind: "monthly", day: 1 },
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
      // alternating(libellé, unité du cycle, durée du cycle, jour de QQ, jour de MY si différent du jour de QQ)
      // Appartement entier
      ...alternating("Faire la poussière à fond", "mois", 1, WEEKDAY.LUNDI),
      ...alternating(
        "Poussières + aspirateur",
        "semaine",
        1,
        WEEKDAY.LUNDI,
        WEEKDAY.DIMANCHE,
      ),
      ...alternating("S", "semaine", 1, WEEKDAY.LUNDI, WEEKDAY.DIMANCHE),

      // Salle de bains
      ...alternating("Nettoyer le lavabo", "semaine", 1, WEEKDAY.JEUDI),
      ...alternating("Nettoyer la douche", "semaine", 1, WEEKDAY.MERCREDI),
      ...alternating("Nettoyer les toilettes", "semaine", 1, WEEKDAY.VENDREDI),
      ...alternating("Changer le tapis de bain", "semaine", 2, WEEKDAY.MARDI),
      ...alternating("Nettoyer les miroirs", "mois", 2, WEEKDAY.JEUDI),
      ...alternating(
        "Nettoyer le siphon de la douche",
        "mois",
        3,
        WEEKDAY.MARDI,
      ),

      // Toilettes
      ...alternating("Nettoyer les toilettes", "semaine", 1, WEEKDAY.VENDREDI),

      // Cuisine
      ...alternating(
        "Nettoyer l'évier de la cuisine",
        "semaine",
        1,
        WEEKDAY.LUNDI,
      ),
      ...alternating("Nettoyer le frigo", "mois", 1, WEEKDAY.SAMEDI),
      ...alternating("Nettoyer le four", "mois", 2, WEEKDAY.SAMEDI),
      ...alternating("Nettoyer le grille-pain", "mois", 1, WEEKDAY.JEUDI),
      ...alternating("Détartrer la bouilloire", "mois", 2, WEEKDAY.JEUDI),
      ...alternating("Nettoyer le frigo", "mois", 1, WEEKDAY.SAMEDI),
      ...alternating("Nettoyer le four", "mois", 2, WEEKDAY.SAMEDI),
      ...alternating("Nettoyer la desserte à épices", "mois", 2, WEEKDAY.JEUDI),
      ...alternating(
        "Nettoyer le lave-linge (hublot, tiroir)",
        "mois",
        1,
        WEEKDAY.MERCREDI,
      ),
      ...alternating(
        "Vider le filtre du lave-linge",
        "mois",
        1,
        WEEKDAY.MERCREDI,
      ),
      ...alternating(
        "Vider / nettoyer le filtre du lave-vaisselle",
        "semaine",
        2,
        WEEKDAY.LUNDI,
      ),

      // Linge
      ...alternating("Lessive", "semaine", 1, WEEKDAY.MARDI, WEEKDAY.SAMEDI),
      ...alternating(
        "Vider le filtre du lave-linge",
        "mois",
        1,
        WEEKDAY.MERCREDI,
      ),
      ...alternating(
        "Vider / nettoyer le filtre du lave-vaisselle",
        "semaine",
        2,
        WEEKDAY.LUNDI,
      ),

      // Salon
      ...alternating("Nettoyer les plaids", "mois", 2, WEEKDAY.DIMANCHE),
      ...alternating("Nettoyer la table basse", "semaine", 2, WEEKDAY.MERCREDI),

      // Chambre
      ...alternating(
        "Changer toute la parure de lit",
        "mois",
        1,
        WEEKDAY.SAMEDI,
      ),
      ...alternating(
        "Changer le drap housse du lit",
        "semaine",
        2,
        WEEKDAY.SAMEDI,
      ),
      ...alternating(
        "Passer la serpillère dans tout l'appartement",
        "semaine",
        1,
        WEEKDAY.MERCREDI,
      ),

      // Tâches ponctuelles
      ...alternating("Nettoyer les fenêtres", "mois", 6, WEEKDAY.SAMEDI),
      ...alternating(
        "Nettoyer l'évier de la cuisine",
        "semaine",
        1,
        WEEKDAY.LUNDI,
      ),
      ...alternating("Nettoyer le balcon détente", "mois", 6, WEEKDAY.DIMANCHE),
      ...alternating(
        "Nettoyer le balcon débarras",
        "mois",
        6,
        WEEKDAY.DIMANCHE,
      ),
      ...alternating(
        "Nettoyer le fauteuil du balcon",
        "mois",
        2,
        WEEKDAY.DIMANCHE,
      ),
      ...alternating(
        "Nettoyer les miroirs (chambre, entrée, salle de bains)",
        "semaine",
        2,
        WEEKDAY.JEUDI,
      ),
      ...alternating(
        "Nettoyer la porte de douche",
        "semaine",
        2,
        WEEKDAY.MARDI,
      ),
      ...alternating(
        "Nettoyer le receveur de douche",
        "semaine",
        1,
        WEEKDAY.MARDI,
      ),
      ...alternating(
        "Nettoyer le meuble de rangement dans la douche",
        "mois",
        1,
        WEEKDAY.MARDI,
      ),
      ...alternating(
        "Changer et nettoyer le tapis de bain",
        "semaine",
        2,
        WEEKDAY.MARDI,
      ),
    ],
  },
]
