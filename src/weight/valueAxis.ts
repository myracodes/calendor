// Axe vertical des courbes (poids en kg, tours en cm) : bornes arrondies et
// graduations régulières.

/** Écarts possibles entre deux graduations, du plus fin au plus large. */
const VALUE_STEPS = [0.5, 1, 2, 5, 10, 20, 50, 100]

/** Amplitude minimale de l'axe : une courbe plate (une seule valeur, ou des valeurs stables) reste au milieu. */
const MIN_RANGE = 2

/** Part de l'amplitude ajoutée au-dessus et en dessous, pour que les points extrêmes ne collent pas au bord. */
const MARGIN_RATIO = 0.1

export interface ValueAxis {
  /** Bas de l'axe, sur une graduation. */
  min: number
  /** Haut de l'axe, sur une graduation. */
  max: number
  /** Graduations, du bas vers le haut. */
  ticks: number[]
}

/**
 * L'axe qui contient toutes les valeurs (points des courbes, objectif), avec
 * au plus `maxTickCount` graduations.
 * @param values au moins une valeur
 */
export function valueAxis(values: number[], maxTickCount: number): ValueAxis {
  let low = Math.min(...values)
  let high = Math.max(...values)
  if (high - low < MIN_RANGE) {
    const middle = (low + high) / 2
    low = middle - MIN_RANGE / 2
    high = middle + MIN_RANGE / 2
  }
  const margin = (high - low) * MARGIN_RATIO
  low -= margin
  high += margin

  const step =
    VALUE_STEPS.find(
      candidate =>
        Math.ceil(high / candidate) - Math.floor(low / candidate) + 1 <=
        maxTickCount,
    ) ?? (VALUE_STEPS.at(-1) as number)
  // Les graduations sont calculées en nombre de pas, puis arrondies au
  // dixième : additionner 0.5 à répétition accumulerait des erreurs d'arrondi.
  const firstIndex = Math.floor(low / step)
  const lastIndex = Math.ceil(high / step)
  const ticks: number[] = []
  for (let index = firstIndex; index <= lastIndex; index++) {
    ticks.push(Math.round(index * step * 10) / 10)
  }
  return { min: ticks[0], max: ticks[ticks.length - 1], ticks }
}
