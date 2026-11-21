import { Document, Page, StyleSheet, View } from "@react-pdf/renderer"
import { INK, PAPER } from "../../colors"
import { MONTH } from "../../constants/months"
import { backgroundForMonth } from "../shared/monthBackgrounds"
import { PageBackground } from "../shared/PageBackground"
import { MealWeek } from "./MealWeek"

const WEEKS_PER_PAGE = 2

const BACKGROUND = backgroundForMonth(MONTH.AVRIL)

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "PatrickHand",
    flexDirection: "column",
  },
  // Une moitié de la page A4 = une semaine, soit l'équivalent d'une page A5 paysage.
  // Chaque moitié porte sa propre marge et sa propre image de fond : une fois la
  // feuille coupée en deux, les deux A5 sont identiques.
  half: {
    flexGrow: 1,
    flexBasis: 0, // deux moitiés strictement égales, quel que soit leur contenu
    flexDirection: "column",
    padding: 8, // ≈ 3 mm : à peu près la marge minimale qu'une imprimante de bureau sait imprimer
  },
})

/** Document PDF "repas de la semaine" : une page A4 portrait avec une semaine par moitié. */
export function WeeklyMealsDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {Array.from({ length: WEEKS_PER_PAGE }, (_, weekIndex) => (
          <View key={weekIndex} style={styles.half}>
            <PageBackground src={BACKGROUND} orientation="portrait" half />
            <MealWeek />
          </View>
        ))}
      </Page>
    </Document>
  )
}
