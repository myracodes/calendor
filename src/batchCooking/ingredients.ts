// Listes d'ingrédients acceptés pour le batch cooking (100 % végane).
// Listes hardcodées : à ajuster à la main selon les goûts et ce qu'on trouve au marché.

export type Season = "printemps" | "été" | "automne" | "hiver"

// Une "occasion" = une saison, ou un contexte particulier qui restreint les ingrédients
// (ex. canicule : uniquement ce qui demande un minimum de cuisson / de chaleur).
export type Occasion = Season | "canicule"

export const OCCASIONS: Occasion[] = ["printemps", "été", "automne", "hiver", "canicule"]

/** @param month 1-12 */
export function seasonForMonth(month: number): Season {
  if (month >= 3 && month <= 5) return "printemps"
  if (month >= 6 && month <= 8) return "été"
  if (month >= 9 && month <= 11) return "automne"
  return "hiver"
}

// Légumes de saison (France métropolitaine, grosses mailles : un légume peut
// chevaucher deux saisons, il est alors listé dans les deux).
export const VEGETABLES_BY_SEASON: Record<Season, string[]> = {
  printemps: [
    "asperges",
    "épinards",
    "radis",
    "petits pois",
    "carottes nouvelles",
    "navets nouveaux",
    // "blettes",
    "artichauts",
    "oignons nouveaux",
    "fèves",
    "chou-fleur",
    "poireaux",
  ],
  été: [
    "tomates",
    "courgettes",
    "aubergines",
    "poivrons",
    "haricots verts",
    "concombres",
    "fenouil",
    "maïs",
    // "blettes",
    "salade verte",
    "oignons",
  ],
  automne: [
    "potimarron",
    "butternut",
    "champignons",
    "poireaux",
    "brocolis",
    "chou-fleur",
    "carottes",
    "épinards",
    // "panais",
    "céleri branche",
    "chou kale",
  ],
  hiver: [
    "poireaux",
    "chou vert",
    "chou rouge",
    "choux de Bruxelles",
    "courges",
    "carottes",
    "panais",
    "topinambours",
    "céleri-rave",
    "endives",
    "épinards",
    "navets",
  ],
}

// Légumes frais qu'on trouve toute l'année sur le marché, même hors saison :
// ajoutés au pool de légumes quelle que soit la saison.
export const FRESH_ALL_YEAR_VEGETABLES: string[] = ["salade verte", "aubergines", "courgettes", "oignons"]

// Légumes en boîte / bocal / surgelés, disponibles toute l'année :
// ajoutés au pool de légumes quelle que soit la saison.
export const PANTRY_VEGETABLES: string[] = [
  "cœurs de palmier (bocal)",
  "asperges (bocal)",
  "haricots verts (bocal/surgelé)",
  "petits pois (boîte/surgelé)",
  "maïs (boîte)",
  "épinards (surgelés)",
  // "artichauts (bocal)",
  // "champignons (bocal)",
]

// Protéines véganes, avec le geste de préparation typique en session de batch cooking.
export const PROTEINS: string[] = [
  "tofu ferme (mariné)",
  "tofu fumé",
  // "tempeh",
  // "seitan",
  "pois chiches",
  "lentilles vertes",
  "lentilles blondes",
  "lentilles corail",
  "haricots rouges",
  "haricots blancs",
  "protéines de soja texturées",
  "edamame", // toute l'année en surgelé ; parfaits en entrée
]

export const STARCHES: string[] = [
  "riz complet",
  "pâtes complètes",
  "semoule",
  "quinoa",
  "pommes de terre",
  "patates douces",
  "boulgour",
  // "polenta",
  "orge perlé",
  "nouilles soba",
  "nouilles de riz",
]

