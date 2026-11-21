import { INK } from "../../colors"

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

/** Diamètre des points d'une ligne pointillée et écart entre deux points, en points. */
export interface DotStyle {
  size: number
  space: number
}

const DEFAULT_DOTS: DotStyle = { size: DOT_LINE_WIDTH, space: DOT_SPACE }

function setDottedStroke(painter: Painter, dots: DotStyle = DEFAULT_DOTS) {
  painter
    .strokeColor(INK)
    .lineCap("round")
    .lineWidth(dots.size)
    .dash(0.01, { space: dots.space })
}

/** Lignes pointillées horizontales façon bullet journal, une toutes les ROW_HEIGHT. */
export function paintDottedLines(
  painter: Painter,
  width: number,
  height: number,
) {
  setDottedStroke(painter)
  for (let y = ROW_HEIGHT; y <= height; y += ROW_HEIGHT) {
    painter.moveTo(0, y).lineTo(width, y).stroke()
  }
  return null
}

/**
 * Exactement `lineCount` lignes pointillées, réparties régulièrement sur la hauteur
 * (la dernière tout en bas) : l'écart s'adapte à la place disponible, au lieu du
 * ROW_HEIGHT fixe de paintDottedLines.
 */
export function paintDottedLineCount(
  lineCount: number,
  dots: DotStyle = DEFAULT_DOTS,
) {
  return (painter: Painter, width: number, height: number) => {
    setDottedStroke(painter, dots)
    for (let line = 1; line <= lineCount; line++) {
      const y = (height * line) / lineCount
      painter.moveTo(0, y).lineTo(width, y).stroke()
    }
    return null
  }
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
