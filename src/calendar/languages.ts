import type { CalendarFormat } from "../types"

/**
 * Langue du PDF du calendrier.
 * Seul le français affiche les contenus propres à la France (jours fériés, anniversaires,
 * décès) ; les autres langues donnent un calendrier neutre, où seuls les week-ends sont teintés.
 */
export type CalendarLanguage = "fr" | "en" | "es" | "pt" | "it" | "ar" | "zh"

/**
 * Libellé dans le sélecteur de l'app, et locale Intl des noms de mois et de jours.
 * L'anglais est britannique : la semaine y commence le lundi, comme les grilles du calendrier.
 */
export const CALENDAR_LANGUAGES: Record<
  CalendarLanguage,
  { label: string; locale: string }
> = {
  fr: { label: "Français", locale: "fr-FR" },
  en: { label: "Anglais", locale: "en-GB" },
  es: { label: "Espagnol", locale: "es-ES" },
  pt: { label: "Portugais", locale: "pt-PT" },
  it: { label: "Italien", locale: "it-IT" },
  ar: { label: "Arabe", locale: "ar" },
  zh: { label: "Chinois", locale: "zh-CN" },
}

/**
 * Textes écrits en dur sur le PDF, langues côte à côte (les noms de mois et de jours viennent d'Intl).
 * Ajouter un texte en chinois oblige à regénérer la police chinoise (voir src/pdf/shared/shared.tsx).
 */
export const CALENDAR_TEXTS = {
  documentTitle: {
    fr: "Calendrier",
    en: "Calendar",
    es: "Calendario",
    pt: "Calendário",
    it: "Calendario",
    ar: "التقويم",
    zh: "日历",
  },
  // Intitulé de la case de notes de la page hebdomadaire.
  notes: {
    fr: "Notes",
    en: "Notes",
    es: "Notas",
    pt: "Notas",
    it: "Note",
    ar: "ملاحظات",
    zh: "笔记",
  },
} satisfies Record<string, Record<CalendarLanguage, string>>

/** Jours fériés, anniversaires et décès : réservés au calendrier en français. */
export function showsFrenchContent(language: CalendarLanguage): boolean {
  return language === "fr"
}

// Mots du nom de fichier, en anglais quelle que soit la langue du calendrier (noms uniformes).
const FILE_NAMES: Record<CalendarFormat, string> = {
  monthly: "calendar-months",
  annual: "calendar-year",
  weekly: "weekly-calendar",
}

/**
 * ex. "calendar-year-2026-fr.pdf", "calendar-months-2026-ar.pdf", "weekly-calendar-es.pdf"
 * (pas d'année en hebdomadaire : les pages n'ont pas de date).
 */
export function pdfFileName(
  language: CalendarLanguage,
  format: CalendarFormat,
  year: number,
): string {
  const name = FILE_NAMES[format]
  return format === "weekly"
    ? `${name}-${language}.pdf`
    : `${name}-${year}-${language}.pdf`
}
