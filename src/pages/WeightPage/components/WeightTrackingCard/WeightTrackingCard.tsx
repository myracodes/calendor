import { todayIso } from "../../../../dates"
import { Card } from "../../../../shared/Card/Card"
import type { useToast } from "../../../../shared/Toast/useToast"
import { weightPoints } from "../../../../weight/chartPoints"
import { entriesBetween, periodStart } from "../../../../weight/periods"
import type { WeightTracking } from "../../../../weight/useWeightTracking"
import { weightChartDescription } from "../../../../weight/wording"
import { AddWeightEntryForm } from "../AddWeightEntryForm/AddWeightEntryForm"
import { LineChart } from "../LineChart/LineChart"
import { PeriodSelect } from "../PeriodSelect/PeriodSelect"
import { usePeriod } from "../PeriodSelect/usePeriod"
import { WeightGoalForm } from "../WeightGoalForm/WeightGoalForm"

interface WeightTrackingCardProps {
  tracking: WeightTracking
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * La card « Suivi » : l'ajout d'une pesée, puis sa courbe sur la période
 * choisie, jusqu'à aujourd'hui, et l'objectif qu'elle trace en pointillés.
 */
export function WeightTrackingCard({
  tracking,
  showToast,
}: WeightTrackingCardProps) {
  const { entries, goalKg } = tracking
  const [period, setPeriodId] = usePeriod("weight.period")
  const today = todayIso()
  const start = periodStart(period, entries, today)
  const points = weightPoints(entriesBetween(entries, start, today))

  function renderChart() {
    if (entries.length === 0) {
      return <p className="hint">Pas encore de pesée : ajoute la première.</p>
    }
    if (points.length === 0) {
      return <p className="hint">Aucune pesée sur cette période.</p>
    }
    return (
      <LineChart
        series={[{ id: "weight", label: "Poids", tone: "accent", points }]}
        start={start}
        end={today}
        unit="kg"
        reference={goalKg}
        description={weightChartDescription(period, points, goalKg)}
      />
    )
  }

  return (
    <Card variantColor="sun">
      <h2>Suivi</h2>
      <AddWeightEntryForm tracking={tracking} showToast={showToast} />
      <PeriodSelect period={period} onChange={setPeriodId} />
      {renderChart()}
      <WeightGoalForm tracking={tracking} showToast={showToast} />
    </Card>
  )
}
