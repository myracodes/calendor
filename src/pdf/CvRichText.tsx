import { StyleSheet, Text, type TextProps } from "@react-pdf/renderer"
import { CV_AMBER, CV_VIOLET } from "./cvTheme"

const styles = StyleSheet.create({
  gras: {
    fontWeight: "bold",
    color: CV_VIOLET,
  },
  grasInverse: {
    color: CV_AMBER, // sur le fond violet de la colonne de gauche (voir CvSidebar.tsx)
  },
})

/**
 * Texte du CV avec mise en avant légère : les segments entre `**` sont rendus
 * en gras violet (ex. "refontes en **React / Next.js**").
 * `inverse` : variante pour le fond violet de la colonne de gauche (gras ambre).
 * `prefix` (optionnel) : préfixe rendu dans la police `prefixStyle`, avant le
 * texte — utile pour un caractère absent de la police courante (ex. la flèche
 * "→" des missions, absente de Quicksand : voir CvExperience.tsx).
 */
export function CvRichText({
  texte,
  style,
  inverse = false,
  prefix,
  prefixStyle,
}: {
  texte: string
  style?: TextProps["style"]
  inverse?: boolean
  prefix?: string
  prefixStyle?: TextProps["style"]
}) {
  // Un split sur "**" alterne segments normaux (indices pairs) et segments en gras (indices impairs).
  const segments = texte.split("**")
  return (
    <Text style={style}>
      {prefix !== undefined && <Text style={prefixStyle}>{prefix}</Text>}
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
