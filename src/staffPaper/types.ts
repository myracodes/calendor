/** Type de portée : portée de solfège, ou tablature d'un instrument à cordes. */
export type StaffKind = "standard" | "guitarTab" | "ukuleleTab"

export interface StaffPaperSettings {
  kind: StaffKind
}
