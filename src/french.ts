/** « de » devant un nom, élidé devant une voyelle : « de Maman », « d'Alice ». */
export function prefixWithDe(name: string): string {
  const elided = /^[aeiouyàâäéèêëîïôöùûü]/i.test(name)
  return `${elided ? "d'" : "de "}${name}`
}
