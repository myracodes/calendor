import { monthName } from "../../dates"
import type { CalendarFormat, CalendarSettings, SettingsUpdater } from "../../types"

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

interface PeriodSectionProps {
  settings: CalendarSettings
  onUpdate: SettingsUpdater
  // true si le modèle actif (ex. "To do list") impose le format mensuel : dans ce cas, on masque le <select>
  lockToMonthly: boolean
}

export function PeriodSection({ settings, onUpdate, lockToMonthly }: PeriodSectionProps) {
  return (
    <section className="card card--sun">
      <h2>Période</h2>
      <div className="row">
        {!lockToMonthly && (
          <label>
            Format
            <select value={settings.format} onChange={e => onUpdate("format", e.target.value as CalendarFormat)}>
              <option value="monthly">Mensuel</option>
              <option value="annual">Annuel</option>
            </select>
          </label>
        )}
        <label>
          Année
          <input type="number" value={settings.year} onChange={e => onUpdate("year", Number(e.target.value))} />
        </label>
        {settings.format === "monthly" && (
          <>
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
          </>
        )}
      </div>
    </section>
  )
}
