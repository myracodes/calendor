import { StyleSheet, Text, View } from "@react-pdf/renderer"
import type { Experience, Projet } from "../cv/types"
import { CvRichText } from "./CvRichText"
import { CV_BODY_LINE_HEIGHT, CV_GOLD, CV_TEXT, CV_VIOLET, CV_VIOLET_SOFT } from "./cvTheme"

const styles = StyleSheet.create({
  bloc: {
    marginBottom: 14,
  },
  poste: {
    fontSize: 12.5, // juste sous les titres de section
    fontWeight: "bold",
    color: CV_VIOLET,
  },
  employeur: {
    fontSize: 10, // plus petit que l'intitulé de poste qu'il complète
    fontWeight: "medium", // demi-gras : se distingue du texte courant sans concurrencer le poste
    color: CV_VIOLET_SOFT,
    marginBottom: 2,
  },
  equipe: {
    fontSize: 8.5,
    color: CV_VIOLET_SOFT,
    lineHeight: CV_BODY_LINE_HEIGHT,
    marginBottom: 2,
  },
  contexte: {
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
  stackSeparateur: {
    color: CV_GOLD,
  },
  fleche: {
    fontFamily: "Carlito", // Quicksand n'a pas le glyphe "→" (U+2192) : Carlito l'a, et est déjà enregistrée (voir shared.tsx)
  },
  // Nom d'un projet au sein de l'expérience : sous-titre entre le poste et les missions.
  projetNom: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: CV_VIOLET,
    marginTop: 3, // détache chaque projet du bloc précédent
    marginBottom: 1,
  },
})

/** Équipe, contexte et missions — le corps commun à une expérience et à chacun de ses projets. */
function CorpsExperience({ equipe, contexte, missions }: Pick<Projet, "equipe" | "contexte" | "missions">) {
  return (
    <>
      {equipe !== undefined && <Text style={styles.equipe}>{equipe}</Text>}
      {contexte?.map(ligne => (
        <CvRichText key={ligne} texte={ligne} style={styles.contexte} />
      ))}
      {missions.map(mission => (
        <CvRichText key={mission} texte={mission} style={styles.mission} prefix="→  " prefixStyle={styles.fleche} />
      ))}
    </>
  )
}

/**
 * Une expérience professionnelle : poste, employeur, puis son corps (équipe,
 * contexte, missions) — ou, si elle est découpée en `projets`, le même corps
 * répété pour chaque projet sous son nom — et la stack en pied.
 */
export function CvExperience({ experience }: { experience: Experience }) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.poste}>{experience.poste}</Text>
      <Text style={styles.employeur}>/ {experience.employeur}</Text>
      <CorpsExperience equipe={experience.equipe} contexte={experience.contexte} missions={experience.missions ?? []} />
      {experience.projets?.map(projet => (
        <View key={projet.nom}>
          <CvRichText texte={projet.nom} style={styles.projetNom} />
          <CorpsExperience equipe={projet.equipe} contexte={projet.contexte} missions={projet.missions} />
        </View>
      ))}
      {experience.stack !== undefined && (
        <Text style={styles.stack}>
          {experience.stack.map((techno, i) => (
            <Text key={techno}>
              {i > 0 && <Text style={styles.stackSeparateur}> / </Text>}
              {techno}
            </Text>
          ))}
        </Text>
      )}
    </View>
  )
}
