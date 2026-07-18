import { Image, Link, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { CvData, SidebarSection } from "../cv/types"
import { CvRichText } from "./CvRichText"
import { CvSectionTitle } from "./CvSectionTitle"
import { CV_AMBER, CV_FONT_DISPLAY, CV_WHITE } from "./cvTheme"

const PHOTO_SIZE = 84 // diamètre de la photo/du rond en points

// Toute cette colonne a un fond violet (CV_VIOLET_BG, voir CvDocument.tsx) : les
// styles ci-dessous utilisent CV_WHITE / CV_AMBER, pas CV_TEXT / CV_VIOLET, pour rester lisibles dessus.
const styles = StyleSheet.create({
  // Nom en haut de la colonne, au-dessus de la photo.
  name: {
    fontFamily: CV_FONT_DISPLAY,
    fontSize: 22, // la font manuscrite paraît plus petite qu'une sans-serif à taille égale
    color: CV_WHITE,
    textAlign: "center",
    marginBottom: 8, // espace avant la photo
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2, // moitié du diamètre : cercle parfait
    alignSelf: "center",
    marginBottom: 10,
  },
  // Une ligne du bloc contact (email, téléphone, GitHub, LinkedIn…), sous la photo.
  contactLine: {
    fontSize: 10,
    color: CV_WHITE,
    textAlign: "center",
    marginBottom: 3,
  },
  // Variante des lignes de contact cliquables (email, téléphone, GitHub, LinkedIn).
  contactLink: {
    color: CV_AMBER,
    textDecoration: "underline", // signale que la ligne est cliquable
  },
  // Ligne d'infos pratiques (lieu, permis, dispo…), sous le bloc contact ; la plus discrète du bloc identité.
  personalInfo: {
    fontSize: 9,
    color: CV_WHITE,
    textAlign: "center",
    marginTop: 4, // espace après la dernière ligne de contact
    marginBottom: 14, // espace avant la première section (Formation, Compétences…)
  },
  // Conteneur d'une section de la colonne (Formation, Compétences…).
  section: {
    marginBottom: 12,
  },
  // Conteneur d'un item au sein d'une section (ex. un diplôme de Formation).
  item: {
    marginBottom: 7,
  },
  // Label en tête d'item, quand l'item en a un (ex. "Front-end :" dans Compétences).
  itemLabel: {
    fontSize: 9,
    fontWeight: "bold", // distingue le label du texte qui suit (aide aussi la lisibilité de l'ambre sur violet)
    color: CV_AMBER,
    marginBottom: 1, // espace avant le texte de l'item
  },
  // Une ligne du texte d'un item (une par élément du tableau `lines`, ex. chaque techno de Compétences).
  itemDetail: {
    fontSize: 9,
    color: CV_WHITE,
  },
})

/** Bloc d'identité en tête de la colonne de gauche : photo, nom, contact, infos pratiques. */
export function CvIdentity({ cv }: { cv: CvData }) {
  return (
    <View>
      <Text style={styles.name}>{cv.name}</Text>
      {cv.photo ? <Image style={styles.photo} src={cv.photo} /> : null}
      {cv.contact.map(line =>
        line.url === undefined ? (
          <Text key={line.text} style={styles.contactLine}>
            {line.text}
          </Text>
        ) : (
          <Link key={line.text} src={line.url} style={[styles.contactLine, styles.contactLink]}>
            {line.text}
          </Link>
        ),
      )}
      <Text style={styles.personalInfo}>{cv.personalInfo}</Text>
    </View>
  )
}

/** Colonne de gauche du CV : sections (Formation, Compétences…) d'une page donnée. */
export function CvSidebarSections({ sections }: { sections: SidebarSection[] }) {
  return (
    <View>
      {sections.map(section => (
        <View key={section.title} style={styles.section}>
          <CvSectionTitle inverse>{section.title}</CvSectionTitle>
          {section.items.map(item => (
            <View key={item.lines.join("\n")} style={styles.item}>
              {item.label !== undefined && <Text style={styles.itemLabel}>{item.label}</Text>}
              {item.lines.map(line => (
                <CvRichText key={line} inverse text={line} style={styles.itemDetail} />
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
