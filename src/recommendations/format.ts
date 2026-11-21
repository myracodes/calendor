/** « De la part de Maman », « De la part d'Alice » : élision devant une voyelle. */
export function fromWhom(recommendedBy: string): string {
  const elided = /^[aeiouyàâäéèêëîïôöùûü]/i.test(recommendedBy)
  return `De la part ${elided ? "d'" : "de "}${recommendedBy}`
}

/** Les personnes déjà citées dans les recos, pour les proposer à la saisie. */
export function knownRecommenders(recommendedByList: string[]): string[] {
  const names = new Set(
    recommendedByList.map(name => name.trim()).filter(name => name !== ""),
  )
  return [...names].sort((first, second) => first.localeCompare(second, "fr"))
}
