import { prefixWithDe } from "../french"

/** « De la part de Maman », « De la part d'Alice ». */
export function fromWhom(recommendedBy: string): string {
  return `De la part ${prefixWithDe(recommendedBy)}`
}

/** Les personnes déjà citées dans les recos, pour les proposer à la saisie. */
export function knownRecommenders(recommendedByList: string[]): string[] {
  const names = new Set(
    recommendedByList.map(name => name.trim()).filter(name => name !== ""),
  )
  return [...names].sort((first, second) => first.localeCompare(second, "fr"))
}
