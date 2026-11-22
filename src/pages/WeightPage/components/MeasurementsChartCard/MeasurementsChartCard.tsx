import { todayIso } from "../../../../dates"
import { Card } from "../../../../shared/Card/Card"
import { measurementPoints } from "../../../../weight/chartPoints"
import { hasMeasurement, MEASUREMENTS } from "../../../../weight/measurements"
import { entriesBetween, periodStart } from "../../../../weight/periods"
import type { MeasurementId, WeightEntry } from "../../../../weight/types"
import { measurementsChartDescription } from "../../../../weight/wording"
import {
  type ChartSeries,
  type ChartTone,
  LineChart,
} from "../LineChart/LineChart"
import { PeriodSelect } from "../PeriodSelect/PeriodSelect"
import { usePeriod } from "../PeriodSelect/usePeriod"

/**
 * La couleur de chaque mesure (tokens --chart-*, distincts deux à deux),
 * toujours la même quelles que soient les mesures prises sur la période.
 */
const MEASUREMENT_TONES: Record<MeasurementId, ChartTone> = {
  waist: "plum",
  belly: "orange",
  hip: "crimson",
  thigh: "pink",
}

interface MeasurementsChartCardProps {
  /** Toutes les pesées, la plus ancienne en premier. */
  entries: WeightEntry[]
}

/**
 * Une courbe par mesure (taille, ventre, hanche, cuisse) sur la période
 * choisie, jusqu'à aujourd'hui. Une mesure jamais prise sur la période n'a
 * pas de courbe.
 */
export function MeasurementsChartCard({ entries }: MeasurementsChartCardProps) {
  const [period, setPeriodId] = usePeriod("weight.measurementsPeriod")
  const measuredEntries = entries.filter(hasMeasurement)
  const today = todayIso()
  // « Depuis le début » part de la première mesure, pas de la première pesée.
  const start = periodStart(period, measuredEntries, today)
  const periodEntries = entriesBetween(measuredEntries, start, today)
  const series: ChartSeries[] = MEASUREMENTS.map(measurement => ({
    id: measurement.id,
    label: measurement.label,
    tone: MEASUREMENT_TONES[measurement.id],
    points: measurementPoints(periodEntries, measurement.id),
  })).filter(line => line.points.length > 0)

  function renderChart() {
    if (measuredEntries.length === 0) {
      return <p className="hint">Pas encore de mesure.</p>
    }
    if (series.length === 0) {
      return <p className="hint">Aucune mesure sur cette période.</p>
    }
    return (
      <LineChart
        series={series}
        showSeriesNames
        start={start}
        end={today}
        unit="cm"
        description={measurementsChartDescription(period, series)}
      />
    )
  }

  return (
    <Card variantColor="sky">
      <h2>Mesures</h2>
      <PeriodSelect period={period} onChange={setPeriodId} />
      {renderChart()}
    </Card>
  )
}
