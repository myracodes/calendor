import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { CvData, CvPageNumber, Experience } from "../../cv/types"
import { CvExperience } from "./CvExperience"
import { CvSectionTitle } from "./CvSectionTitle"
import { CvIdentity, CvSidebarSections } from "./CvSidebar"
import {
  CONTENT_PADDING,
  CV_BODY_LINE_HEIGHT,
  CV_FONT,
  CV_FONT_DISPLAY,
  CV_TEXT,
  CV_VIOLET,
  CV_VIOLET_BG,
  TITLE_FONTSIZE,
  TITLE_PADDING_TOP,
} from "./cvTheme"

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
    width: "31%",
    backgroundColor: CV_VIOLET_BG,
    padding: 20,
    paddingTop: CONTENT_PADDING,
  },
  // main --> colonne de droite : expériences et side projects
  main: {
    flex: 1,
    padding: CONTENT_PADDING,
    paddingTop: TITLE_PADDING_TOP,
    paddingLeft: 20, // moins qu'à droite : l'aplat violet de la sidebar marque déjà la séparation
  },
  title: {
    // le titre du CV (nom + rôle) est le plus gros élément de la page
    fontFamily: CV_FONT_DISPLAY,
    fontSize: TITLE_FONTSIZE,
    color: CV_VIOLET,
    marginBottom: 4,
  },
  pitch: {
    fontSize: 9,
    lineHeight: CV_BODY_LINE_HEIGHT,
    marginBottom: 14,
  },
  pagination: {
    position: "absolute",
    bottom: 14,
    right: CONTENT_PADDING,
    fontSize: 7,
    color: CV_TEXT,
  },
})

/**
 * Une section de la colonne principale (expériences ou side projects) : son
 * titre puis un bloc par expérience. Rien du tout si la liste est vide — pas
 * de titre orphelin quand une page n'a aucun bloc de cette section.
 */
function ExperienceSection({
  title,
  experiences,
}: {
  title: string
  experiences: Experience[]
}) {
  if (experiences.length === 0) return null
  return (
    <>
      <CvSectionTitle>{title}</CvSectionTitle>
      {experiences.map(experience => (
        <CvExperience
          key={`${experience.role} / ${experience.employer}`}
          experience={experience}
        />
      ))}
    </>
  )
}

/**
 * Document PDF "CV" : une ou deux pages A4 portrait au style du CV d'origine
 * (violet/doré). La page 2 n'est rendue que si un pitch (ex. "pm", allégé
 * pour tenir sur une page) y laisse effectivement du contenu — sidebar,
 * expériences ou side projects — une fois résolu (voir CvPage.tsx).
 */
export function CvDocument({ cv }: { cv: CvData }) {
  const sidebarSections = (page: CvPageNumber) =>
    cv.sidebar.filter(section => section.page === page)
  const experiences = (page: CvPageNumber) =>
    cv.experiences.filter(experience => experience.page === page)
  const sideProjects = (page: CvPageNumber) =>
    cv.sideProjects.filter(project => project.page === page)

  const page2Sidebar = sidebarSections(2)
  const page2Experiences = experiences(2)
  const page2SideProjects = sideProjects(2)
  const hasPage2 =
    page2Sidebar.length > 0 ||
    page2Experiences.length > 0 ||
    page2SideProjects.length > 0

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
          <ExperienceSection
            title={cv.sectionTitles.experiences}
            experiences={experiences(1)}
          />
          <ExperienceSection
            title={cv.sectionTitles.sideProjects}
            experiences={sideProjects(1)}
          />
        </View>
        {hasPage2 && <Text style={styles.pagination}>1/2</Text>}
      </Page>

      {hasPage2 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.sidebar}>
            <CvSidebarSections sections={page2Sidebar} />
          </View>
          <View style={styles.main}>
            <ExperienceSection
              title={cv.sectionTitles.experiencesSuite}
              experiences={page2Experiences}
            />
            <ExperienceSection
              title={cv.sectionTitles.sideProjects}
              experiences={page2SideProjects}
            />
          </View>
          <Text style={styles.pagination}>2/2</Text>
        </Page>
      )}
    </Document>
  )
}
