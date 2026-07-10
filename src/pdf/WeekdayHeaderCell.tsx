import { StyleSheet, Text, View } from "@react-pdf/renderer"
import { schedulesForWeekday } from "../events/schedules"
import type { Schedule } from "../events/schedules.type"
import { INK, SCHEDULE } from "./theme"

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  name: {
    fontFamily: "BadScript",
    fontSize: 10,
    textTransform: "capitalize",
    color: INK,
  },
  schedule: {
    fontSize: 6.5,
    lineHeight: 1.2,
    textAlign: "center",
  },
})

/** "L'écume 11h-19h", ou juste "Marché" quand aucun horaire n'est renseigné. */
function scheduleLabel(schedule: Schedule): string {
  return schedule.hours ? `${schedule.name} ${schedule.hours}` : schedule.name
}

// Chaque lieu peut avoir sa propre couleur (voir src/events/schedules.ts) ;
// on la transforme en style via StyleSheet.create, mis en cache par couleur,
// plutôt que d'injecter un objet de style directement dans le JSX.
const scheduleColorStyles = new Map<string, { color: string }>()
function scheduleColorStyle(color: string) {
  let style = scheduleColorStyles.get(color)
  if (!style) {
    style = StyleSheet.create({ text: { color } }).text
    scheduleColorStyles.set(color, style)
  }
  return style
}

interface WeekdayHeaderCellProps {
  name: string
  /** 0 = lundi … 6 = dimanche */
  weekday: number
  showSchedules: boolean
}

/** En-tête d'une colonne de jour : son nom, et les horaires récurrents qui s'y rattachent. */
export function WeekdayHeaderCell({ name, weekday, showSchedules }: WeekdayHeaderCellProps) {
  const schedules = showSchedules ? schedulesForWeekday(weekday) : []

  return (
    <View style={styles.cell}>
      <Text style={styles.name}>{name}</Text>
      {schedules.map(schedule => (
        <Text
          key={`${schedule.name}-${schedule.hours ?? ""}`}
          style={[styles.schedule, scheduleColorStyle(schedule.color ?? SCHEDULE)]}
        >
          {scheduleLabel(schedule)}
        </Text>
      ))}
    </View>
  )
}
