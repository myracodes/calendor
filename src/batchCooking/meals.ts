// Combinaisons de repas écrites à la main : le générateur ne compose plus rien
// au hasard, il choisit uniquement parmi ces combinaisons.
//
// Pas besoin d'indiquer les saisons : une combinaison est proposée si TOUS ses
// ingrédients figurent dans les pools de l'occasion choisie (légumes de saison
// + frais/conserves toute l'année, ou pools canicule). Attention donc à écrire
// les ingrédients exactement comme dans ingredients.ts ("carottes" ≠ "carottes
// nouvelles"), sinon la combinaison ne sortira jamais.

export interface MealCombo {
  /** nom du plat ("Chili", "Couscous"…), optionnel : affiché en tête du repas */
  name?: string
  protein: string
  starch: string
  vegetables: string[]
}

export const COMBOS: MealCombo[] = [
  // ——— plutôt été ———
  {
    name: "Chili sin carne",
    protein: "haricots rouges",
    starch: "riz complet",
    vegetables: ["poivrons", "tomates", "oignons"],
  },
  {
    name: "Bolognaise végé",
    protein: "protéines de soja texturées",
    starch: "pâtes complètes",
    vegetables: ["tomates", "oignons", "aubergines"],
  },
  {
    name: "Ratatouille",
    protein: "tofu ferme (mariné)",
    starch: "riz complet",
    vegetables: ["courgettes", "aubergines", "tomates", "poivrons"],
  },
  // ——— plutôt automne ———
  {
    name: "Curry",
    protein: "pois chiches",
    starch: "riz complet",
    vegetables: ["potimarron", "épinards"],
  },
  {
    name: "Buddha bowl",
    protein: "tofu ferme (mariné)",
    starch: "quinoa",
    vegetables: ["brocolis", "carottes"],
  },
  // ——— automne / hiver ———
  {
    name: "Dahl",
    protein: "lentilles corail",
    starch: "riz complet",
    vegetables: ["carottes", "épinards"],
  },
  {
    name: "Poêlée",
    protein: "tofu fumé",
    starch: "pommes de terre",
    vegetables: ["poireaux", "carottes"],
  },
  // ——— plutôt hiver ———
  {
    name: "Couscous",
    protein: "pois chiches",
    starch: "semoule",
    vegetables: ["carottes", "navets", "courgettes"],
  },
  {
    name: "Gratin d'endives",
    protein: "tofu fumé",
    starch: "pommes de terre",
    vegetables: ["endives"],
  },
  // ——— printemps ———
  {
    name: "Wok de printemps",
    protein: "tofu ferme (mariné)",
    starch: "nouilles soba",
    vegetables: ["asperges", "petits pois"],
  },
  // ——— canicule (ingrédients des pools canicule uniquement) ———
  {
    name: "Taboulé",
    protein: "pois chiches (bocal)",
    starch: "semoule",
    vegetables: ["concombres", "tomates cerise"],
  },
  {
    name: "Salade de pâtes",
    protein: "tofu fumé",
    starch: "pâtes (en salade)",
    vegetables: ["tomates cerise", "maïs (boîte)", "avocats"],
  },
  {
    name: "Bowl frais",
    protein: "edamame",
    starch: "quinoa",
    vegetables: ["carottes râpées", "concombres", "radis"],
  },
]
