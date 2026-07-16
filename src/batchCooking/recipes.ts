// Recettes / associations "preset" nourries à la main : le générateur choisit
// parmi elles et favorise les plats qui partagent des ingrédients (batch cooking).
//
// Format d'une recette :
//   { ingredients: ["riz", "épinards"] }                       → libellé = les ingrédients
//   { name: "Cake tomates séchées", ingredients: [...] }        → libellé = le nom
//   { ingredients: [...], canicule: true }                      → proposée en mode canicule
//   { ingredients: [...], seasons: ["automne", "hiver"] }       → saisons imposées à la main
//
// Saisonnalité : pas besoin de la déclarer. Une recette est écartée seulement si
// un de ses ingrédients est un produit connu comme saisonnier (présent dans les
// listes de ingredients.ts / sweets.ts) mais hors saison. Un ingrédient inconnu
// de ces listes (olives, pesto, farine…) passe toujours — attention donc aux
// libellés : "tomates" (connu, été) ≠ "tomate" (inconnu, passerait toute l'année).
// `seasons` sert quand la déduction ne suffit pas : un plat d'hiver dont tous les
// ingrédients existent toute l'année (ex. légumes rôtis) passerait sinon en été.

import type { Season } from "./ingredients"

export interface Recipe {
  /** nom du plat, optionnel : affiché en tête du repas à la place de la liste brute */
  name?: string
  ingredients: string[]
  /** saisons imposées : remplace la déduction par ingrédients */
  seasons?: Season[]
  /** true si le plat convient à une canicule (cuisson minimale) */
  canicule?: boolean
}

export const RECIPES: Recipe[] = [
  { ingredients: ["lentilles corail", "tofu", "tomates", "riz", "pois chiches"] },
  { ingredients: ["boulgour", "concombres", "tomates", "avocat"], canicule: true },
  { ingredients: ["lentilles vertes", "tofu", "carottes"] },
  { ingredients: ["riz", "épinards"] },
  { ingredients: ["riz", "tofu", "haricots"] },
  { ingredients: ["semoule", "concombres", "tomates", "avocat"], canicule: true },
  { ingredients: ["pâtes", "pesto", "pois chiches"] },
  { ingredients: ["pâtes", "tofu", "haricots verts"] },
  {
    name: "Cake tomates séchées & olives",
    ingredients: ["farine", "tomates séchées", "olives"],
  },
  {
    name: "Salade de boulgour",
    ingredients: ["boulgour", "tomates", "concombres", "mélange de graines", "avocat", "olives"],
    canicule: true,
  },
  {
    name: "Chili sin carne",
    ingredients: ["haricots rouges", "riz complet", "poivrons", "tomates", "oignons"],
  },
  {
    name: "Bolognaise végé",
    ingredients: ["protéines de soja texturées", "pâtes complètes", "tomates", "oignons", "aubergines"],
  },
  {
    name: "Ratatouille",
    ingredients: ["tofu ferme (mariné)", "riz complet", "courgettes", "aubergines", "tomates", "poivrons"],
  },
  // ——— plutôt automne ———
  {
    name: "Curry",
    ingredients: ["pois chiches", "riz complet", "potimarron", "épinards"],
  },
  {
    name: "Buddha bowl",
    ingredients: ["tofu ferme (mariné)", "quinoa", "brocolis", "carottes"],
  },
  // ——— automne / hiver ———
  {
    name: "Dahl",
    ingredients: ["lentilles corail", "riz complet", "carottes", "épinards"],
  },
  {
    name: "Poêlée",
    ingredients: ["tofu fumé", "pommes de terre", "poireaux", "carottes"],
  },
  // ——— plutôt hiver ———
  {
    name: "Couscous",
    ingredients: ["pois chiches", "semoule", "carottes", "navets", "courgettes"],
  },
  {
    name: "Gratin d'endives",
    ingredients: ["tofu fumé", "pommes de terre", "endives"],
  },
  // ——— printemps ———
  {
    name: "Wok de printemps",
    ingredients: ["tofu ferme (mariné)", "nouilles soba", "asperges", "petits pois"],
  },
  // ——— risottos : une variante par saison, le filtre saisonnier choisit tout seul ———
  {
    name: "Risotto aux asperges",
    ingredients: ["riz rond", "asperges"],
  },
  {
    name: "Risotto au fenouil",
    ingredients: ["riz rond", "fenouil"],
  },
  {
    name: "Risotto aux poireaux",
    ingredients: ["riz rond", "poireaux"],
  },
  {
    name: "Risotto aux champignons",
    ingredients: ["riz rond", "champignons"],
  },
  // ——— automne / hiver : légumes rôtis au four (saisons imposées à la main,
  // tous les ingrédients existant toute l'année) ———
  {
    name: "Légumes rôtis + riz",
    ingredients: [
      "tofu",
      "riz",
      "pommes de terre",
      "patates douces",
      "champignons de Paris",
      "oignons",
      "ail",
      "carottes",
      "butternut",
    ],
    seasons: ["automne", "hiver"],
  },
  {
    name: "Légumes rôtis + boulgour",
    ingredients: [
      "tofu",
      "boulgour",
      "pommes de terre",
      "patates douces",
      "champignons de Paris",
      "oignons",
      "ail",
      "carottes",
      "butternut",
    ],
    seasons: ["automne", "hiver"],
  },
  // ——— canicule ———
  {
    name: "Taboulé",
    ingredients: ["pois chiches (bocal)", "semoule", "concombres", "tomates cerise"],
    canicule: true,
  },
  {
    name: "Salade de pâtes",
    ingredients: ["tofu fumé", "pâtes (en salade)", "tomates cerise", "maïs (boîte)", "avocats"],
    canicule: true,
  },
  {
    name: "Bowl frais",
    ingredients: ["edamame", "quinoa", "carottes râpées", "concombres", "radis"],
    canicule: true,
  },
]

// desserts > ajouter pudding de chia aux fruits
