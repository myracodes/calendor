import { useState } from "react"
import {
  downloadPdf,
  PDF_ERROR_MESSAGE,
} from "../../../../pdf/shared/downloadPdf"
import { WeeklyMealsDocument } from "../../../../pdf/weeklyMeals/WeeklyMealsDocument"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import { Card } from "../../../../shared/Card/Card"
import { useToast } from "../../../../shared/Toast/useToast"

export function WeeklyMealsTab() {
  const [generating, setGenerating] = useState(false)
  const { toast, showToast } = useToast()

  async function generatePdf() {
    setGenerating(true)
    try {
      await downloadPdf(<WeeklyMealsDocument />, "weekly-meals.pdf")
    } catch (error) {
      console.error(error)
      showToast("error", PDF_ERROR_MESSAGE)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <Card variantColor="sun">
        <h2>Page</h2>
        <p className="hint">
          Deux semaines par feuille A4, une par moitié (l'équivalent d'une page
          A5) : pour chaque jour, des lignes pointillées pour noter le petit
          déjeuner, la matinée, le déjeuner, le goûter et le dîner.
        </p>
      </Card>

      <ActionButton busy={generating} onClick={generatePdf}>
        {generating ? "Génération…" : "Générer le PDF"}
      </ActionButton>
      {toast}
    </>
  )
}
