// Lignes de la grille du planning : l'intitulé d'un mois en tête de la grille
// et avant chaque 1er du mois, puis une ligne par jour.

/** L'intitulé d'un mois, posé sur sa propre ligne au-dessus de son premier jour affiché. */
export interface MonthHeaderRow {
  /** Premier jour affiché du mois, au format ISO « aaaa-mm-jj ». */
  firstDay: string
  /** Ligne de la grille, 1 = la première. */
  row: number
}

/** Un mois commence ici (`index` dans les jours affichés) : en tête de la grille, ou un 1er du mois. */
export function startsMonth(day: string, index: number): boolean {
  return index === 0 || day.endsWith("-01")
}

/**
 * Les lignes de la grille pour les jours affichés : les intitulés de mois, et
 * la ligne de chaque jour (`dayRows[i]` pour `days[i]`), décalée par les
 * intitulés posés au-dessus d'elle.
 */
export function gridRowsOf(days: string[]): {
  monthHeaders: MonthHeaderRow[]
  dayRows: number[]
} {
  const monthHeaders: MonthHeaderRow[] = []
  const dayRows: number[] = []
  let row = 1
  days.forEach((day, index) => {
    if (startsMonth(day, index)) {
      monthHeaders.push({ firstDay: day, row })
      row++
    }
    dayRows.push(row)
    row++
  })
  return { monthHeaders, dayRows }
}
