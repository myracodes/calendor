// Plats "spéciaux" (recettes connues, plus élaborées qu'un assemblage protéine/féculent/légumes),
// à glisser dans une semaine de temps en temps — environ une fois par trimestre.
// Jamais pendant une canicule : ils demandent trop de cuisson.

import type { Season } from "./ingredients"

export interface SpecialDish {
  name: string
  ingredients: string[]
  /** saisons où le plat a du sens (absent = toute l'année) */
  seasons?: Season[]
  /** remarque utile (temps de préparation, congélation…) */
  note?: string
}

export const SPECIAL_DISHES: SpecialDish[] = [
  {
    name: "Burritos",
    ingredients: [
      "tortillas",
      "avocats",
      "haricots rouges",
      "tofu râpé",
      "oignons",
      "poivrons",
      "tomates",
    ],
  },
  {
    name: "Lasagnes",
    ingredients: [
      "pâtes à lasagnes",
      "tomates concassées (boîte)",
      "protéines de soja texturées",
      "oignons",
      "carottes",
      "épinards",
      "lait de soja",
      "farine",
      "margarine",
      "levure maltée",
    ],
    note: "long à préparer, mais possible d'en faire une très grosse quantité (congélation)",
  },
  {
    name: "Ramen",
    ingredients: [
      "nouilles ramen",
      "pâte miso",
      "tofu ferme (mariné)",
      "champignons",
      "pak choï ou épinards",
      "maïs (boîte)",
      "oignons nouveaux",
      "algues nori",
    ],
  },
  {
    name: "Quiche aubergine-courgette-tomate",
    ingredients: [
      "pâte brisée",
      "tofu soyeux",
      "crème de soja",
      "aubergines",
      "courgettes",
      "tomates",
      "tofu fumé",
    ],
    seasons: ["été"],
  },
  {
    name: "Quiche tofu-poireaux",
    ingredients: [
      "pâte brisée",
      "tofu soyeux",
      "crème de soja",
      "tofu fumé",
      "poireaux",
      "salade verte",
    ],
    seasons: ["hiver", "printemps"],
    note: "salade verte en accompagnement",
  },
]
