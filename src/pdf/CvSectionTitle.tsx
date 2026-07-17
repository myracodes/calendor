import { StyleSheet, Text, View } from "@react-pdf/renderer"
import { CV_AMBER, CV_GOLD_LIGHT, CV_VIOLET } from "./cvTheme"

const styles = StyleSheet.create({
  conteneur: {
    alignSelf: "flex-start", // le souligné s'arrête à la fin du texte au lieu de courir sur toute la colonne
    borderBottomWidth: 2, // souligné décoratif, signature visuelle du CV
    borderBottomColor: CV_GOLD_LIGHT, // doré clair sur fond blanc : décoratif uniquement, le titre reste lisible sans lui
    paddingBottom: 2, // petit espace entre le texte et son souligné
    marginBottom: 8, // espace entre le titre et le contenu de la section
  },
  conteneurInverse: {
    borderBottomColor: CV_AMBER, // sur le fond violet, le souligné passe en ambre
  },
  texte: {
    fontSize: 13, // taille des titres de section, nettement au-dessus du corps de texte
    fontWeight: "bold", // titres en gras (la manuscrite BadScript, trop fine ici, est réservée au nom et au titre du CV)
    color: CV_VIOLET, // violet principal du CV, sur fond blanc
  },
  texteInverse: {
    color: CV_AMBER, // sur le fond violet, le titre passe en ambre
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
