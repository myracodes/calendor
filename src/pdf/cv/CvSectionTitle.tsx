import { StyleSheet, Text, View } from "@react-pdf/renderer"
import { CV_AMBER, CV_GOLD_LIGHT, CV_VIOLET, CV_WHITE } from "./cvTheme"

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start", // le souligné s'arrête à la fin du texte, pas de la colonne
    borderBottomWidth: 2,
    borderBottomColor: CV_GOLD_LIGHT, // décoratif uniquement : le titre reste lisible sans lui
    paddingBottom: 2,
    marginBottom: 8,
  },
  containerInverse: {
    borderBottomColor: CV_AMBER,
  },
  // Titre de section du CV, souligné d'un trait décoratif.
  text: {
    fontSize: 11,
    fontWeight: "bold",
    color: CV_VIOLET,
  },
  textInverse: {
    color: CV_WHITE,
  },
})

/**
 * Titre de section du CV, souligné d'un trait décoratif.
 * `inverse` : variante pour le fond violet de la colonne de gauche (ambre au lieu de violet/doré).
 */
export function CvSectionTitle({
  children,
  inverse = false,
}: {
  children: string
  inverse?: boolean
}) {
  return (
    <View
      style={
        inverse ? [styles.container, styles.containerInverse] : styles.container
      }
    >
      <Text style={inverse ? [styles.text, styles.textInverse] : styles.text}>
        {children}
      </Text>
    </View>
  )
}
