// Génération d'une semaine de batch cooking à partir des recettes "preset" de
// recipes.ts : le générateur choisit des plats compatibles avec l'occasion et
// favorise ceux qui partagent des ingrédients avec les plats déjà retenus —
// si un plat utilise des aubergines, un 2e plat aux aubergines est privilégié,
// et les quantités à préparer par session sont comptées en nombre de plats.

import {
  FRESH_ALL_YEAR_VEGETABLES,
  type Occasion,
  PANTRY_VEGETABLES,
  type Season,
  VEGETABLES_BY_SEASON,
} from "./ingredients"
import { RECIPES, type Recipe } from "./recipes"
import { SPECIAL_DISHES, type SpecialDish } from "./specialDishes"
import { BREAKFAST_BASICS, FRUITS_ALL_YEAR, FRUITS_BY_SEASON, fruitsForOccasion, SNACKS } from "./sweets"

export type Meal = { kind: "recipe"; recipe: Recipe } | { kind: "special"; name: string }

export interface IngredientCount {
  ingredient: string
  /** nombre de plats qui utilisent cet ingrédient */
  count: number
}

export interface SessionPlan {
  meals: Meal[]
  /** quantités à préparer pendant la session, en nombre de plats par ingrédient */
  toPrepare: IngredientCount[]
}

export interface WeekPlan {
  /** [session du dimanche, session du mercredi] — sessions vides si aucune recette compatible */
  sessions: SessionPlan[]
  /** liste de courses : tous les ingrédients de la semaine, en nombre de plats */
  shopping: IngredientCount[]
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

// Ingrédients "connus comme saisonniers" (légumes et fruits des listes par saison) :
// seuls ceux-là peuvent rendre une recette indisponible hors saison.
const SEASONAL_INGREDIENTS = new Set([
  ...Object.values(VEGETABLES_BY_SEASON).flat(),
  ...Object.values(FRUITS_BY_SEASON).flat(),
])

// Ingrédients saisonniers disponibles pour une saison donnée (les produits frais
// et conserves toute l'année restent disponibles même listés dans une saison).
function seasonPool(season: Season): Set<string> {
  return new Set([
    ...VEGETABLES_BY_SEASON[season],
    ...FRESH_ALL_YEAR_VEGETABLES,
    ...PANTRY_VEGETABLES,
    ...FRUITS_BY_SEASON[season],
    ...FRUITS_ALL_YEAR,
  ])
}

// Canicule : uniquement les recettes marquées `canicule` (cuisson minimale).
// Saisons imposées à la main (`seasons`) : elles remplacent la déduction.
// Sinon : une recette est écartée si un ingrédient saisonnier est hors saison ;
// un ingrédient inconnu des listes passe toujours (placard par défaut).
function isAvailable(recipe: Recipe, occasion: Occasion, pool: Set<string>): boolean {
  if (occasion === "canicule") return recipe.canicule === true
  if (recipe.seasons) return recipe.seasons.includes(occasion)
  return recipe.ingredients.every(ingredient => !SEASONAL_INGREDIENTS.has(ingredient) || pool.has(ingredient))
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Sélection gloutonne : premier plat au hasard, puis à chaque étape le plat qui
// partage le plus d'ingrédients avec ceux déjà retenus (le mélange initial
// départage les ex æquo au hasard). Si la liste est plus courte que la semaine,
// les plats se répètent (on cuisine en plus grande quantité).
function selectRecipes(available: Recipe[], mealCount: number): Recipe[] {
  if (available.length === 0) return []
  const pool = shuffled(available)
  const selected: Recipe[] = [pool.shift() as Recipe]
  const chosenIngredients = new Set(selected[0].ingredients)

  while (selected.length < mealCount && pool.length > 0) {
    let bestIndex = 0
    let bestScore = -1
    for (let i = 0; i < pool.length; i++) {
      const score = pool[i].ingredients.filter(ingredient => chosenIngredients.has(ingredient)).length
      if (score > bestScore) {
        bestScore = score
        bestIndex = i
      }
    }
    const [recipe] = pool.splice(bestIndex, 1)
    selected.push(recipe)
    for (const ingredient of recipe.ingredients) chosenIngredients.add(ingredient)
  }

  return Array.from({ length: mealCount }, (_, i) => selected[i % selected.length])
}

// Compte, pour une liste de repas, le nombre de plats utilisant chaque ingrédient
// (tri : les plus utilisés d'abord, puis alphabétique).
function ingredientCounts(meals: Meal[]): IngredientCount[] {
  const counts = new Map<string, number>()
  for (const meal of meals) {
    if (meal.kind !== "recipe") continue
    for (const ingredient of meal.recipe.ingredients) {
      counts.set(ingredient, (counts.get(ingredient) ?? 0) + 1)
    }
  }
  return [...counts]
    .map(([ingredient, count]) => ({ ingredient, count }))
    .sort((a, b) => b.count - a.count || a.ingredient.localeCompare(b.ingredient))
}

export function generateWeekPlan(occasion: Occasion, mealCount: number): WeekPlan {
  const pool = occasion === "canicule" ? new Set<string>() : seasonPool(occasion)
  const available = RECIPES.filter(recipe => isAvailable(recipe, occasion, pool))
  const meals: Meal[] = selectRecipes(available, mealCount).map(recipe => ({ kind: "recipe", recipe }))

  // De temps en temps, un plat spécial remplace le premier repas (session du dimanche,
  // où on a le plus de temps devant soi). Pas pendant une canicule : trop de cuisson.
  // Seuls les plats de la saison en cours (ou de toute l'année) sont candidats.
  let specialDish: SpecialDish | null = null
  if (meals.length > 0 && occasion !== "canicule" && Math.random() < SPECIAL_DISH_PROBABILITY) {
    const candidates = SPECIAL_DISHES.filter(dish => !dish.seasons || dish.seasons.includes(occasion))
    if (candidates.length > 0) {
      specialDish = candidates[Math.floor(Math.random() * candidates.length)]
      meals[0] = { kind: "special", name: specialDish.name }
    }
  }

  // La sélection gloutonne place les plats aux ingrédients communs côte à côte :
  // couper au milieu garde ces regroupements au sein d'une même session.
  const firstSessionMeals = meals.slice(0, Math.ceil(meals.length / 2))
  const secondSessionMeals = meals.slice(Math.ceil(meals.length / 2))
  const sessions: SessionPlan[] = [
    { meals: firstSessionMeals, toPrepare: ingredientCounts(firstSessionMeals) },
    { meals: secondSessionMeals, toPrepare: ingredientCounts(secondSessionMeals) },
  ]

  const sweet = {
    fruits: shuffled(fruitsForOccasion(occasion)).slice(0, 4),
    snacks: shuffled(SNACKS).slice(0, 3),
    breakfast: BREAKFAST_BASICS,
  }

  return { sessions, shopping: ingredientCounts(meals), sweet, specialDish }
}
