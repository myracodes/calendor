import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { PAPER } from "../../colors"
import { PAGE_HEIGHT_PT, PAGE_WIDTH_PT } from "./shared"

// Dimensions absolues selon l'orientation de la page (les constantes de shared.tsx
// décrivent une A4 paysage ; en portrait elles s'inversent).
const FULL_PAGE_SIZES = StyleSheet.create({
  landscape: { width: PAGE_WIDTH_PT, height: PAGE_HEIGHT_PT },
  portrait: { width: PAGE_HEIGHT_PT, height: PAGE_WIDTH_PT },
})

// Moitié d'une A4 coupée dans sa longueur : la gauche ou la droite d'une paysage,
// le haut ou le bas d'une portrait (soit une A5).
const HALF_PAGE_SIZES = StyleSheet.create({
  landscape: { width: PAGE_WIDTH_PT / 2, height: PAGE_HEIGHT_PT },
  portrait: { width: PAGE_HEIGHT_PT, height: PAGE_WIDTH_PT / 2 },
})

const styles = StyleSheet.create({
  // Image couvrant toute la page (ou sa moitié) en mode "fond de page".
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
  /** fond d'une moitié de page seulement, à placer dans la View qui occupe cette moitié */
  half?: boolean
}

/**
 * Image de fond pleine page + voile clair, à placer en premier enfant d'une <Page>
 * (ou, avec `half`, de la View d'une moitié de page).
 */
export function PageBackground({
  src,
  orientation = "landscape",
  half = false,
}: PageBackgroundProps) {
  const size = (half ? HALF_PAGE_SIZES : FULL_PAGE_SIZES)[orientation]
  return (
    <>
      <Image fixed style={[styles.image, size]} src={src} />
      <View fixed style={[styles.overlay, size]} />
    </>
  )
}
