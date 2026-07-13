import { useState } from "react"
import { generateWeekPlan, type Meal, type SessionPlan, type WeekPlan } from "../../batchCooking/generator"
import { type Occasion, OCCASIONS, seasonForMonth } from "../../batchCooking/ingredients"
import "./BatchCookingPage.css"

const CURRENT_SEASON = seasonForMonth(new Date().getMonth() + 1)

const SESSION_TITLES = ["Session 1 (dimanche) — début de semaine", "Session 2 (mercredi) — fin de semaine"]

function MealItem({ meal }: { meal: Meal }) {
  if (meal.kind === "special") {
    return (
      <li className="meal-special">
        <span className="meal-name">{meal.name}</span> · plat spécial
      </li>
    )
  }
  const { recipe } = meal
  if (recipe.name) {
    return (
      <li>
        <span className="meal-name">{recipe.name}</span> · {recipe.ingredients.join(" · ")}
      </li>
    )
  }
  return <li>{recipe.ingredients.join(" · ")}</li>
}

function SessionBlock({ title, session }: { title: string; session: SessionPlan }) {
  return (
    <div className="session">
      <h3>{title}</h3>
      <ul className="meal-list">
        {session.meals.map((meal, i) => (
          <MealItem key={i} meal={meal} />
        ))}
      </ul>
      {session.toPrepare.length > 0 && (
        <p className="hint">
          À préparer : {session.toPrepare.map(({ ingredient, count }) => `${ingredient} ×${count}`).join(", ")}
        </p>
      )}
    </div>
  )
}

export function BatchCookingPage() {
  const [occasion, setOccasion] = useState<Occasion>(CURRENT_SEASON)
  const [mealCount, setMealCount] = useState(7)
  const [plan, setPlan] = useState<WeekPlan | null>(null)
  const hasMeals = plan !== null && plan.sessions.some(session => session.meals.length > 0)

  return (
    <>
      <p className="tagline">Planification de batch cooking</p>

      <section className="card card--sun">
        <h2>Semaine</h2>
        <div className="row">
          <label>
            Occasion
            <select value={occasion} onChange={e => setOccasion(e.target.value as Occasion)}>
              {OCCASIONS.map(o => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label>
            Nombre de repas
            <input
              type="number"
              min={2}
              max={14}
              value={mealCount}
              onChange={e => setMealCount(Math.max(2, Math.min(14, Number(e.target.value) || 2)))}
            />
          </label>
        </div>
      </section>

      {plan && !hasMeals && (
        <section className="card card--candy">
          <h2>Repas de la semaine</h2>
          <p className="hint">
            Aucune recette n'est compatible avec cette occasion — ajoute des recettes dans
            src/batchCooking/recipes.ts (et vérifie les libellés exacts des ingrédients saisonniers).
          </p>
        </section>
      )}

      {plan && hasMeals && (
        <>
          <section className="card card--candy">
            <h2>Repas de la semaine</h2>
            <div className="session-list">
              {plan.sessions.map((session, i) => (
                <SessionBlock key={i} title={SESSION_TITLES[i]} session={session} />
              ))}
            </div>
          </section>

          <section className="card card--sky">
            <h2>Liste de courses</h2>
            <div className="shopping-columns">
              <section>
                <h3>Ingrédients (× nombre de plats)</h3>
                <ul>
                  {plan.shopping.map(({ ingredient, count }) => (
                    <li key={ingredient}>
                      {ingredient} ×{count}
                    </li>
                  ))}
                </ul>
              </section>
              {plan.specialDish && (
                <section>
                  <h3>Plat spécial · {plan.specialDish.name}</h3>
                  <ul>
                    {plan.specialDish.ingredients.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {plan.specialDish.note && <p className="hint">{plan.specialDish.note}</p>}
                </section>
              )}
            </div>
          </section>

          <section className="card card--candy">
            <h2>Petit déj, desserts &amp; snacks</h2>
            <div className="shopping-columns">
              <section>
                <h3>Fruits</h3>
                <ul>
                  {plan.sweet.fruits.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Fruits à coque &amp; snacks</h3>
                <ul>
                  {plan.sweet.snacks.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Petit déjeuner</h3>
                <ul>
                  {plan.sweet.breakfast.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </section>
        </>
      )}

      <button type="button" className="generate" onClick={() => setPlan(generateWeekPlan(occasion, mealCount))}>
        {plan ? "Regénérer" : "Générer la semaine"}
      </button>
    </>
  )
}
