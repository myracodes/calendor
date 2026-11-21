import { Canvas, StyleSheet, Text, View } from "@react-pdf/renderer"
import { LINE } from "../../colors"
import { weekdayNames } from "../../dates"
import { MEAL_SECTIONS } from "../../weeklyMeals/mealSections"
import { type DotStyle, paintDottedLineCount } from "../shared/paint"
import { RainbowBar, SURFACE } from "../shared/shared"

// Points plus fins que la trame par défaut, à la mesure des lignes serrées de la grille.
const SMALL_DOTS: DotStyle = { size: 0.8, space: 2.5 }

const SECTION_PAINTERS = MEAL_SECTIONS.map(section =>
  paintDottedLineCount(section.lineCount, SMALL_DOTS),
)

const SECTION_ROW_BORDER = 1
const DAY_CELL_BOTTOM_PADDING = 4

// Place laissée aux lignes pointillées d'une section, proportionnelle à leur nombre :
// toutes les lignes à écrire ont ainsi le même écart, quelle que soit la section.
const SECTION_ROW_GROWS = MEAL_SECTIONS.map(
  section => StyleSheet.create({ grow: { flexGrow: section.lineCount } }).grow,
)

const DAY_NAMES = weekdayNames()

const styles = StyleSheet.create({
  // Cadre d'une semaine : en-tête des jours + une ligne par section de la journée.
  // Fond translucide pour rester lisible par-dessus l'image de fond.
  week: {
    flexGrow: 1,
    flexDirection: "column",
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: LINE,
  },
  // Liseré arc-en-ciel en haut du cadre.
  weekAccent: {
    flexDirection: "row",
    height: 3,
  },
  // Ligne d'en-tête : la case vide au-dessus des intitulés, puis le nom des 7 jours.
  headerRow: {
    flexDirection: "row",
  },
  // Ligne d'une section (Petit déjeuner, Déjeuner…) : son intitulé, puis une case par jour.
  sectionRow: {
    flexDirection: "row",
    // Hauteur fixe = la bordure + la marge du bas des cases ; le reste est réparti
    // selon SECTION_ROW_GROWS, et revient donc entièrement aux lignes pointillées.
    flexBasis: SECTION_ROW_BORDER + DAY_CELL_BOTTOM_PADDING,
    borderTopWidth: SECTION_ROW_BORDER,
    borderTopColor: LINE,
  },
  // Colonne des intitulés de section, à gauche de la grille (vide dans l'en-tête).
  // 34 pt de texte : moins que "Petit déjeuner" (≈ 43 pt), qui passe donc sur deux
  // lignes, mais plus que le mot le plus long, "Déjeuner" (≈ 28 pt).
  labelColumn: {
    width: 40,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  // Intitulé d'une section.
  sectionLabel: {
    fontFamily: "BadScript",
    fontSize: 9,
  },
  // Case d'en-tête d'un jour.
  dayHeader: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 2, // équilibre les ≈ 3 pt vides que BadScript laisse au-dessus des lettres
    borderLeftWidth: 1,
    borderLeftColor: LINE,
  },
  // Nom du jour ("lundi"…), dans sa case d'en-tête.
  dayName: {
    fontFamily: "BadScript",
    fontSize: 9,
    // react-pdf pose la ligne de base à l'ascent de la police (≈ 12 pt) quelle que soit la
    // hauteur de ligne : 1.4 (≈ 12,6 pt) coupe le vide sous les lettres sans les rogner.
    lineHeight: 1.4,
    textTransform: "capitalize",
  },
  // Case d'un jour pour une section : ses lignes pointillées.
  dayCell: {
    flex: 1,
    paddingHorizontal: 5,
    paddingBottom: DAY_CELL_BOTTOM_PADDING,
    borderLeftWidth: 1,
    borderLeftColor: LINE,
  },
  // Les lignes pointillées occupent toute la case.
  dayCellFill: {
    flexGrow: 1,
  },
})

/** Grille d'une semaine de repas : les jours en colonnes, les sections de la journée en lignes. */
export function MealWeek() {
  return (
    <View style={styles.week}>
      <RainbowBar style={styles.weekAccent} />
      <View style={styles.headerRow}>
        <View style={styles.labelColumn} />
        {DAY_NAMES.map(dayName => (
          <View key={dayName} style={styles.dayHeader}>
            <Text style={styles.dayName}>{dayName}</Text>
          </View>
        ))}
      </View>
      {MEAL_SECTIONS.map((section, sectionIndex) => (
        <View
          key={section.label}
          style={[styles.sectionRow, SECTION_ROW_GROWS[sectionIndex]]}
        >
          <View style={styles.labelColumn}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
          </View>
          {DAY_NAMES.map(dayName => (
            <View key={dayName} style={styles.dayCell}>
              <Canvas
                style={styles.dayCellFill}
                paint={SECTION_PAINTERS[sectionIndex]}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
