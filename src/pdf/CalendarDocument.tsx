import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import { addMonths, monthGrid, monthName, weekdayNames } from '../dates'
import type { CalendarEvent, CalendarSettings } from '../types'

Font.register({
  family: 'PatrickHand',
  src: '/fonts/PatrickHand-Regular.ttf',
})
Font.register({
  family: 'Kalam',
  src: '/fonts/Kalam-Bold.ttf',
})
// Handwritten text should not be hyphenated.
Font.registerHyphenationCallback((word) => [word])

const INK = '#41382c'
const INK_LIGHT = '#8a7a63'
const PAPER = '#fbf5e9'
const LINE = '#c9b99d'

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: 'PatrickHand',
    padding: 24,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthTitle: {
    fontFamily: 'Kalam',
    fontSize: 30,
    textTransform: 'capitalize',
  },
  calendarTitle: {
    fontSize: 14,
    color: INK_LIGHT,
  },
  illustration: {
    height: 70,
    borderRadius: 4,
    objectFit: 'contain',
  },
  grid: {
    flexGrow: 1,
    borderWidth: 1.5,
    borderColor: LINE,
    borderRadius: 6,
  },
  weekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: LINE,
  },
  weekdayCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 4,
    fontSize: 12,
    textTransform: 'capitalize',
    color: INK_LIGHT,
  },
  week: {
    flexDirection: 'row',
    flexGrow: 1,
    borderTopWidth: 1,
    borderTopColor: LINE,
  },
  firstWeek: {
    borderTopWidth: 0,
  },
  dayCell: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: LINE,
    padding: 3,
  },
  firstDayCell: {
    borderLeftWidth: 0,
  },
  dayNumber: {
    fontSize: 11,
  },
  event: {
    fontSize: 8,
    lineHeight: 1.15,
    color: INK,
  },
  dailyEvent: {
    color: INK_LIGHT,
  },
})

function eventsForDay(
  events: CalendarEvent[],
  day: number,
  iso: string,
): CalendarEvent[] {
  return events.filter((event) => {
    switch (event.rule.kind) {
      case 'daily':
        return true
      case 'monthly':
        return event.rule.day === day
      case 'once':
        return event.rule.date === iso
    }
  })
}

interface MonthPageProps {
  settings: CalendarSettings
  year: number
  month: number
}

function MonthPage({ settings, year, month }: MonthPageProps) {
  const weeks = monthGrid(year, month)
  const weekdays = weekdayNames()

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.monthTitle}>
            {monthName(month)} {year}
          </Text>
          {settings.title ? (
            <Text style={styles.calendarTitle}>{settings.title}</Text>
          ) : null}
        </View>
        {settings.illustration ? (
          <Image style={styles.illustration} src={settings.illustration} />
        ) : null}
      </View>

      <View style={styles.grid}>
        <View style={styles.weekdayRow}>
          {weekdays.map((name) => (
            <Text key={name} style={styles.weekdayCell}>
              {name}
            </Text>
          ))}
        </View>
        {weeks.map((week, weekIndex) => (
          <View
            key={weekIndex}
            style={weekIndex === 0 ? [styles.week, styles.firstWeek] : styles.week}
          >
            {week.map((cell, cellIndex) => (
              <View
                key={cellIndex}
                style={
                  cellIndex === 0
                    ? [styles.dayCell, styles.firstDayCell]
                    : styles.dayCell
                }
              >
                {cell.day !== null && cell.iso !== null ? (
                  <>
                    <Text style={styles.dayNumber}>{cell.day}</Text>
                    {eventsForDay(settings.events, cell.day, cell.iso).map(
                      (event) => (
                        <Text
                          key={event.id}
                          style={
                            event.rule.kind === 'daily'
                              ? [styles.event, styles.dailyEvent]
                              : styles.event
                          }
                        >
                          • {event.label}
                        </Text>
                      ),
                    )}
                  </>
                ) : null}
              </View>
            ))}
          </View>
        ))}
      </View>
    </Page>
  )
}

export function CalendarDocument({ settings }: { settings: CalendarSettings }) {
  const months = Array.from({ length: settings.monthCount }, (_, i) =>
    addMonths(settings.year, settings.startMonth, i),
  )

  return (
    <Document title={settings.title || 'Calendrier'}>
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
