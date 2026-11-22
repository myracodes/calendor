/** Le nom d'une courbe, posé juste après son dernier point. */
export interface EndLabel {
  id: string
  label: string
  /** Position de la ligne de base du texte, en px dans le graphique. */
  x: number
  y: number
}

/**
 * Écarte verticalement les noms de courbes trop proches (fins de courbes à
 * des valeurs voisines), de haut en bas, puis remonte le tout s'ils dépassent
 * le bas de la zone de tracé.
 * @param minGap écart vertical minimal entre deux noms, en px
 */
export function spreadEndLabels(
  labels: EndLabel[],
  minGap: number,
  bottom: number,
): EndLabel[] {
  const spread = [...labels].sort((first, second) => first.y - second.y)
  for (let i = 1; i < spread.length; i++) {
    const minimumY = spread[i - 1].y + minGap
    if (spread[i].y < minimumY) spread[i] = { ...spread[i], y: minimumY }
  }
  const overflow = (spread.at(-1)?.y ?? bottom) - bottom
  if (overflow <= 0) return spread
  return spread.map(label => ({ ...label, y: label.y - overflow }))
}
