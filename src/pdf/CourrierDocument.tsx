import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { formatLieuDate } from "../courrier/format"
import type { CourrierSettings } from "../courrier/types"

const rightAlignedContentWidth = "33.33%"
// Mise en page d'un courrier à la française : expéditrice en haut à gauche,
// destinataire calée contre la marge droite (texte ferré à gauche),
// puis lieu/date, objet et corps.
const styles = StyleSheet.create({
  page: {
    fontFamily: "Carlito", // clone libre de Calibri : sobre et moderne, la police "courrier" par excellence
    fontSize: 11, // taille de corps classique d'un courrier
    lineHeight: 1.45, // interligne aéré, proche de celui d'un traitement de texte
    padding: 57, // marges de 2 cm (≈ 57 pt) sur les quatre côtés
  },
  // Bloc destinataire : aussi large que sa ligne la plus longue, texte ferré à gauche à l'intérieur.
  destinataire: {
    alignSelf: "flex-end", // le bloc se réduit à la largeur de son contenu et se cale contre la marge droite
    minWidth: rightAlignedContentWidth, // au moins le dernier tiers de la page : une adresse courte commence à la jonction 2/3
    marginTop: 28, // espace sous le bloc expéditrice
  },
  // Ligne "Paris, le 30 juillet 2023".
  lieuDate: {
    alignSelf: "flex-end", // calée contre la marge droite, alignée avec le bloc destinataire
    minWidth: rightAlignedContentWidth, // même largeur minimale que la destinataire, pour partager le même bord gauche
    marginTop: 28, // espace sous le bloc destinataire
  },
  // Ligne "Objet : …".
  objet: {
    marginTop: 28, // espace sous la ligne lieu/date
    fontWeight: "bold", // toute la ligne de l'objet en gras
  },
  // Le mot "Objet" seul, à l'intérieur de la ligne d'objet.
  objetLabel: {
    textDecoration: "underline", // seul ce mot est souligné
  },
  // Conteneur du texte du courrier.
  corps: {
    marginTop: 28, // espace sous l'objet
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
  const lieuDate = formatLieuDate(settings.lieu, settings.date)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Lignes texte={settings.expediteur.trim()} />
        </View>

        {settings.destinataire.trim() !== "" && (
          <View style={styles.destinataire}>
            <Lignes texte={settings.destinataire.trim()} />
          </View>
        )}

        {lieuDate !== "" && <Text style={styles.lieuDate}>{lieuDate}</Text>}

        {settings.objet.trim() !== "" && (
          <Text style={styles.objet}>
            <Text style={styles.objetLabel}>Objet</Text> : {settings.objet.trim()}
          </Text>
        )}

        <View style={styles.corps}>
          <Lignes texte={settings.corps.trim()} />
        </View>
      </Page>
    </Document>
  )
}
