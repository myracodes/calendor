import { weekIndex } from "../dates"
import { BIRTHDAYS } from "../events/birthdays"
import { DEATHS } from "../events/deaths"
import type { LifeEvent } from "../events/lifeEvents.type"
import { OTHER_EVENTS } from "../events/otherEvents"
import type { CalendarEvent, CalendarSettings } from "../types"

// Anniversaires, décès et jours festifs partagent le même mode de filtrage
// (par mois/jour) et de conditionnement (un booléen dans CalendarSettings).
// Pour ajouter un type d'événement de vie, ajouter une entrée ici (et le
// PNG Twemoji de l'emoji dans public/emoji/ si besoin d'un nouvel emoji).
export const LIFE_EVENT_KINDS = [
  {
    key: "birthday" as const,
    emoji: "🎂",
    events: BIRTHDAYS,
    showAge: true,
    isEnabled: (settings: CalendarSettings) => settings.includeBirthdays,
  },
  {
    key: "death" as const,
    emoji: "🕯️",
    events: DEATHS,
    showAge: false,
    isEnabled: (settings: CalendarSettings) => settings.includeDeaths,
  },
  {
    key: "festive" as const,
    events: OTHER_EVENTS,
    showAge: false,
    isEnabled: (settings: CalendarSettings) => settings.includeOtherEvents,
  },
]

export function lifeEventsForDay(events: LifeEvent[], month: number, day: number): LifeEvent[] {
  return events.filter(event => event.month === month && event.day === day)
}

/**
 * "🎂 Papi (1924 — 103 ans)" avec showAge, "🕯️ Bastien (2024)" sans.
 * Personne décédée (event.died) : plus d'âge, "🎂 Papi (1927-2003)" — ou année de
 * naissance seule si l'année de décès est inconnue.
 * Rien entre parenthèses si l'année est inconnue.
 */
export function lifeEventLabel(emoji: string, event: LifeEvent, calendarYear: number, showAge: boolean): string {
  if (event.year === undefined) return `${emoji} ${event.name}`
  if (event.died) {
    const detail = event.died.year === undefined ? `${event.year}` : `${event.year}-${event.died.year}`
    return `${emoji} ${event.name} (${detail})`
  }
  const detail = showAge ? `${event.year} — ${calendarYear - event.year} ans` : `${event.year}`
  return `${emoji} ${event.name} (${detail})`
}

export function eventsForDay(events: CalendarEvent[], day: number, iso: string, weekday: number): CalendarEvent[] {
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
