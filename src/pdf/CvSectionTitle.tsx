import { StyleSheet, Text, View } from "@react-pdf/renderer"
import { CV_AMBER, CV_GOLD_LIGHT, CV_VIOLET, CV_WHITE } from "./cvTheme"

const styles = StyleSheet.create({
  conteneur: {
    alignSelf: "flex-start", // le souligné s'arrête à la fin du texte, pas de la colonne
    borderBottomWidth: 2,
    borderBottomColor: CV_GOLD_LIGHT, // décoratif uniquement : le titre reste lisible sans lui
    paddingBottom: 2,
    marginBottom: 8,
  },
  conteneurInverse: {
    borderBottomColor: CV_AMBER,
  },
  texte: {
    fontSize: 13, // nettement au-dessus du corps de texte
    fontWeight: "bold", // BadScript, trop fine ici, est réservée au nom et au titre du CV (voir cvTheme.ts)
    color: CV_VIOLET,
  },
  texteInverse: {
    color: CV_WHITE,
  },
})

/**
 * Titre de section du CV, souligné d'un trait décoratif.
 * `inverse` : variante pour le fond violet de la colonne de gauche (ambre au lieu de violet/doré).
 */
export function CvSectionTitle({ children, inverse = false }: { children: string; inverse?: boolean }) {
  return (
    <View style={inverse ? [styles.conteneur, styles.conteneurInverse] : styles.conteneur}>
      <Text style={inverse ? [styles.texte, styles.texteInverse] : styles.texte}>{children}</Text>
    </View>
  )
}
