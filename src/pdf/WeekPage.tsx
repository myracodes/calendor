import { Canvas, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { INK, LINE, PAPER } from "../colors"
import { weekdayNames } from "../dates"
import { RainbowBar } from "./shared"

// Lignes pointillées façon bullet journal (points ronds via un pointillé quasi nul + bouts
// arrondis), dessinées à la volée : react-pdf n'a pas de motif de fond répétable natif.
// Même couleur que le nom du jour (INK) pour rester visible à l'impression.
const DOT_LINE_WIDTH = 1.2
const DOT_SPACE = 4
const ROW_HEIGHT = 22

// Liste de cases à cocher dans la case "Notes" : une case par ligne, suivie d'une ligne pointillée à écrire.
const CHECKBOX_SIZE = 8
const CHECKBOX_TO_LINE_GAP = 8

function paintDottedLines(painter: any, width: number, height: number) {
  painter.strokeColor(INK).lineCap("round").lineWidth(DOT_LINE_WIDTH).dash(0.01, { space: DOT_SPACE })
  for (let y = ROW_HEIGHT; y <= height; y += ROW_HEIGHT) {
    painter.moveTo(0, y).lineTo(width, y).stroke()
  }
  return null
}

function paintChecklist(painter: any, width: number, height: number) {
  const lineStartX = CHECKBOX_SIZE + CHECKBOX_TO_LINE_GAP
  const rowYs: number[] = []
  for (let y = 4; y + CHECKBOX_SIZE <= height; y += ROW_HEIGHT) rowYs.push(y)

  // Cases à cocher (traits pleins) d'abord, pour ne pas hériter du pointillé des lignes ci-dessous.
  painter.strokeColor(INK).lineWidth(0.75)
  for (const y of rowYs) {
    painter.rect(0, y, CHECKBOX_SIZE, CHECKBOX_SIZE).stroke()
  }

  // Lignes pointillées alignées sur le bas de chaque case à cocher.
  painter.lineCap("round").lineWidth(DOT_LINE_WIDTH).dash(0.01, { space: DOT_SPACE })
  for (const y of rowYs) {
    const bottomY = y + CHECKBOX_SIZE
    painter.moveTo(lineStartX, bottomY).lineTo(width, bottomY).stroke()
  }
  return null
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "PatrickHand",
    flexDirection: "column",
  },
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
  row: {
    flexDirection: "row",
    flexGrow: 1,
    borderTopWidth: 1,
    borderTopColor: LINE,
  },
  firstRow: {
    borderTopWidth: 0,
  },
  cell: {
    flex: 1,
    flexDirection: "column",
    borderLeftWidth: 1,
    borderLeftColor: LINE,
    padding: 6,
  },
  firstCell: {
    borderLeftWidth: 0,
  },
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

const [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY] = weekdayNames()

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
            <View key={rowIndex} style={rowIndex === 0 ? [styles.row, styles.firstRow] : styles.row}>
              {row.map((label, cellIndex) => (
                <View key={label} style={cellIndex === 0 ? [styles.cell, styles.firstCell] : styles.cell}>
                  <Text style={styles.cellLabel}>{label}</Text>
                  <Canvas style={styles.cellFill} paint={label === "Notes" ? paintChecklist : paintDottedLines} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </Page>
  )
}
