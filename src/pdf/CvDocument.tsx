import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { CvData, CvPageNumber, Experience } from "../cv/types"
import { CvExperience } from "./CvExperience"
import { CvIdentity, CvSidebarSections } from "./CvSidebar"
import { CvSectionTitle } from "./CvSectionTitle"
import { CV_BODY_LINE_HEIGHT, CV_FONT, CV_FONT_DISPLAY, CV_TEXT, CV_VIOLET, CV_VIOLET_BG } from "./cvTheme"

// Mise en page du CV : deux pages A4 portrait, chacune découpée en deux
// colonnes (sidebar à gauche, expériences à droite). Le contenu de chaque
// page est choisi via le champ `page` des blocs de src/cv/content/.
const styles = StyleSheet.create({
  page: {
    fontFamily: CV_FONT,
    color: CV_TEXT,
    flexDirection: "row", // pas de padding ici : le fond violet de la sidebar doit filer jusqu'aux bords de page
  },
  sidebar: {
    width: "31%", // proportion du CV d'origine
    backgroundColor: CV_VIOLET_BG,
    padding: 20,
    paddingTop: 28, // alignée sur le haut de la colonne principale
  },
  main: {
    flex: 1,
    padding: 28, // le CV d'origine est dense : marges resserrées (~1cm)
    paddingLeft: 20, // moins qu'à droite : l'aplat violet de la sidebar marque déjà la séparation
  },
  title: {
    fontFamily: CV_FONT_DISPLAY,
    fontSize: 24, // l'élément le plus gros de la page (la manuscrite paraît plus petite qu'une sans-serif à taille égale)
    color: CV_VIOLET,
    marginBottom: 6,
  },
  pitch: {
    fontSize: 9,
    lineHeight: CV_BODY_LINE_HEIGHT,
    marginBottom: 14,
  },
  pagination: {
    position: "absolute",
    bottom: 12,
    right: 28, // aligné avec le padding de main
    fontSize: 7.5,
    color: CV_TEXT,
  },
})

/**
 * Une section de la colonne principale (expériences ou side projects) : son
 * titre puis un bloc par expérience. Rien du tout si la liste est vide — pas
 * de titre orphelin quand une page n'a aucun bloc de cette section.
 */
function ExperienceSection({ title, experiences }: { title: string; experiences: Experience[] }) {
  if (experiences.length === 0) return null
  return (
    <>
      <CvSectionTitle>{title}</CvSectionTitle>
      {experiences.map(experience => (
        <CvExperience key={`${experience.role} / ${experience.employer}`} experience={experience} />
      ))}
    </>
  )
}

/** Document PDF "CV" : deux pages A4 portrait au style du CV d'origine (violet/doré). */
export function CvDocument({ cv }: { cv: CvData }) {
  const sidebarSections = (page: CvPageNumber) => cv.sidebar.filter(section => section.page === page)
  const experiences = (page: CvPageNumber) => cv.experiences.filter(experience => experience.page === page)
  const sideProjects = (page: CvPageNumber) => cv.sideProjects.filter(project => project.page === page)

  return (
    <Document title={`CV - ${cv.name}`} author={cv.name}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <CvIdentity cv={cv} />
          <CvSidebarSections sections={sidebarSections(1)} />
        </View>
        <View style={styles.main}>
          <Text style={styles.title}>{cv.title}</Text>
          <Text style={styles.pitch}>{cv.pitch}</Text>
          <ExperienceSection title={cv.sectionTitles.experiences} experiences={experiences(1)} />
          <ExperienceSection title={cv.sectionTitles.sideProjects} experiences={sideProjects(1)} />
        </View>
        <Text style={styles.pagination}>1/2</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <CvSidebarSections sections={sidebarSections(2)} />
        </View>
        <View style={styles.main}>
          <ExperienceSection title={cv.sectionTitles.experiencesSuite} experiences={experiences(2)} />
          <ExperienceSection title={cv.sectionTitles.sideProjects} experiences={sideProjects(2)} />
        </View>
        <Text style={styles.pagination}>2/2</Text>
      </Page>
    </Document>
  )
}
