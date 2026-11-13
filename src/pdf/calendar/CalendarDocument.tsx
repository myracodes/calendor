import { Document } from "@react-pdf/renderer"
import { CALENDAR_TEXTS } from "../../calendar/languages"
import { addMonths } from "../../dates"
import type { CalendarSettings } from "../../types"
import { AnnualPage } from "./AnnualPage"
import { MonthPage } from "./MonthPage"
import { WeekPage } from "./WeekPage"

export function CalendarDocument({ settings }: { settings: CalendarSettings }) {
  const title = CALENDAR_TEXTS.documentTitle[settings.language]

  if (settings.format === "annual") {
    return (
      <Document title={title}>
        <AnnualPage settings={settings} year={settings.year} />
      </Document>
    )
  }

  if (settings.format === "weekly") {
    return (
      <Document title={title}>
        {Array.from({ length: settings.weekCount }, (_, i) => (
          <WeekPage key={i} language={settings.language} />
        ))}
      </Document>
    )
  }

  const months = Array.from({ length: settings.monthCount }, (_, i) =>
    addMonths(settings.year, settings.startMonth, i),
  )

  return (
    <Document title={title}>
      {months.map(({ year, month }) => (
        <MonthPage
          key={`${year}-${month}`}
          settings={settings}
          year={year}
          month={month}
        />
      ))}
    </Document>
  )
}
