/** Un nombre et son nom accordé, ex. « 0 livre », « 1 livre », « 3 livres ». */
export function plural(
  count: number,
  singular: string,
  pluralForm: string,
): string {
  return `${count} ${count > 1 ? pluralForm : singular}`
}

/** « de » devant un nom, élidé devant une voyelle : « de Maman », « d'Alice ». */
export function prefixWithDe(name: string): string {
  const elided = /^[aeiouyàâäéèêëîïôöùûü]/i.test(name)
  return `${elided ? "d'" : "de "}${name}`
}
