import { WEIGHT_PERIODS, type WeightPeriod } from "../../../../weight/periods"

interface PeriodSelectProps {
  period: WeightPeriod
  onChange: (periodId: string) => void
}

/** Le choix de la période d'une courbe (2 mois … depuis le début), au-dessus d'elle. */
export function PeriodSelect({ period, onChange }: PeriodSelectProps) {
  return (
    <div className="row">
      <label>
        Période
        <select value={period.id} onChange={e => onChange(e.target.value)}>
          {WEIGHT_PERIODS.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
