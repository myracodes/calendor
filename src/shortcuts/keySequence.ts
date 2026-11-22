/**
 * Une touche sous la forme comparée à la séquence du compte : la valeur de
 * KeyboardEvent.key (« ArrowUp »), une lettre seule en minuscule (B comme b).
 */
export function normalizeKey(key: string): string {
  return key.length === 1 ? key.toLowerCase() : key
}

/** Vrai si les dernières touches tapées forment la séquence (touches normalisées). */
export function endsWithSequence(keys: string[], sequence: string[]): boolean {
  const recent = keys.slice(-sequence.length)
  return (
    recent.length === sequence.length &&
    recent.every((key, i) => key === sequence[i])
  )
}
