import { Line, Page, StyleSheet, Svg, Text, View } from "@react-pdf/renderer"
import { INK, INK_LIGHT, LINE, PAPER } from "../colors"
import { daysInMonth, weekdayOf } from "../dates"
import { publicHolidaysForYear } from "../events/publicHolidays"
import type { CalendarSettings } from "../types"
import { LIFE_EVENT_KINDS, lifeEventsForDay } from "./calendarData"
import { RainbowBar } from "./shared"

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

// Abréviations françaises usuelles ; la casse est gérée par textTransform (voir monthHeaderText).
const MONTH_LABELS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]

// Initiale du jour de la semaine ; index 0 = lundi, 6 = dimanche (même convention que weekdayOf).
const WEEKDAY_LETTERS = ["L", "M", "M", "J", "V", "S", "D"]

// Hachures obliques d'une cellule "hors mois" : chaque ligne va du haut-droite vers le
// bas-gauche, sur toute la hauteur (0 → 100). Elles débordent volontairement du cadre
// 0-100 en largeur ; le viewBox du Svg les rogne proprement aux bords de la cellule.
const HATCH_LINE_COUNT = 14
const HATCH_RUN = 35 // décalage horizontal (unités du viewBox) entre le haut et le bas d'une hachure — plus petit = plus vertical
const HATCH_LINES = Array.from({ length: HATCH_LINE_COUNT }, (_, i) => {
  // topX couvre [0, 100+RUN] pour que le bord haut soit entièrement couvert ; bottomX
  // (topX - RUN) couvre alors [-RUN, 100], ce qui couvre aussi le bord bas jusqu'à son coin
  // droit — sans ce décalage, les deux bords ne couvrent que [0,100] et [-RUN,100-RUN],
  // laissant un vide non hachuré en bas à droite.
  const topX = (i / (HATCH_LINE_COUNT - 1)) * (100 + HATCH_RUN)
  return { topX, bottomX: topX - HATCH_RUN }
})

const styles = StyleSheet.create({
  // Fond de la page.
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "PatrickHand",
    flexDirection: "column",
  },
  // Conteneur de tout le contenu, avec la marge de la page.
  pageContent: {
    flexGrow: 1,
    flexDirection: "column",
    padding: "2 4 8",
  },
  // Bloc d'en-tête : numéro de l'année + liseré coloré en dessous.
  header: {
    flexDirection: "column",
    marginBottom: 4,
    marginTop: -4,
    marginLeft: 16,
  },
  // Numéro de l'année, en haut de page (ex. "2026").
  yearTitle: {
    fontFamily: "BadScript",
    fontSize: 18,
    marginBottom: -4,
  },
  // Liseré coloré sous le numéro de l'année, équivalent du titleUnderline de MonthPage.
  titleUnderline: {
    flexDirection: "row",
    width: 60,
    height: 2,
    marginTop: 0,
  },
  // Cadre englobant tout le tableau annuel (en-tête des mois + les 31 lignes de jours).
  table: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: INK,
  },
  // Liseré coloré en haut du tableau, comme sur les cartes de l'app.
  gridAccent: {
    flexDirection: "row",
    height: 2,
  },
  // Ligne d'en-tête avec le nom de chaque mois (une cellule par mois).
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: INK,
    fontSize: 8,
    marginVertical: 0,
    paddingVertical: -2,
  },
  // Une ligne du tableau = un numéro de jour (1 à 31), répété sur les 12 colonnes de mois.
  dayRow: {
    fontSize: 8,
    flexDirection: "row",
    flexGrow: 1,
    borderTopWidth: 1,
    borderTopColor: INK,
  },
  // La toute première ligne (jour 1) n'a pas de bordure supérieure (déjà celle du tableau).
  firstDayRow: {
    borderTopWidth: 0,
  },
  // Cellule d'en-tête d'une colonne : le nom abrégé du mois (ex. "janv.").
  monthHeaderCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    borderLeftWidth: 1,
    borderLeftColor: INK,
  },
  // La toute première colonne (janvier) n'a pas de bordure gauche (déjà celle du tableau).
  firstMonthCell: {
    borderLeftWidth: 0,
  },
  // Texte du nom de mois dans l'en-tête de colonne.
  monthHeaderText: {
    fontFamily: "BadScript",
    fontSize: 8,
    textTransform: "capitalize",
  },
  // Cellule d'intersection (mois × jour) : numéro du jour + repères en haut à gauche, reste libre pour écrire.
  monthCell: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 2,
    borderLeftWidth: 1,
    borderLeftColor: INK,
  },
  // Ligne compacte (numéro du jour + éventuels repères férié/anniversaire) en haut de la cellule.
  cellMarkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Fond teinté d'une cellule tombant un week-end ou un jour férié.
  weekendCell: {
    backgroundColor: LINE,
  },
  // Fond d'une cellule "hors mois" (ex. 30 février) : jour inexistant, cellule laissée vide.
  emptyCell: {
    backgroundColor: PAPER,
    position: "relative",
  },
  // Hachures obliques recouvrant une cellule "hors mois" pour marquer le jour inexistant.
  emptyCellHatch: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  // Numéro du jour affiché dans chaque cellule (mois × jour).
  cellDayNumber: {
    fontFamily: "BadScript",
    fontSize: 6,
    color: INK_LIGHT,
  },
  // Initiale du jour de la semaine (L M M J V S D), à droite du numéro du jour.
  cellWeekdayLetter: {
    fontFamily: "PatrickHand",
    fontSize: 6,
    color: INK_LIGHT,
    marginLeft: 2,
  },
  // Repère "F" (jour férié) accolé au numéro du jour dans la cellule.
  holidayMark: {
    fontFamily: "PatrickHand",
    fontSize: 6,
    color: INK_LIGHT,
    marginLeft: 2,
  },
  // Repère 🎂 (anniversaire ce jour-là) accolé au numéro du jour dans la cellule.
  birthdayMark: {
    fontSize: 7,
    marginLeft: 2,
  },
  // Repère 🕯️ (anniversaire de décès ce jour-là) accolé au numéro du jour dans la cellule.
  deathMark: {
    fontSize: 7,
    marginLeft: 2,
  },
})

interface AnnualPageProps {
  settings: CalendarSettings
  year: number
}

export function AnnualPage({ settings, year }: AnnualPageProps) {
  const publicHolidays = publicHolidaysForYear(year)
  const birthdayKind = LIFE_EVENT_KINDS.find(kind => kind.key === "birthday")
  const birthdayEvents = birthdayKind && birthdayKind.isEnabled(settings) ? birthdayKind.events : null
  const deathKind = LIFE_EVENT_KINDS.find(kind => kind.key === "death")
  const deathEvents = deathKind && deathKind.isEnabled(settings) ? deathKind.events : null

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.pageContent}>
        <View style={styles.header}>
          <Text style={styles.yearTitle}>{year}</Text>
          <RainbowBar style={styles.titleUnderline} />
        </View>

        <View style={styles.table}>
          <RainbowBar style={styles.gridAccent} />
          <View style={styles.headerRow}>
            {MONTHS.map((month, i) => (
              <View
                key={month}
                style={i === 0 ? [styles.monthHeaderCell, styles.firstMonthCell] : styles.monthHeaderCell}
              >
                <Text style={styles.monthHeaderText}>{MONTH_LABELS[month - 1]}</Text>
              </View>
            ))}
          </View>
          {DAYS.map((day, rowIndex) => (
            <View key={day} style={rowIndex === 0 ? [styles.dayRow, styles.firstDayRow] : styles.dayRow}>
              {MONTHS.map((month, i) => {
                const baseCellStyle = i === 0 ? [styles.monthCell, styles.firstMonthCell] : [styles.monthCell]

                if (day > daysInMonth(year, month)) {
                  return (
                    <View key={month} style={[...baseCellStyle, styles.emptyCell]}>
                      <Svg style={styles.emptyCellHatch} viewBox="0 0 100 100" preserveAspectRatio="none">
                        {HATCH_LINES.map(({ topX, bottomX }, hatchIndex) => (
                          <Line
                            key={hatchIndex}
                            x1={topX}
                            y1={0}
                            x2={bottomX}
                            y2={100}
                            stroke={INK_LIGHT}
                            strokeWidth={1}
                          />
                        ))}
                      </Svg>
                    </View>
                  )
                }

                const weekday = weekdayOf(year, month, day)
                const isWeekend = weekday === 5 || weekday === 6
                const isHoliday = lifeEventsForDay(publicHolidays, month, day).length > 0
                const hasBirthday = birthdayEvents !== null && lifeEventsForDay(birthdayEvents, month, day).length > 0
                const hasDeath = deathEvents !== null && lifeEventsForDay(deathEvents, month, day).length > 0

                return (
                  <View
                    key={month}
                    style={isWeekend || isHoliday ? [...baseCellStyle, styles.weekendCell] : baseCellStyle}
                  >
                    <View style={styles.cellMarkRow}>
                      <Text style={styles.cellDayNumber}>{day}</Text>
                      <Text style={styles.cellWeekdayLetter}>{WEEKDAY_LETTERS[weekday]}</Text>
                      {isHoliday ? <Text style={styles.holidayMark}>F</Text> : null}
                      {hasBirthday ? <Text style={styles.birthdayMark}>🎂</Text> : null}
                      {hasDeath ? <Text style={styles.deathMark}>🕯️</Text> : null}
                    </View>
                  </View>
                )
              })}
            </View>
          ))}
        </View>
      </View>
    </Page>
  )
}
