// Le côté sucré de la semaine : desserts, petits déjeuners et snacks —
// principalement des fruits de saison et des fruits à coque.

import type { Occasion, Season } from "./ingredients"

export const FRUITS_BY_SEASON: Record<Season, string[]> = {
  printemps: [
    "fraises",
    // "rhubarbe",
    "cerises (fin de saison)",
  ],
  été: ["abricots", "pêches", "nectarines", "melon", "pastèque", "framboises", "myrtilles", "prunes", "cerises"],
  automne: [
    "raisins",
    "poires",
    "figues", // "coings",
    "châtaignes",
  ],
  hiver: [
    "oranges",
    "clémentines",
    "mandarines",
    "kiwis",
    "poires",
    // "pamplemousses"
  ],
}

// Fruits disponibles toute l'année (longue conservation ou import).
export const FRUITS_ALL_YEAR: string[] = ["bananes", "pommes", "citrons"]

// Fruits à coque, graines et autres snacks, disponibles toute l'année.
export const SNACKS: string[] = [
  "amandes",
  "noix",
  "noisettes",
  "noix de cajou",
  "graines de courge",
  // "dattes",
  "abricots secs",
  "chocolat noir",
]

// Basiques du petit déjeuner : liste fixe (habitudes), reprise telle quelle sur la liste de courses.
export const BREAKFAST_BASICS: string[] = [
  "flocons d'avoine",
  "lait végétal",
  "yaourts de soja",
  "pain",
  "purée de cacahuète",
  "confiture",
]

// Pool de fruits pour une occasion : fruits de la saison + fruits toute l'année.
// Canicule = fruits d'été (melon, pastèque… parfaits sans cuisson).
export function fruitsForOccasion(occasion: Occasion): string[] {
  const season: Season = occasion === "canicule" ? "été" : occasion
  return [...FRUITS_BY_SEASON[season], ...FRUITS_ALL_YEAR]
}
