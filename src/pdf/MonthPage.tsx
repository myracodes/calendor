import { Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { BIRTHDAY, DEATH, FESTIVE, INK, INK_LIGHT, LINE, PAPER } from "../colors"
import { monthGrid, monthName, weekdayNames } from "../dates"
import { publicHolidaysForYear } from "../events/publicHolidays"
import type { CalendarSettings } from "../types"
import { eventsForDay, LIFE_EVENT_KINDS, lifeEventLabel, lifeEventsForDay } from "./calendarData"
import { backgroundForMonth } from "./monthBackgrounds"
import { PageBackground } from "./PageBackground"
import { RainbowBar, SURFACE } from "./shared"
import { WeekdayHeaderCell } from "./WeekdayHeaderCell"

const styles = StyleSheet.create({
  // Fond de la page (couleur de secours visible sous l'image de fond, le temps qu'elle charge).
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "PatrickHand",
    flexDirection: "column",
  },
  // Conteneur de tout le contenu (au-dessus de l'image de fond), avec la marge de la page.
  pageContent: {
    flexGrow: 1,
    flexDirection: "column",
    padding: 24,
  },
  // Bloc d'en-tête : titre du mois + liseré coloré en dessous.
  header: {
    flexDirection: "column",
    marginBottom: 12,
    marginTop: -12,
  },
  // Titre "<mois> <année>" en haut de page.
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
  // Cadre englobant toute la grille du mois (en-tête des jours de la semaine + semaines).
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
  // Ligne d'en-tête avec le nom de chaque jour de la semaine (une WeekdayHeaderCell par colonne).
  weekdayRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  // Une ligne de la grille = une semaine (7 jours, lundi à dimanche).
  week: {
    flexDirection: "row",
    flexGrow: 1,
    borderTopWidth: 1,
    borderTopColor: LINE,
  },
  // La toute première semaine du mois n'a pas de bordure supérieure (déjà celle de la grille).
  firstWeek: {
    borderTopWidth: 0,
  },
  // Une cellule de la grille = un jour du mois (ou une cellule vide de padding hors mois).
  dayCell: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: LINE,
    padding: 3,
  },
  // La toute première cellule d'une semaine (lundi) n'a pas de bordure gauche.
  firstDayCell: {
    borderLeftWidth: 0,
  },
  // Numéro du jour, en haut de chaque cellule ("· férié" y est ajouté inline si besoin).
  dayNumber: {
    fontFamily: "BadScript",
    fontSize: 10,
    marginTop: -2,
  },
  // Mention "· férié" accolée au numéro du jour.
  holidayTag: {
    fontFamily: "PatrickHand",
    fontWeight: "normal",
    fontSize: 7,
    color: INK_LIGHT,
  },
  // Ligne de texte d'un événement personnalisé (settings.events) dans une cellule jour.
  event: {
    fontSize: 8,
    lineHeight: 1.15,
    color: INK,
  },
  // Ligne de texte d'un événement de vie (anniversaire / décès / jour de fête) dans une cellule jour.
  lifeEvent: {
    fontSize: 8,
    lineHeight: 1.15,
  },
  // Couleur du texte pour un anniversaire (LIFE_EVENT_KINDS "birthday").
  birthday: {
    color: BIRTHDAY,
  },
  // Couleur du texte pour un décès (LIFE_EVENT_KINDS "death").
  death: {
    color: DEATH,
  },
  // Couleur du texte pour un jour de fête (LIFE_EVENT_KINDS "festive").
  festive: {
    color: FESTIVE,
  },
})

// Couleur du texte par type d'événement de vie (voir LIFE_EVENT_KINDS).
const LIFE_EVENT_STYLE: Record<(typeof LIFE_EVENT_KINDS)[number]["key"], typeof styles.birthday> = {
  birthday: styles.birthday,
  death: styles.death,
  festive: styles.festive,
}

interface MonthPageProps {
  settings: CalendarSettings
  year: number
  month: number
}

export function MonthPage({ settings, year, month }: MonthPageProps) {
  const weeks = monthGrid(year, month)
  const weekdays = weekdayNames()
  const publicHolidays = publicHolidaysForYear(year)

  // L'image envoyée par l'utilisateur remplace l'image par défaut ;
  // sans upload, l'image par défaut du mois est utilisée en fond de page.
  const backgroundImage = settings.illustration ?? backgroundForMonth(month)

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <PageBackground src={backgroundImage} />

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
                      {LIFE_EVENT_KINDS.filter(kind => kind.isEnabled(settings)).map(kind =>
                        lifeEventsForDay(kind.events, month, day).map(event => (
                          <Text
                            key={`${kind.key}-${event.name}`}
                            style={[styles.lifeEvent, LIFE_EVENT_STYLE[kind.key]]}
                          >
                            {lifeEventLabel(kind.emoji ?? "", event, year, kind.showAge)}
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
