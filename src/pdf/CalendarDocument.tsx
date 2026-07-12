import { Document } from "@react-pdf/renderer"
import { addMonths } from "../dates"
import type { CalendarSettings } from "../types"
import { AnnualPage } from "./AnnualPage"
import { MonthPage } from "./MonthPage"

export function CalendarDocument({ settings }: { settings: CalendarSettings }) {
  if (settings.format === "annual") {
    return (
      <Document title="Calendrier">
        <AnnualPage settings={settings} year={settings.year} />
      </Document>
    )
  }

  const months = Array.from({ length: settings.monthCount }, (_, i) => addMonths(settings.year, settings.startMonth, i))

  return (
    <Document title="Calendrier">
      {months.map(({ year, month }) => (
        <MonthPage key={`${year}-${month}`} settings={settings} year={year} month={month} />
      ))}
    </Document>
  )
}
