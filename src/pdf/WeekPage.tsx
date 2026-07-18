import { Canvas, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { INK, LINE, PAPER } from "../colors"
import { weekdayNames } from "../dates"
import {
  CHECKBOX_SIZE,
  CHECKBOX_STROKE,
  DOT_LINE_WIDTH,
  DOT_SPACE,
  type Painter,
  paintDottedLines,
  ROW_HEIGHT,
} from "./paint"
import { RainbowBar } from "./shared"

// Liste de cases à cocher dans la case "Notes" : une case par ligne, suivie d'une ligne pointillée à écrire.
const CHECKBOX_TO_LINE_GAP = 8

function paintChecklist(painter: Painter, width: number, height: number) {
  const lineStartX = CHECKBOX_SIZE + CHECKBOX_TO_LINE_GAP
  const rowYs: number[] = []
  for (let y = 4; y + CHECKBOX_SIZE <= height; y += ROW_HEIGHT) rowYs.push(y)

  // Cases à cocher (traits pleins) d'abord, pour ne pas hériter du pointillé des lignes ci-dessous.
  painter.strokeColor(INK).lineWidth(CHECKBOX_STROKE)
  for (const y of rowYs) {
    painter.rect(0, y, CHECKBOX_SIZE, CHECKBOX_SIZE).stroke()
  }

  // Lignes pointillées alignées sur le bas de chaque case à cocher.
  painter
    .lineCap("round")
    .lineWidth(DOT_LINE_WIDTH)
    .dash(0.01, { space: DOT_SPACE })
  for (const y of rowYs) {
    const bottomY = y + CHECKBOX_SIZE
    painter.moveTo(lineStartX, bottomY).lineTo(width, bottomY).stroke()
  }
  return null
}

const styles = StyleSheet.create({
  // Fond de la page.
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "PatrickHand",
    flexDirection: "column",
  },
  // Conteneur de tout le contenu, avec la marge de la page.
  pageContent: {
    flexGrow: 1,
    flexDirection: "column",
    padding: 24,
  },
  // Cadre englobant toute la grille de la semaine (2 lignes de 4 cases).
  grid: {
    flexGrow: 1,
    flexDirection: "column",
    borderWidth: 1,
    borderColor: LINE,
  },
  // Liseré coloré en haut de la grille, comme sur les autres formats de page.
  gridAccent: {
    flexDirection: "row",
    height: 5,
  },
  // Une ligne de la grille = 4 cases côte à côte (voir ROWS : jours, puis "Notes").
  row: {
    flexDirection: "row",
    flexGrow: 1,
    borderTopWidth: 1,
    borderTopColor: LINE,
  },
  // La toute première ligne n'a pas de bordure supérieure (déjà celle de la grille).
  firstRow: {
    borderTopWidth: 0,
  },
  // Une case de la grille : nom du jour (ou "Notes") + trame à remplir.
  cell: {
    flex: 1,
    flexDirection: "column",
    borderLeftWidth: 1,
    borderLeftColor: LINE,
    padding: 6,
  },
  // La toute première case d'une ligne n'a pas de bordure gauche (déjà celle de la grille).
  firstCell: {
    borderLeftWidth: 0,
  },
  // Intitulé en haut de la case : nom du jour, ou "Notes".
  cellLabel: {
    fontFamily: "BadScript",
    fontSize: 12,
    textTransform: "capitalize",
    marginBottom: 4,
  },
  // La trame (points ou cases à cocher) occupe tout l'espace restant de la case.
  cellFill: {
    flexGrow: 1,
  },
})

const [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY] =
  weekdayNames()

// Modèle générique et sans date : chaque page de "Calendrier vierge" hebdomadaire est identique.
const ROWS: string[][] = [
  [MONDAY, TUESDAY, WEDNESDAY, THURSDAY],
  [FRIDAY, SATURDAY, SUNDAY, "Notes"],
]

/** Page hebdomadaire vierge (grille pointillée type bullet journal), sans date associée. */
export function WeekPage() {
  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.pageContent}>
        <View style={styles.grid}>
          <RainbowBar style={styles.gridAccent} />
          {ROWS.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={
                rowIndex === 0 ? [styles.row, styles.firstRow] : styles.row
              }
            >
              {row.map((label, cellIndex) => (
                <View
                  key={label}
                  style={
                    cellIndex === 0
                      ? [styles.cell, styles.firstCell]
                      : styles.cell
                  }
                >
                  <Text style={styles.cellLabel}>{label}</Text>
                  <Canvas
                    style={styles.cellFill}
                    paint={
                      label === "Notes" ? paintChecklist : paintDottedLines
                    }
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </Page>
  )
}
