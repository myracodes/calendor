import type { CalendarFormat } from "../types"

/**
 * Édition du calendrier :
 * - "french" : textes en français, jours fériés français, anniversaires et décès disponibles ;
 * - "international" : textes en anglais, ni jours fériés ni événements personnels (seuls les
 *   week-ends sont teintés), pour un usage hors de France.
 */
export type CalendarEdition = "french" | "international"

/**
 * Locale des noms de mois et de jours (Intl). Anglais britannique pour l'international :
 * la semaine y commence le lundi, comme les grilles du calendrier.
 */
export const EDITION_LOCALE: Record<CalendarEdition, string> = {
  french: "fr-FR",
  international: "en-GB",
}

/** Textes écrits en dur sur le PDF ou dans son nom de fichier, langues côte à côte. */
export const EDITION_TEXTS = {
  documentTitle: { french: "Calendrier", international: "Calendar" },
  // Code de langue en fin de nom du fichier PDF.
  fileLanguage: { french: "fr", international: "en" },
  // Nom du fichier PDF selon le format ; l'année y est ajoutée, sauf en hebdomadaire (pages sans date).
  fileName: {
    french: {
      monthly: "calendrier-mois",
      annual: "calendrier-année",
      weekly: "calendrier-hebdomadaire",
    },
    international: {
      monthly: "calendar-months",
      annual: "calendar-year",
      weekly: "weekly-calendar",
    },
  },
  // Abréviations usuelles de la page annuelle ; la casse est gérée par textTransform.
  monthAbbreviations: {
    french: [
      "janv.",
      "févr.",
      "mars",
      "avr.",
      "mai",
      "juin",
      "juil.",
      "août",
      "sept.",
      "oct.",
      "nov.",
      "déc.",
    ],
    international: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  // Initiale du jour de la semaine ; index 0 = lundi, 6 = dimanche (même convention que weekdayOf).
  weekdayInitials: {
    french: ["L", "M", "M", "J", "V", "S", "D"],
    international: ["M", "T", "W", "T", "F", "S", "S"],
  },
} satisfies Record<
  string,
  Record<CalendarEdition, string | string[] | Record<CalendarFormat, string>>
>
