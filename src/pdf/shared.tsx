import { Font, StyleSheet, View } from "@react-pdf/renderer"
import type { ComponentProps } from "react"
import { RAINBOW } from "../colors"

// BASE_URL makes the public/ paths work both locally ("/") and on
// GitHub Pages ("/calendor/").
const BASE = import.meta.env.BASE_URL

// Dimensions d'une page A4 paysage, en points — nécessaires (plutôt que des
// pourcentages) pour positionner une image de fond en absolute : react-pdf
// (moteur de layout Yoga) mesure mal les pourcentages sur les nœuds absolus
// à la racine d'une Page, ce qui fait déborder le contenu sur une 2e page.
export const PAGE_WIDTH_PT = 841.89
export const PAGE_HEIGHT_PT = 595.28

Font.register({
  family: "PatrickHand",
  src: `${BASE}fonts/PatrickHand-Regular.ttf`,
})
Font.register({
  family: "BadScript",
  src: `${BASE}fonts/BadScript-Regular.ttf`,
})
// Handwritten text should not be hyphenated.
Font.registerHyphenationCallback(word => [word])
// Text fonts have no emoji glyphs; emojis are rendered from local Twemoji
// PNGs (public/emoji/<codepoints>.png — add the file when using a new emoji).
Font.registerEmojiSource({ format: "png", url: `${BASE}emoji/` })

export const SURFACE = "rgba(255, 255, 255, 0.65)" // légèrement transparent pour laisser deviner l'image de fond

// Le dégradé arc-en-ciel de l'app, simulé par une rangée de segments colorés
// (react-pdf ne supporte pas les dégradés CSS).
const RAINBOW_SEGMENTS = RAINBOW.map(
  color => StyleSheet.create({ segment: { flexGrow: 1, backgroundColor: color } }).segment,
)

/** Bande dégradée façon "gradient-rainbow" de l'app. */
export function RainbowBar({ style }: { style: ComponentProps<typeof View>["style"] }) {
  return (
    <View style={style}>
      {RAINBOW_SEGMENTS.map((segment, i) => (
        <View key={RAINBOW[i]} style={segment} />
      ))}
    </View>
  )
}
