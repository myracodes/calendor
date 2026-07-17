import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { CvData, CvPageNumber } from "../cv/types"
import { CvExperience } from "./CvExperience"
import { CvIdentity, CvSidebarSections } from "./CvSidebar"
import { CvSectionTitle } from "./CvSectionTitle"
import { CV_FONT, CV_FONT_DISPLAY, CV_TEXT, CV_VIOLET, CV_VIOLET_BG } from "./cvTheme"

// Mise en page du CV : deux pages A4 portrait, chacune découpée en deux
// colonnes (sidebar à gauche, expériences à droite). Le contenu de chaque
// page est choisi via le champ `page` des blocs de src/cv/data.ts.
const styles = StyleSheet.create({
  page: {
    fontFamily: CV_FONT, // sans-serif arrondie du CV
    color: CV_TEXT, // couleur de texte par défaut
    flexDirection: "row", // deux colonnes côte à côte ; pas de padding : le fond violet file jusqu'aux bords
  },
  sidebar: {
    width: "31%", // colonne de gauche : un petit tiers de la page, comme dans le CV d'origine
    backgroundColor: CV_VIOLET_BG, // aplat violet du CV d'origine, sur toute la hauteur de la page
    padding: 20, // marges internes de la colonne violette
    paddingTop: 28, // alignée sur le haut de la colonne de droite
  },
  main: {
    flex: 1, // colonne de droite : tout l'espace restant
    padding: 28, // marges d'environ 1 cm : le CV d'origine est dense
    paddingLeft: 20, // un peu moins à gauche : l'aplat violet marque déjà la séparation
  },
  titre: {
    fontFamily: CV_FONT_DISPLAY, // manuscrite des grands titres
    fontSize: 24, // titre du CV, l'élément le plus gros de la page (la manuscrite paraît plus petite)
    color: CV_VIOLET, // violet principal du CV
    marginBottom: 6, // espace avant l'accroche
  },
  accroche: {
    fontSize: 9, // corps de texte
    lineHeight: 1.4, // interligne aéré pour le paragraphe d'introduction
    marginBottom: 12, // espace avant la section des expériences
  },
  pagination: {
    position: "absolute", // hors du flux, calé en pied de page
    bottom: 12, // à 12 pt du bord bas
    right: 28, // aligné sur la marge droite
    fontSize: 7.5, // très discret
    color: CV_TEXT, // texte courant
  },
})

/** Les expériences d'une page, précédées du titre de section (libellé dans la langue du CV). */
function Experiences({ cv, page }: { cv: CvData; page: CvPageNumber }) {
  const titre = page === 1 ? cv.sections.experiences : cv.sections.experiencesSuite
  return (
    <>
      <CvSectionTitle>{titre}</CvSectionTitle>
      {cv.experiences
        .filter(experience => experience.page === page)
        .map(experience => (
          <CvExperience key={experience.employeur} experience={experience} />
        ))}
    </>
  )
}

/** Les side projects d'une page, précédés du titre de section (rien si la page n'en a pas). */
function SideProjects({ cv, page }: { cv: CvData; page: CvPageNumber }) {
  const projects = cv.sideProjects.filter(project => project.page === page)
  if (projects.length === 0) return null
  return (
    <>
      <CvSectionTitle>{cv.sections.sideProjects}</CvSectionTitle>
      {projects.map(project => (
        <CvExperience key={project.poste} experience={project} />
      ))}
    </>
  )
}

/** Document PDF "CV" : deux pages A4 portrait au style du CV d'origine (violet/doré). */
export function CvDocument({ cv }: { cv: CvData }) {
  const sidebarSections = (page: CvPageNumber) => cv.sidebar.filter(section => section.page === page)

  return (
    <Document title={`CV - ${cv.nom}`} author={cv.nom}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <CvIdentity cv={cv} />
          <CvSidebarSections sections={sidebarSections(1)} />
        </View>
        <View style={styles.main}>
          <Text style={styles.titre}>{cv.titre}</Text>
          <Text style={styles.accroche}>{cv.accroche}</Text>
          <Experiences cv={cv} page={1} />
          <SideProjects cv={cv} page={1} />
        </View>
        <Text style={styles.pagination}>1/2</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <CvSidebarSections sections={sidebarSections(2)} />
        </View>
        <View style={styles.main}>
          <Experiences cv={cv} page={2} />
          <SideProjects cv={cv} page={2} />
        </View>
        <Text style={styles.pagination}>2/2</Text>
      </Page>
    </Document>
  )
}
