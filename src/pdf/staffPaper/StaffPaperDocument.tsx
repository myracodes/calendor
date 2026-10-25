import { Document, Page, StyleSheet, View } from "@react-pdf/renderer"
import { BLACK } from "../../colors"
import { STAFF_KINDS } from "../../staffPaper/staffKinds"
import type { StaffKind, StaffPaperSettings } from "../../staffPaper/types"

// Hauteur d'une portée selon son type : ses écarts entre lignes mis bout à bout.
const STAFF_HEIGHTS = Object.fromEntries(
  Object.entries(STAFF_KINDS).map(([kind, spec]) => [
    kind,
    StyleSheet.create({
      height: { height: (spec.lineCount - 1) * spec.lineSpacing },
    }).height,
  ]),
) as Record<StaffKind, { height: number }>

const styles = StyleSheet.create({
  page: {
    padding: 57, // 2 cm
  },
  // Colonne des portées, qui occupe toute la hauteur utile de la page.
  staves: {
    flexGrow: 1,
    justifyContent: "space-between", // portées réparties régulièrement jusqu'au bas de la page
  },
  // Une portée : ses lignes réparties sur sa hauteur (fixée par STAFF_HEIGHTS).
  staff: {
    justifyContent: "space-between",
  },
  // Une ligne de portée.
  staffLine: {
    height: 0.6, // trait fin, assez marqué pour rester visible à l'impression
    backgroundColor: BLACK,
  },
})

/** Document PDF "papier à musique" : une page A4 de portées ou de tablatures vierges. */
export function StaffPaperDocument({
  settings,
}: {
  settings: StaffPaperSettings
}) {
  const kind = STAFF_KINDS[settings.kind]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.staves}>
          {Array.from({ length: kind.staffCount }, (_, staffIndex) => (
            <View
              key={staffIndex}
              style={[styles.staff, STAFF_HEIGHTS[settings.kind]]}
            >
              {Array.from({ length: kind.lineCount }, (_, lineIndex) => (
                <View key={lineIndex} style={styles.staffLine} />
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
