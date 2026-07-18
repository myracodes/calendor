import DEFAULT_BACKGROUND from "../assets/images/default-background.jpg"

/**
 * Images de fond par mois, découvertes automatiquement dans
 * src/assets/images/ — nul besoin de toucher au code pour en ajouter :
 * dépose un fichier nommé "MM-nom-du-mois-default-background.jpg"
 * (ex. "05-may-default-background.jpg") et il sera repris pour ce mois.
 * Les mois sans image dédiée retombent sur default-background.jpg.
 */
const monthImageModules = import.meta.glob<string>(
  "../assets/images/[0-9][0-9]-*-default-background.jpg",
  {
    eager: true,
    import: "default",
  },
)

const MONTH_BACKGROUNDS: Partial<Record<number, string>> = {}
for (const [path, url] of Object.entries(monthImageModules)) {
  const match = /\/(\d{2})-[a-z]+-default-background\.jpg$/.exec(path)
  if (match) MONTH_BACKGROUNDS[Number(match[1])] = url
}

/** Image de fond par défaut pour un mois (1-12), avec repli générique. */
export function backgroundForMonth(month: number): string {
  return MONTH_BACKGROUNDS[month] ?? DEFAULT_BACKGROUND
}
