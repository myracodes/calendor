import { monthName } from "../../dates"
import type { CalendarSettings, SettingsUpdater } from "../../types"

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

interface PeriodSectionProps {
  settings: CalendarSettings
  onUpdate: SettingsUpdater
}

export function PeriodSection({ settings, onUpdate }: PeriodSectionProps) {
  return (
    <section className="card card--sun">
      <h2>Période</h2>
      <div className="row">
        <label>
          Année
          <input type="number" value={settings.year} onChange={e => onUpdate("year", Number(e.target.value))} />
        </label>
        <label>
          Premier mois
          <select value={settings.startMonth} onChange={e => onUpdate("startMonth", Number(e.target.value))}>
            {MONTHS.map(m => (
              <option key={m} value={m}>
                {monthName(m)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nombre de mois
          <input
            type="number"
            min={1}
            max={24}
            value={settings.monthCount}
            onChange={e => onUpdate("monthCount", Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
          />
        </label>
      </div>
    </section>
  )
}
