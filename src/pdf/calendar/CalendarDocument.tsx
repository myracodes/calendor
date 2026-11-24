import { Document } from "@react-pdf/renderer"
import { CALENDAR_TEXTS } from "../../calendar/languages"
import { addMonths } from "../../dates"
import type { LifeEventEntry } from "../../lifeEvents/types"
import type { CalendarSettings } from "../../types"
import { AnnualPage } from "./AnnualPage"
import { MonthPage } from "./MonthPage"
import { WeekPage } from "./WeekPage"

interface CalendarDocumentProps {
  settings: CalendarSettings
  /** Anniversaires et décès enregistrés en base, affichés selon les réglages. */
  lifeEvents: LifeEventEntry[]
}

export function CalendarDocument({
  settings,
  lifeEvents,
}: CalendarDocumentProps) {
  const title = CALENDAR_TEXTS.documentTitle[settings.language]

  if (settings.format === "annual") {
    return (
      <Document title={title}>
        <AnnualPage
          settings={settings}
          lifeEvents={lifeEvents}
          year={settings.year}
        />
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
          lifeEvents={lifeEvents}
          year={year}
          month={month}
        />
      ))}
    </Document>
  )
}
