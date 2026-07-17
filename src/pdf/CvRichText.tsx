import { StyleSheet, Text, type TextProps } from "@react-pdf/renderer"
import { CV_AMBER, CV_VIOLET } from "./cvTheme"

const styles = StyleSheet.create({
  gras: {
    fontWeight: "bold", // met en avant les mots-clés du CV
    color: CV_VIOLET, // les mots-clés sont violets, comme dans le CV d'origine
  },
  grasInverse: {
    color: CV_AMBER, // sur le fond violet de la colonne de gauche, les mots-clés passent en ambre
  },
})

/**
 * Texte du CV avec mise en avant légère : les segments entre `**` sont rendus
 * en gras violet (ex. "refontes en **React / Next.js**").
 * `inverse` : variante pour le fond violet de la colonne de gauche (gras ambre).
 */
export function CvRichText({
  texte,
  style,
  inverse = false,
}: {
  texte: string
  style?: TextProps["style"]
  inverse?: boolean
}) {
  // Un split sur "**" alterne segments normaux (indices pairs) et segments en gras (indices impairs).
  const segments = texte.split("**")
  return (
    <Text style={style}>
      {segments.map((segment, i) =>
        i % 2 === 1 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: segments statiques, jamais réordonnés
          <Text key={i} style={inverse ? [styles.gras, styles.grasInverse] : styles.gras}>
            {segment}
          </Text>
        ) : (
          segment
        ),
      )}
    </Text>
  )
}
