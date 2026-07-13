import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { PAPER } from "../colors"
import { PAGE_HEIGHT_PT, PAGE_WIDTH_PT } from "./shared"

// Dimensions absolues selon l'orientation de la page (les constantes de shared.tsx
// décrivent une A4 paysage ; en portrait elles s'inversent).
const SIZES = StyleSheet.create({
  landscape: { width: PAGE_WIDTH_PT, height: PAGE_HEIGHT_PT },
  portrait: { width: PAGE_HEIGHT_PT, height: PAGE_WIDTH_PT },
})

const styles = StyleSheet.create({
  // Image couvrant toute la page en mode "fond de page".
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    objectFit: "cover",
  },
  // Voile clair par-dessus l'image de fond pour garder le texte lisible.
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: PAPER,
    opacity: 0.78,
  },
})

interface PageBackgroundProps {
  src: string
  orientation?: "portrait" | "landscape"
}

/** Image de fond pleine page + voile clair, à placer en premier enfant d'une <Page>. */
export function PageBackground({ src, orientation = "landscape" }: PageBackgroundProps) {
  const size = SIZES[orientation]
  return (
    <>
      <Image fixed style={[styles.image, size]} src={src} />
      <View fixed style={[styles.overlay, size]} />
    </>
  )
}
