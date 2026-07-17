import { StyleSheet, Text, View } from "@react-pdf/renderer"
import type { Experience } from "../cv/types"
import { CvRichText } from "./CvRichText"
import { CV_GOLD, CV_TEXT, CV_VIOLET, CV_VIOLET_SOFT } from "./cvTheme"

const styles = StyleSheet.create({
  bloc: {
    marginBottom: 14, // espace entre deux expériences
  },
  poste: {
    fontSize: 12.5, // intitulé de poste, juste sous les titres de section
    fontWeight: "bold", // en gras
    color: CV_VIOLET, // violet principal du CV
  },
  employeur: {
    fontSize: 10, // plus petit que l'intitulé de poste qu'il complète
    fontWeight: "medium", // demi-gras : se distingue du texte courant sans concurrencer le poste
    color: CV_VIOLET_SOFT, // violet atténué des lignes secondaires
    marginBottom: 2, // léger espace avant la ligne d'équipe / le contexte
  },
  equipe: {
    fontSize: 8.5, // ligne discrète
    color: CV_VIOLET_SOFT, // violet atténué des lignes secondaires
    marginBottom: 2, // léger espace avant le contexte / les missions
  },
  contexte: {
    fontSize: 9, // corps de texte
    color: CV_TEXT, // texte courant
    lineHeight: 1.35, // interligne aéré pour les petits corps de texte
    marginBottom: 2, // léger espace avant les missions
  },
  mission: {
    fontSize: 9, // corps de texte
    color: CV_TEXT, // texte courant
    lineHeight: 1.35, // interligne aéré pour les petits corps de texte
    marginBottom: 1.5, // léger espace entre deux missions
  },
  stack: {
    fontSize: 8.5, // pied d'expérience, un cran sous le corps de texte
    fontWeight: "bold", // technologies en gras, comme dans le CV d'origine
    color: CV_VIOLET, // violet principal du CV
    lineHeight: 1.4, // interligne aéré : la liste tient sur plusieurs lignes
    marginTop: 3, // espace après la dernière mission
  },
  stackSeparateur: {
    color: CV_GOLD, // les "/" entre technologies sont dorés, comme dans le CV d'origine
  },
})

/** Une expérience professionnelle : poste, employeur, équipe, contexte, missions et stack. */
export function CvExperience({ experience }: { experience: Experience }) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.poste}>{experience.poste}</Text>
      <Text style={styles.employeur}>/ {experience.employeur}</Text>
      {experience.equipe !== undefined && <Text style={styles.equipe}>{experience.equipe}</Text>}
      {experience.contexte?.map(ligne => (
        <CvRichText key={ligne} texte={ligne} style={styles.contexte} />
      ))}
      {experience.missions.map(mission => (
        <CvRichText key={mission} texte={`→  ${mission}`} style={styles.mission} />
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
