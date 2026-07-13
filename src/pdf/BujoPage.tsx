import { Canvas, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { BujoColumn, BujoSettings } from "../bujo/types"
import { INK, LINE, PAPER } from "../colors"
import { paintCheckboxes, paintDottedLines } from "./paint"
import { RainbowBar } from "./shared"

// Largeurs des colonnes, en points : "case à cocher" et "petit" (une lettre) sont
// fixes, "moyen" (quelques mots) aussi ; "grand" se partage l'espace restant.
const COLUMN_WIDTHS = StyleSheet.create({
  checkbox: { width: 34 },
  small: { width: 44 },
  medium: { width: 130 },
  large: { flexGrow: 1 },
})

function columnWidth(column: BujoColumn) {
  return column.kind === "checkbox" ? COLUMN_WIDTHS.checkbox : COLUMN_WIDTHS[column.width]
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
  title: {
    fontFamily: "BadScript",
    fontSize: 18,
    marginBottom: 12,
  },
  // Cadre englobant tout le tableau, avec le liseré coloré des autres formats de page.
  table: {
    flexGrow: 1,
    flexDirection: "column",
    borderWidth: 1,
    borderColor: LINE,
  },
  tableAccent: {
    flexDirection: "row",
    height: 5,
  },
  columns: {
    flexGrow: 1,
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
    borderLeftWidth: 1,
    borderLeftColor: LINE,
  },
  firstColumn: {
    borderLeftWidth: 0,
  },
  // Hauteur fixe pour que les trames de toutes les colonnes démarrent alignées,
  // même si un intitulé est vide ou passe sur deux lignes.
  // alignItems centre la boîte du Text (nœud feuille mesuré à son contenu, qui ne
  // s'étire pas sur toute la colonne) ; textAlign ne suffit donc pas seul.
  columnHeader: {
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  columnLabel: {
    fontFamily: "BadScript",
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 2,
  },
  // La trame (pointillés ou cases à cocher) occupe tout le reste de la colonne.
  columnFill: {
    flexGrow: 1,
    marginHorizontal: 5,
  },
})

/** Page façon bullet journal : un tableau avec une colonne par item paramétré. */
export function BujoPage({ settings }: { settings: BujoSettings }) {
  return (
    <Page size="A4" orientation={settings.orientation} style={styles.page}>
      <View style={styles.pageContent}>
        {settings.title.trim() !== "" && <Text style={styles.title}>{settings.title}</Text>}
        <View style={styles.table}>
          <RainbowBar style={styles.tableAccent} />
          <View style={styles.columns}>
            {settings.columns.map((column, i) => (
              <View
                key={column.id}
                style={
                  i === 0
                    ? [styles.column, styles.firstColumn, columnWidth(column)]
                    : [styles.column, columnWidth(column)]
                }
              >
                <View style={styles.columnHeader}>
                  <Text style={styles.columnLabel}>{column.label}</Text>
                </View>
                <Canvas
                  style={styles.columnFill}
                  paint={column.kind === "checkbox" ? paintCheckboxes : paintDottedLines}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  )
}
