import type { StaffKind } from "./types"

export interface StaffKindSpec {
  label: string
  /** nombre de lignes d'une portée (une par corde pour une tablature) */
  lineCount: number
  /** écart entre deux lignes d'une portée, en points */
  lineSpacing: number
  /** nombre de portées sur une page A4 */
  staffCount: number
}

// Les tablatures ont des lignes plus espacées qu'une portée, pour laisser la
// place d'écrire les numéros de case ; la tablature guitare, plus haute avec
// ses six lignes, tient donc en moins d'exemplaires par page.
export const STAFF_KINDS: Record<StaffKind, StaffKindSpec> = {
  standard: {
    label: "Portée (5 lignes)",
    lineCount: 5,
    lineSpacing: 6,
    staffCount: 12,
  },
  guitarTab: {
    label: "Tablature guitare (6 lignes)",
    lineCount: 6,
    lineSpacing: 7,
    staffCount: 10,
  },
  ukuleleTab: {
    label: "Tablature ukulélé (4 lignes)",
    lineCount: 4,
    lineSpacing: 7,
    staffCount: 12,
  },
}
