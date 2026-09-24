import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { formatLieuDate } from "../../courrier/format"
import type { CourrierSettings } from "../../courrier/types"

const rightAlignedContentWidth = "33.33%"
// Marges de la page : 2 cm (≈ 57 pt), ou ≈ 1,25 cm avec l'option "réduire les marges".
const regularMargin = 57
const reducedMargin = regularMargin - 18
// Écart entre les blocs de l'en-tête (expéditrice, destinataire, lieu/date, objet) et avant le corps.
const regularSpacing = 28
const reducedSpacing = regularSpacing - 10
// Mise en page d'un courrier à la française : expéditrice en haut à gauche,
// destinataire calée contre la marge droite (texte ferré à gauche),
// puis lieu/date, objet et corps.
const styles = StyleSheet.create({
  page: {
    fontFamily: "Carlito", // clone libre de Calibri : sobre et moderne, la police "courrier" par excellence
    fontSize: 11, // taille de corps classique d'un courrier
    lineHeight: 1.45, // interligne aéré, proche de celui d'un traitement de texte
    paddingVertical: regularMargin,
    paddingHorizontal: regularMargin,
  },
  // Option "réduire les marges verticales" : surcharge le haut et le bas de la page.
  pageMargesVerticalesReduites: {
    paddingVertical: reducedMargin,
  },
  // Option "réduire les marges horizontales" : surcharge les côtés de la page.
  pageMargesHorizontalesReduites: {
    paddingHorizontal: reducedMargin,
  },
  // Bloc destinataire : aussi large que sa ligne la plus longue, texte ferré à gauche à l'intérieur.
  destinataire: {
    alignSelf: "flex-end", // le bloc se réduit à la largeur de son contenu et se cale contre la marge droite
    minWidth: rightAlignedContentWidth, // au moins le dernier tiers de la page : une adresse courte commence à la jonction 2/3
    marginTop: regularSpacing, // espace sous le bloc expéditrice
  },
  // Option "réduire les écarts" : surcharge le marginTop de la destinataire, du lieu/date et de l'objet.
  ecartReduit: {
    marginTop: reducedSpacing,
  },
  // Ligne "Paris, le 30 juillet 2023".
  lieuDate: {
    alignSelf: "flex-end", // calée contre la marge droite, alignée avec le bloc destinataire
    minWidth: rightAlignedContentWidth, // même largeur minimale que la destinataire, pour partager le même bord gauche
    marginTop: regularSpacing, // espace sous le bloc destinataire
  },
  // Ligne "Objet : …".
  objet: {
    marginTop: regularSpacing, // espace sous la ligne lieu/date
    fontWeight: "bold", // toute la ligne de l'objet en gras
  },
  // Le mot "Objet" seul, à l'intérieur de la ligne d'objet.
  objetLabel: {
    textDecoration: "underline", // seul ce mot est souligné
  },
  // Conteneur du texte du courrier.
  corps: {
    marginTop: regularSpacing, // espace sous l'objet
  },
  // Option "justifier le texte" : appliquée au conteneur, héritée par chaque ligne du corps.
  corpsJustifie: {
    textAlign: "justify",
  },
})

/** Un bloc multi-lignes : une ligne de texte par ligne saisie (lignes vides conservées). */
function Lignes({ texte }: { texte: string }) {
  return texte.split("\n").map((ligne, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: lignes statiques, jamais réordonnées
    <Text key={i}>{ligne === "" ? " " : ligne}</Text>
  ))
}

/** Document PDF "courrier" : une lettre au format français sur une page A4. */
export function CourrierDocument({ settings }: { settings: CourrierSettings }) {
  const lieuDate = formatLieuDate(
    settings.lieu,
    settings.inclureDate ? settings.date : "",
  )
  const ecart = settings.ecartsReduits ? styles.ecartReduit : {}

  return (
    <Document>
      <Page
        size="A4"
        style={[
          styles.page,
          settings.margesVerticalesReduites
            ? styles.pageMargesVerticalesReduites
            : {},
          settings.margesHorizontalesReduites
            ? styles.pageMargesHorizontalesReduites
            : {},
        ]}
      >
        <View>
          <Lignes texte={settings.expediteur.trim()} />
        </View>

        {settings.destinataire.trim() !== "" && (
          <View style={[styles.destinataire, ecart]}>
            <Lignes texte={settings.destinataire.trim()} />
          </View>
        )}

        {lieuDate !== "" && (
          <Text style={[styles.lieuDate, ecart]}>{lieuDate}</Text>
        )}

        {settings.objet.trim() !== "" && (
          <Text style={[styles.objet, ecart]}>
            <Text style={styles.objetLabel}>Objet</Text> :{" "}
            {settings.objet.trim()}
          </Text>
        )}

        <View
          style={[
            styles.corps,
            settings.texteJustifie ? styles.corpsJustifie : {},
          ]}
        >
          <Lignes texte={settings.corps.trim()} />
        </View>
      </Page>
    </Document>
  )
}
