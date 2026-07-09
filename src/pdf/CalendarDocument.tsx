import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { BIRTHDAYS } from "../birthdays"
import { addMonths, monthGrid, monthName, weekIndex, weekdayNames } from "../dates"
import type { CalendarEvent, CalendarSettings } from "../types"

// BASE_URL makes the public/ paths work both locally ("/") and on
// GitHub Pages ("/calendor/").
const BASE = import.meta.env.BASE_URL

Font.register({
  family: "PatrickHand",
  src: `${BASE}fonts/PatrickHand-Regular.ttf`,
})
Font.register({
  family: "Kalam",
  src: `${BASE}fonts/Kalam-Bold.ttf`,
})
// Handwritten text should not be hyphenated.
Font.registerHyphenationCallback(word => [word])
// Text fonts have no emoji glyphs; emojis are rendered from local Twemoji
// PNGs (public/emoji/<codepoints>.png — add the file when using a new emoji).
Font.registerEmojiSource({ format: "png", url: `${BASE}emoji/` })

const INK = "#41382c"
const INK_LIGHT = "#8a7a63"
const PAPER = "#ffffff"
const LINE = "#c9b99d"
const BIRTHDAY = "#a45b90"

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "PatrickHand",
    padding: 24,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthTitle: {
    fontFamily: "Kalam",
    fontSize: 30,
    textTransform: "capitalize",
  },
  calendarTitle: {
    fontSize: 14,
    color: INK_LIGHT,
  },
  illustration: {
    height: 70,
    borderRadius: 4,
    objectFit: "contain",
  },
  grid: {
    flexGrow: 1,
    borderWidth: 1.5,
    borderColor: LINE,
    borderRadius: 6,
  },
  weekdayRow: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: LINE,
  },
  weekdayCell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 4,
    fontSize: 12,
    textTransform: "capitalize",
    color: INK_LIGHT,
  },
  week: {
    flexDirection: "row",
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
  birthday: {
    fontSize: 8,
    lineHeight: 1.15,
    color: BIRTHDAY,
  },
})

function eventsForDay(events: CalendarEvent[], day: number, iso: string, weekday: number): CalendarEvent[] {
  return events.filter(event => {
    const rule = event.rule
    switch (rule.kind) {
      case "daily":
        return true
      case "weekly": {
        if (!rule.weekdays.includes(weekday)) return false
        if (rule.interval <= 1) return true
        const diff = weekIndex(iso) - weekIndex(rule.anchor)
        return ((diff % rule.interval) + rule.interval) % rule.interval === 0
      }
      case "monthly":
        return rule.day === day
      case "once":
        return rule.date === iso
    }
  })
}

function birthdaysForDay(month: number, day: number) {
  return BIRTHDAYS.filter(b => b.month === month && b.day === day)
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
          {settings.title ? <Text style={styles.calendarTitle}>{settings.title}</Text> : null}
        </View>
        {settings.illustration ? <Image style={styles.illustration} src={settings.illustration} /> : null}
      </View>

      <View style={styles.grid}>
        <View style={styles.weekdayRow}>
          {weekdays.map(name => (
            <Text key={name} style={styles.weekdayCell}>
              {name}
            </Text>
          ))}
        </View>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={weekIndex === 0 ? [styles.week, styles.firstWeek] : styles.week}>
            {week.map((cell, cellIndex) => (
              <View key={cellIndex} style={cellIndex === 0 ? [styles.dayCell, styles.firstDayCell] : styles.dayCell}>
                {cell.day !== null && cell.iso !== null ? (
                  <>
                    <Text style={styles.dayNumber}>{cell.day}</Text>
                    {birthdaysForDay(month, cell.day).map(b => (
                      <Text key={`${b.name}-${b.year}`} style={styles.birthday}>
                        🎂 {b.name} ({b.year} / {year - b.year} ans)
                      </Text>
                    ))}
                    {eventsForDay(settings.events, cell.day, cell.iso, cell.weekday).map(event => (
                      <Text
                        key={event.id}
                        style={event.rule.kind === "daily" ? [styles.event, styles.dailyEvent] : styles.event}
                      >
                        • {event.label}
                      </Text>
                    ))}
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
  const months = Array.from({ length: settings.monthCount }, (_, i) => addMonths(settings.year, settings.startMonth, i))

  return (
    <Document title={settings.title || "Calendrier"}>
      {months.map(({ year, month }) => (
        <MonthPage key={`${year}-${month}`} settings={settings} year={year} month={month} />
      ))}
    </Document>
  )
}
