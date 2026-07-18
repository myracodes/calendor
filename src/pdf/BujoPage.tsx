import { Canvas, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { BujoColumn, BujoSettings } from "../bujo/types"
import { INK, LINE, PAPER } from "../colors"
import { PageBackground } from "./PageBackground"
import { paintCheckboxes, paintDottedLines } from "./paint"
import { RainbowBar, SURFACE } from "./shared"

// Largeurs des colonnes, en points : "case à cocher" et "petit" (une lettre) sont
// fixes, "moyen" (quelques mots) aussi ; "grand" se partage l'espace restant.
const COLUMN_WIDTHS = StyleSheet.create({
  checkbox: { width: 34 },
  small: { width: 44 },
  medium: { width: 130 },
  large: { flexGrow: 1 },
})

function columnWidth(column: BujoColumn) {
  return column.kind === "checkbox"
    ? COLUMN_WIDTHS.checkbox
    : COLUMN_WIDTHS[column.width]
}

const styles = StyleSheet.create({
  // Fond de la page (couleur de secours visible sous l'image de fond, le temps qu'elle charge).
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "PatrickHand",
    flexDirection: "column",
  },
  // Conteneur de tout le contenu (au-dessus de l'image de fond), avec la marge de la page.
  pageContent: {
    flexGrow: 1,
    flexDirection: "column",
    padding: 24,
  },
  // Titre de la page (settings.title), au-dessus du tableau — absent si le titre est vide.
  title: {
    fontFamily: "BadScript",
    fontSize: 18,
    marginBottom: 12,
  },
  // Cadre englobant tout le tableau, avec le liseré coloré des autres formats de page.
  // Fond légèrement translucide pour rester lisible par-dessus une image de fond.
  table: {
    flexGrow: 1,
    flexDirection: "column",
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: LINE,
  },
  // Liseré coloré en haut du tableau, comme sur les cartes de l'app.
  tableAccent: {
    flexDirection: "row",
    height: 5,
  },
  // Rangée contenant toutes les colonnes du tableau, sur toute la hauteur restante.
  columns: {
    flexGrow: 1,
    flexDirection: "row",
  },
  // Une colonne du tableau = un item paramétré : son en-tête + sa trame (largeur via columnWidth).
  column: {
    flexDirection: "column",
    borderLeftWidth: 1,
    borderLeftColor: LINE,
  },
  // La toute première colonne n'a pas de bordure gauche (déjà celle du tableau).
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
  // Intitulé de la colonne dans son en-tête (textAlign centre les intitulés sur plusieurs lignes).
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
      {settings.illustration && (
        <PageBackground
          src={settings.illustration}
          orientation={settings.orientation}
        />
      )}
      <View style={styles.pageContent}>
        {settings.title.trim() !== "" && (
          <Text style={styles.title}>{settings.title}</Text>
        )}
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
                  paint={
                    column.kind === "checkbox"
                      ? paintCheckboxes
                      : paintDottedLines
                  }
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  )
}
