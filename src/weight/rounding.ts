/** Arrondi au dixième, la précision des pesées, pour ne pas afficher « 0,0999… kg ». */
export function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10
}
