import { LIBRARY, MARKET, POOL } from "../colors"
import { WEEKDAY } from "../constants/weekdays"
import type { Schedule } from "./schedules.type"

/**
 * Horaires et rendez-vous hebdomadaires (marché, bibliothèque, commerces…)
 * affichés sous le nom de chaque jour de la semaine.
 */
export const SCHEDULES: Schedule[] = [
  { name: "Marché", weekday: WEEKDAY.MERCREDI, color: MARKET },
  { name: "Marché", weekday: WEEKDAY.SAMEDI, color: MARKET },
  { name: "L'écume", weekday: WEEKDAY.VENDREDI, hours: "14h-18h" },
  { name: "L'écume", weekday: WEEKDAY.SAMEDI, hours: "11h-19h" },
  { name: "Bibliothèque", weekday: WEEKDAY.MARDI, hours: "15h-20h", color: LIBRARY },
  { name: "Bibliothèque", weekday: WEEKDAY.MERCREDI, hours: "10h-18h", color: LIBRARY },
  { name: "Bibliothèque", weekday: WEEKDAY.JEUDI, hours: "15h-20h", color: LIBRARY },
  { name: "Bibliothèque", weekday: WEEKDAY.VENDREDI, hours: "15h-18h", color: LIBRARY },
  { name: "Bibliothèque", weekday: WEEKDAY.SAMEDI, hours: "10h-18h", color: LIBRARY },
  { name: "Piscine", weekday: WEEKDAY.LUNDI, hours: "12h-13h30 et 18h-19h30", color: POOL },
  { name: "Piscine", weekday: WEEKDAY.MARDI, hours: "12h-13h30", color: POOL },
  { name: "Piscine", weekday: WEEKDAY.MERCREDI, hours: "12h-19h30", color: POOL },
  { name: "Piscine", weekday: WEEKDAY.JEUDI, hours: "12h-13h30 et 18h-19h30", color: POOL },
  { name: "Piscine", weekday: WEEKDAY.VENDREDI, hours: "12h-13h30 et 18h-20h30", color: POOL },
  { name: "Piscine", weekday: WEEKDAY.SAMEDI, hours: "14h30-17h30", color: POOL },
  { name: "Piscine", weekday: WEEKDAY.DIMANCHE, hours: "9h-12h30", color: POOL },
]

/** Horaires récurrents pour un jour de la semaine donné (0 = lundi … 6 = dimanche). */
export function schedulesForWeekday(weekday: number): Schedule[] {
  return SCHEDULES.filter(schedule => schedule.weekday === weekday)
}

// Horaires piscine étendus, à implémenter plus tard :
// Période scolaire
// Lundi : 12h-13h30 et 18h-19h30
// Mardi : 12h-13h30
// Mercredi : 12h-19h30
// Jeudi : 12h-13h30 et 18h-19h30
// Vendredi : 12h-13h30 et 18h-20h30
// Samedi : 14h30-17h30
// Dimanche : 9h-12h30
// Le bassin ludique est fermé : du lundi au jeudi de 12h15 à 13h.

// Vacances scolaires de la Toussaint, de février et de printemps
// Lundi au vendredi : 12h-13h30 et 15h-18h30
// Samedi et dimanche : 10h-12h30 et 14h-17h

// Vacances scolaires d'été
// Du lundi au vendredi : 11h - 13h30 et 14h30- 19h30
// Samedi et dimanche : 10h-13h30 et 14h30- 18h30

// Fermeture de la piscine
// Les jours fériés (y compris les dimanches de Pâques et de Pentecôte) sauf le 14 juillet et le 15 août.
