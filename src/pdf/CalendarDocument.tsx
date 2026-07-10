import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { ComponentProps } from "react"
import { addMonths, monthGrid, monthName, weekIndex, weekdayNames } from "../dates"
import { BIRTHDAYS } from "../events/birthdays"
import { DEATHS } from "../events/deaths"
import type { LifeEvent } from "../events/lifeEvents.type"
import { OTHER_EVENTS } from "../events/otherEvents"
import { publicHolidaysForYear } from "../events/publicHolidays"
import type { CalendarEvent, CalendarSettings } from "../types"
import { WeekdayHeaderCell } from "./WeekdayHeaderCell"
import { backgroundForMonth } from "./monthBackgrounds"
import { BIRTHDAY, DEATH, FESTIVE, INK, INK_LIGHT, LINE, PAPER, RAINBOW } from "./theme"

// BASE_URL makes the public/ paths work both locally ("/") and on
// GitHub Pages ("/calendor/").
const BASE = import.meta.env.BASE_URL

// Dimensions d'une page A4 paysage, en points — nécessaires (plutôt que des
// pourcentages) pour positionner une image de fond en absolute : react-pdf
// (moteur de layout Yoga) mesure mal les pourcentages sur les nœuds absolus
// à la racine d'une Page, ce qui fait déborder le contenu sur une 2e page.
const PAGE_WIDTH_PT = 841.89
const PAGE_HEIGHT_PT = 595.28

Font.register({
  family: "PatrickHand",
  src: `${BASE}fonts/PatrickHand-Regular.ttf`,
})
Font.register({
  family: "BadScript",
  src: `${BASE}fonts/BadScript-Regular.ttf`,
})
// Handwritten text should not be hyphenated.
Font.registerHyphenationCallback(word => [word])
// Text fonts have no emoji glyphs; emojis are rendered from local Twemoji
// PNGs (public/emoji/<codepoints>.png — add the file when using a new emoji).
Font.registerEmojiSource({ format: "png", url: `${BASE}emoji/` })

const SURFACE = "rgba(255, 255, 255, 0.65)" // légèrement transparent pour laisser deviner l'image de fond

// Le dégradé arc-en-ciel de l'app, simulé par une rangée de segments colorés
// (react-pdf ne supporte pas les dégradés CSS).
const RAINBOW_SEGMENTS = RAINBOW.map(
  color => StyleSheet.create({ segment: { flexGrow: 1, backgroundColor: color } }).segment,
)

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "PatrickHand",
    flexDirection: "column",
  },
  // Image couvrant toute la page en mode "fond de page".
  pageBackgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH_PT,
    height: PAGE_HEIGHT_PT,
    objectFit: "cover",
  },
  // Voile clair par-dessus l'image de fond pour garder le texte lisible.
  pageBackgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH_PT,
    height: PAGE_HEIGHT_PT,
    backgroundColor: PAPER,
    opacity: 0.78,
  },
  pageContent: {
    flexGrow: 1,
    flexDirection: "column",
    padding: 24,
  },
  header: {
    flexDirection: "column",
    marginBottom: 12,
    marginTop: -12,
  },
  monthTitle: {
    fontFamily: "BadScript",
    fontSize: 20,
    textTransform: "capitalize",
  },
  // Équivalent du liseré sous le titre de l'app (h1::after)
  titleUnderline: {
    flexDirection: "row",
    width: 130,
    height: 2,
  },
  grid: {
    flexGrow: 1,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: LINE,
  },
  // Liseré coloré en haut de la grille, comme sur les cartes de l'app
  gridAccent: {
    flexDirection: "row",
    height: 5,
  },
  weekdayRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
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
    fontFamily: "BadScript",
    fontSize: 10,
    marginTop: -2,
  },
  holidayTag: {
    fontFamily: "PatrickHand",
    fontWeight: "normal",
    fontSize: 7,
    color: INK_LIGHT,
  },
  event: {
    fontSize: 8,
    lineHeight: 1.15,
    color: INK,
  },
  lifeEvent: {
    fontSize: 8,
    lineHeight: 1.15,
  },
  birthday: {
    color: BIRTHDAY,
  },
  death: {
    color: DEATH,
  },
  festive: {
    color: FESTIVE,
  },
})

// Anniversaires et décès partagent le même affichage : emoji + nom + année.
// Pour ajouter un type d'événement de vie, ajouter une entrée ici (et le
// PNG Twemoji de l'emoji dans public/emoji/).
const LIFE_EVENT_TYPES = [
  {
    emoji: "🎂",
    events: BIRTHDAYS,
    style: styles.birthday,
    showAge: true,
    isEnabled: (settings: CalendarSettings) => settings.includeBirthdays,
  },
  {
    emoji: "🕯️",
    events: DEATHS,
    style: styles.death,
    showAge: false,
    isEnabled: (settings: CalendarSettings) => settings.includeDeaths,
  },
  {
    events: OTHER_EVENTS,
    style: styles.festive,
    showAge: false,
    isEnabled: (settings: CalendarSettings) => settings.includeOtherEvents,
  },
]

function lifeEventsForDay(events: LifeEvent[], month: number, day: number): LifeEvent[] {
  return events.filter(event => event.month === month && event.day === day)
}

/**
 * "🎂 Papi (1924 / 103 ans)" avec showAge, "🕯️ Bastien (2024)" sans.
 * Rien entre parenthèses si l'année est inconnue.
 */
function lifeEventLabel(emoji: string, event: LifeEvent, calendarYear: number, showAge: boolean): string {
  if (event.year === undefined) return `${emoji} ${event.name}`
  const detail = showAge ? `${event.year} — ${calendarYear - event.year} ans` : `${event.year}`
  return `${emoji} ${event.name} (${detail})`
}

/** Bande dégradée façon "gradient-rainbow" de l'app. */
function RainbowBar({ style }: { style: ComponentProps<typeof View>["style"] }) {
  return (
    <View style={style}>
      {RAINBOW_SEGMENTS.map((segment, i) => (
        <View key={RAINBOW[i]} style={segment} />
      ))}
    </View>
  )
}

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

interface MonthPageProps {
  settings: CalendarSettings
  year: number
  month: number
}

function MonthPage({ settings, year, month }: MonthPageProps) {
  const weeks = monthGrid(year, month)
  const weekdays = weekdayNames()
  const publicHolidays = publicHolidaysForYear(year)

  // L'image envoyée par l'utilisateur remplace l'image par défaut ;
  // sans upload, l'image par défaut du mois est utilisée en fond de page.
  const backgroundImage = settings.illustration ?? backgroundForMonth(month)

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Image fixed style={styles.pageBackgroundImage} src={backgroundImage} />
      <View fixed style={styles.pageBackgroundOverlay} />

      <View style={styles.pageContent}>
        <View style={styles.header}>
          <Text style={styles.monthTitle}>
            {monthName(month)} {year}
          </Text>
          <RainbowBar style={styles.titleUnderline} />
        </View>

        <View style={styles.grid}>
          <RainbowBar style={styles.gridAccent} />
          <View style={styles.weekdayRow}>
            {weekdays.map((name, weekday) => (
              <WeekdayHeaderCell key={name} name={name} weekday={weekday} showSchedules={settings.includeSchedules} />
            ))}
          </View>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={weekIndex === 0 ? [styles.week, styles.firstWeek] : styles.week}>
              {week.map(({ day, iso, weekday }, cellIndex) => (
                <View key={cellIndex} style={cellIndex === 0 ? [styles.dayCell, styles.firstDayCell] : styles.dayCell}>
                  {day !== null && iso !== null ? (
                    <>
                      <Text style={styles.dayNumber}>
                        {day}
                        {lifeEventsForDay(publicHolidays, month, day).length > 0 ? (
                          <Text style={styles.holidayTag}> · férié</Text>
                        ) : null}
                      </Text>
                      {LIFE_EVENT_TYPES.filter(kind => kind.isEnabled(settings)).map(kind =>
                        lifeEventsForDay(kind.events, month, day).map(event => (
                          <Text key={`${kind.emoji}-${event.name}`} style={[styles.lifeEvent, kind.style]}>
                            {kind.emoji
                              ? lifeEventLabel(kind.emoji, event, year, kind.showAge)
                              : lifeEventLabel("", event, year, kind.showAge)}
                          </Text>
                        )),
                      )}
                      {eventsForDay(settings.events, day, iso, weekday).map(event => (
                        <Text
                          key={event.id}
                          style={[
                            styles.event,
                            { color: event.color ?? (event.rule.kind === "daily" ? INK_LIGHT : INK) },
                          ]}
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
      </View>
    </Page>
  )
}

export function CalendarDocument({ settings }: { settings: CalendarSettings }) {
  const months = Array.from({ length: settings.monthCount }, (_, i) => addMonths(settings.year, settings.startMonth, i))

  return (
    <Document title="Calendrier">
      {months.map(({ year, month }) => (
        <MonthPage key={`${year}-${month}`} settings={settings} year={year} month={month} />
      ))}
    </Document>
  )
}
