import { useState } from "react"
import { generateWeekPlan, type Meal, type WeekPlan } from "../../batchCooking/generator"
import { type Occasion, OCCASIONS, seasonForMonth } from "../../batchCooking/ingredients"
import "./BatchCookingPage.css"

const CURRENT_SEASON = seasonForMonth(new Date().getMonth() + 1)

const SESSION_TITLES = {
  1: "Session 1 (dimanche) — début de semaine",
  2: "Session 2 (mercredi) — fin de semaine",
} as const

function MealItem({ meal }: { meal: Meal }) {
  if (meal.kind === "special") {
    return (
      <li className="meal-special">
        <span className="meal-protein">{meal.name}</span> · plat spécial
      </li>
    )
  }
  const { combo } = meal
  return (
    <li>
      <span className="meal-protein">{combo.name ?? combo.protein}</span>
      {combo.name ? ` · ${combo.protein}` : ""} · {combo.starch} · {combo.vegetables.join(" & ")}
    </li>
  )
}

export function BatchCookingPage() {
  const [occasion, setOccasion] = useState<Occasion>(CURRENT_SEASON)
  const [mealCount, setMealCount] = useState(7)
  const [plan, setPlan] = useState<WeekPlan | null>(null)

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

      {plan && plan.meals.length === 0 && (
        <section className="card card--candy">
          <h2>Repas de la semaine</h2>
          <p className="hint">
            Aucune combinaison de repas n'est compatible avec cette occasion — ajoute des combinaisons dans
            src/batchCooking/meals.ts (avec les libellés exacts des ingrédients).
          </p>
        </section>
      )}

      {plan && plan.meals.length > 0 && (
        <>
          <section className="card card--candy">
            <h2>Repas de la semaine</h2>
            <div className="session-list">
              {([1, 2] as const).map(session => (
                <div key={session} className="session">
                  <h3>{SESSION_TITLES[session]}</h3>
                  <ul className="meal-list">
                    {plan.meals
                      .filter(meal => meal.session === session)
                      .map((meal, i) => (
                        <MealItem key={i} meal={meal} />
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="card card--sky">
            <h2>Liste de courses</h2>
            <div className="shopping-columns">
              <section>
                <h3>Protéines</h3>
                <ul>
                  {plan.shopping.proteins.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Féculents</h3>
                <ul>
                  {plan.shopping.starches.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Légumes</h3>
                <ul>
                  {plan.shopping.vegetables.map(item => (
                    <li key={item}>{item}</li>
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
