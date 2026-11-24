import { weekIndex } from "../../dates"
import type { LifeEvent } from "../../events/lifeEvents.type"
import { showsFrenchContent } from "../../calendar/languages"
import { OTHER_EVENTS } from "../../events/otherEvents"
import { publicHolidaysForYear } from "../../events/publicHolidays"
import { LIFE_EVENT_EMOJIS } from "../../lifeEvents/kinds"
import type { LifeEventEntry, LifeEventKind } from "../../lifeEvents/types"
import type { CalendarEvent, CalendarSettings } from "../../types"

export type CalendarLifeEventKey = LifeEventKind | "festive"

export interface CalendarLifeEventKind {
  key: CalendarLifeEventKey
  emoji?: string
  events: LifeEvent[]
  showAge: boolean
  isEnabled: (settings: CalendarSettings) => boolean
}

// Anniversaires, décès et jours festifs partagent le même mode de filtrage
// (par mois/jour) et de conditionnement (un booléen dans CalendarSettings).
// Anniversaires et décès viennent de la base (table life_events, onglet
// Anniversaires de la page Calendriers), les jours festifs du code.
// Pour ajouter un type d'événement de vie, ajouter une entrée ici (et le
// PNG Twemoji de l'emoji dans public/emoji/ si besoin d'un nouvel emoji).
export function lifeEventKinds(
  lifeEvents: LifeEventEntry[],
): CalendarLifeEventKind[] {
  const ofKind = (kind: LifeEventKind) =>
    lifeEvents.filter(event => event.kind === kind)
  return [
    {
      key: "birthday",
      emoji: LIFE_EVENT_EMOJIS.birthday,
      events: ofKind("birthday"),
      showAge: true,
      isEnabled: settings =>
        settings.includeBirthdays && showsFrenchContent(settings.language),
    },
    {
      key: "death",
      emoji: LIFE_EVENT_EMOJIS.death,
      events: ofKind("death"),
      showAge: false,
      isEnabled: settings =>
        settings.includeDeaths && showsFrenchContent(settings.language),
    },
    {
      key: "festive",
      events: OTHER_EVENTS,
      showAge: false,
      isEnabled: settings => settings.includeOtherEvents,
    },
  ]
}

/** Jours fériés teintés sur la grille : les français, aucun dans les autres langues. */
export function publicHolidaysFor(
  settings: CalendarSettings,
  year: number,
): LifeEvent[] {
  return showsFrenchContent(settings.language)
    ? publicHolidaysForYear(year)
    : []
}

export function lifeEventsForDay(
  events: LifeEvent[],
  month: number,
  day: number,
): LifeEvent[] {
  return events.filter(event => event.month === month && event.day === day)
}

/**
 * "🎂 Papi (1924 — 103 ans)" avec showAge, "🕯️ Bastien (2024)" sans.
 * Personne décédée (event.deathYear) : plus d'âge, "🎂 Papi (1924-2003)".
 * Rien entre parenthèses si l'année est inconnue.
 */
export function lifeEventLabel(
  emoji: string,
  event: LifeEvent,
  calendarYear: number,
  showAge: boolean,
): string {
  if (event.year === undefined) return `${emoji} ${event.name}`
  if (event.deathYear !== undefined) {
    return `${emoji} ${event.name} (${event.year}-${event.deathYear})`
  }
  const detail = showAge
    ? `${event.year} — ${calendarYear - event.year} ans`
    : `${event.year}`
  return `${emoji} ${event.name} (${detail})`
}

export function eventsForDay(
  events: CalendarEvent[],
  day: number,
  iso: string,
  weekday: number,
): CalendarEvent[] {
  return events.filter(event => {
    const rule = event.rule
    switch (rule.kind) {
      case "daily":
        return true
      case "weekly": {
        if (!rule.weekdays.includes(weekday)) return false
        if (rule.interval <= 1) return true
        const diff = weekIndex(iso) - weekIndex(rule.anchor)
        return ((diff % rule.interval) + rule.interval) % rule.interval === 0
      }
      case "monthly":
        return rule.day === day
      case "once":
        return rule.date === iso
    }
  })
}
