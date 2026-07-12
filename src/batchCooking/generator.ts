// Génération d'une semaine de batch cooking à partir des combinaisons écrites à
// la main dans meals.ts : le générateur ne compose rien au hasard, il tire parmi
// les combinaisons dont tous les ingrédients sont disponibles pour l'occasion.
// Si la liste est plus courte que la semaine, les combinaisons se répètent
// (cohérent avec l'esprit batch cooking : on cuisine en grande quantité).

import { type Occasion, poolsForOccasion } from "./ingredients"
import { COMBOS, type MealCombo } from "./meals"
import { SPECIAL_DISHES, type SpecialDish } from "./specialDishes"
import { BREAKFAST_BASICS, fruitsForOccasion, SNACKS } from "./sweets"

export type Meal =
  | {
      kind: "combo"
      combo: MealCombo
      /** 1 = session du dimanche (début de semaine), 2 = session du mercredi (fin de semaine) */
      session: 1 | 2
    }
  | { kind: "special"; name: string; session: 1 | 2 }

export interface WeekPlan {
  /** vide si aucune combinaison n'est compatible avec l'occasion choisie */
  meals: Meal[]
  // Liste de courses = l'union des ingrédients des repas retenus, par catégorie.
  shopping: {
    proteins: string[]
    starches: string[]
    vegetables: string[]
  }
  // Le côté sucré de la semaine : desserts, petits déjeuners et snacks.
  sweet: {
    fruits: string[]
    snacks: string[]
    breakfast: string[]
  }
  /** Plat spécial de la semaine (ses ingrédients s'ajoutent à la liste de courses), ou null. */
  specialDish: SpecialDish | null
}

// Environ une semaine sur 12 (~une fois par trimestre en générant chaque semaine),
// un plat spécial remplace un des repas.
const SPECIAL_DISH_PROBABILITY = 1 / 12

function shuffled<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Une combinaison est disponible si chacun de ses ingrédients figure dans les
// pools de l'occasion (comparaison stricte des libellés, voir meals.ts).
function isAvailable(combo: MealCombo, pools: ReturnType<typeof poolsForOccasion>): boolean {
  return (
    pools.proteins.includes(combo.protein) &&
    pools.starches.includes(combo.starch) &&
    combo.vegetables.every(vegetable => pools.vegetables.includes(vegetable))
  )
}

export function generateWeekPlan(occasion: Occasion, mealCount: number): WeekPlan {
  const pools = poolsForOccasion(occasion)
  const available = shuffled(COMBOS.filter(combo => isAvailable(combo, pools)))

  const firstSessionMealCount = Math.ceil(mealCount / 2)
  const meals: Meal[] =
    available.length === 0
      ? []
      : Array.from({ length: mealCount }, (_, i) => ({
          kind: "combo",
          combo: available[i % available.length],
          session: i < firstSessionMealCount ? 1 : 2,
        }))

  // De temps en temps, un plat spécial remplace le premier repas (session du dimanche,
  // où on a le plus de temps devant soi). Pas pendant une canicule : trop de cuisson.
  // Seuls les plats de la saison en cours (ou de toute l'année) sont candidats.
  let specialDish: SpecialDish | null = null
  if (meals.length > 0 && occasion !== "canicule" && Math.random() < SPECIAL_DISH_PROBABILITY) {
    const candidates = SPECIAL_DISHES.filter(dish => !dish.seasons || dish.seasons.includes(occasion))
    if (candidates.length > 0) {
      specialDish = candidates[Math.floor(Math.random() * candidates.length)]
      meals[0] = { kind: "special", name: specialDish.name, session: 1 }
    }
  }

  const selectedCombos = [...new Set(meals.flatMap(meal => (meal.kind === "combo" ? [meal.combo] : [])))]
  const shopping = {
    proteins: [...new Set(selectedCombos.map(combo => combo.protein))],
    starches: [...new Set(selectedCombos.map(combo => combo.starch))],
    vegetables: [...new Set(selectedCombos.flatMap(combo => combo.vegetables))],
  }

  const sweet = {
    fruits: shuffled(fruitsForOccasion(occasion)).slice(0, 4),
    snacks: shuffled(SNACKS).slice(0, 3),
    breakfast: BREAKFAST_BASICS,
  }

  return { meals, shopping, sweet, specialDish }
}
