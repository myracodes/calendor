import { INK } from "../colors"

// Trames dessinées à la volée via <Canvas> : react-pdf n'a pas de motif de fond
// répétable natif. Points ronds via un pointillé quasi nul + bouts arrondis, même
// couleur que le texte (INK) pour rester visible à l'impression.
export const DOT_LINE_WIDTH = 1.2
export const DOT_SPACE = 4
export const ROW_HEIGHT = 22
export const CHECKBOX_SIZE = 8
export const CHECKBOX_STROKE = 0.75

/** Painter pdfkit reçu par le prop `paint` de <Canvas> — la lib n'exporte pas son type. */
// biome-ignore lint/suspicious/noExplicitAny: type non exporté par @react-pdf/renderer
export type Painter = any

/** Lignes pointillées horizontales façon bullet journal, une toutes les ROW_HEIGHT. */
export function paintDottedLines(
  painter: Painter,
  width: number,
  height: number,
) {
  painter
    .strokeColor(INK)
    .lineCap("round")
    .lineWidth(DOT_LINE_WIDTH)
    .dash(0.01, { space: DOT_SPACE })
  for (let y = ROW_HEIGHT; y <= height; y += ROW_HEIGHT) {
    painter.moveTo(0, y).lineTo(width, y).stroke()
  }
  return null
}

/** Cases à cocher centrées, une par ligne, le bas aligné sur les pointillés des colonnes voisines. */
export function paintCheckboxes(
  painter: Painter,
  width: number,
  height: number,
) {
  painter.strokeColor(INK).lineWidth(CHECKBOX_STROKE)
  for (let y = ROW_HEIGHT; y <= height; y += ROW_HEIGHT) {
    painter
      .rect(
        (width - CHECKBOX_SIZE) / 2,
        y - CHECKBOX_SIZE,
        CHECKBOX_SIZE,
        CHECKBOX_SIZE,
      )
      .stroke()
  }
  return null
}
