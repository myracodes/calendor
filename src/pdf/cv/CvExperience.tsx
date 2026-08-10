import { StyleSheet, Text, View } from "@react-pdf/renderer"
import type { Experience, Project } from "../../cv/types"
import { CvRichText } from "./CvRichText"
import {
  CV_BODY_LINE_HEIGHT,
  CV_GOLD,
  CV_TEXT,
  CV_VIOLET,
  CV_VIOLET_SOFT,
} from "./cvTheme"

const styles = StyleSheet.create({
  block: {
    marginBottom: 14,
  },
  // Bloc englobant poste + employeur : les deux sont imbriqués dans un même
  // Text (voir CvExperience) pour s'écouler comme du texte inline — sur une
  // seule ligne si ça tient, sinon l'employeur passe seul à la ligne.
  header: {
    marginBottom: 2,
  },
  role: {
    fontSize: 12.5, // juste sous les titres de section
    fontWeight: "bold",
    color: CV_VIOLET,
  },
  employer: {
    fontSize: 10, // plus petit que l'intitulé de poste qu'il complète
    fontWeight: "medium", // demi-gras : se distingue du texte courant sans concurrencer le poste
    color: CV_VIOLET_SOFT,
  },
  team: {
    fontSize: 8.5,
    color: CV_VIOLET_SOFT,
    lineHeight: CV_BODY_LINE_HEIGHT,
    marginBottom: 2,
  },
  context: {
    fontSize: 9,
    color: CV_TEXT,
    lineHeight: CV_BODY_LINE_HEIGHT,
    marginBottom: 2,
  },
  mission: {
    fontSize: 9,
    color: CV_TEXT,
    lineHeight: CV_BODY_LINE_HEIGHT,
    marginBottom: 2,
  },
  stack: {
    fontSize: 8.5, // un cran sous le corps de texte
    fontWeight: "bold", // comme dans le CV d'origine
    color: CV_VIOLET,
    lineHeight: CV_BODY_LINE_HEIGHT,
    marginTop: 2, // avec le marginBottom de la dernière mission : double espacement avant le pied d'expérience
  },
  stackSeparator: {
    color: CV_GOLD,
  },
  arrow: {
    fontFamily: "Carlito", // Quicksand n'a pas le glyphe "→" (U+2192) : Carlito l'a, et est déjà enregistrée (voir shared.tsx)
  },
  // Nom d'un projet au sein de l'expérience : sous-titre entre le poste et les missions.
  projectName: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: CV_VIOLET,
    marginTop: 3, // détache chaque projet du bloc précédent
    marginBottom: 1,
  },
})

/**
 * Rend insécable la dernière parenthèse d'un texte "Employeur (dates)" — les
 * dates ne doivent jamais être coupées en fin de ligne.
 */
function nonBreakingDates(employer: string): string {
  return employer.replace(/\([^()]*\)$/, dates => dates.replace(/ /g, " "))
}

/** Équipe, contexte et missions — le corps commun à une expérience et à chacun de ses projets. */
function ExperienceBody({
  team,
  context,
  missions,
}: Pick<Project, "team" | "context" | "missions">) {
  return (
    <>
      {team !== undefined && <Text style={styles.team}>{team}</Text>}
      {context?.map(line => (
        <CvRichText key={line} text={line} style={styles.context} />
      ))}
      {missions.map(mission => (
        <CvRichText
          key={mission}
          text={mission}
          style={styles.mission}
          prefix="→  "
          prefixStyle={styles.arrow}
        />
      ))}
    </>
  )
}

/**
 * Une expérience professionnelle : poste, employeur, puis son corps (équipe,
 * contexte, missions) — ou, si elle est découpée en `projects`, le même corps
 * répété pour chaque projet sous son nom — et la stack en pied.
 */
export function CvExperience({ experience }: { experience: Experience }) {
  return (
    <View style={styles.block}>
      <Text style={styles.header}>
        <Text style={styles.role}>{experience.role}</Text>
        <Text style={styles.employer}>
          {" / "}
          {nonBreakingDates(experience.employer)}
        </Text>
      </Text>
      <ExperienceBody
        team={experience.team}
        context={experience.context}
        missions={experience.missions ?? []}
      />
      {experience.projects?.map(project => (
        <View key={project.name}>
          <CvRichText text={project.name} style={styles.projectName} />
          <ExperienceBody
            team={project.team}
            context={project.context}
            missions={project.missions}
          />
        </View>
      ))}
      {experience.stack !== undefined && (
        <Text style={styles.stack}>
          {experience.stack.map((techno, i) => (
            <Text key={techno}>
              {i > 0 && <Text style={styles.stackSeparator}> / </Text>}
              {techno}
            </Text>
          ))}
        </Text>
      )}
    </View>
  )
}
