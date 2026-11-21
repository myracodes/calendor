import { formatLongDate, formatTime } from "../../../../home/format"
import { publicHolidayOn } from "../../../../home/today"
import { Card } from "../../../../shared/Card/Card"
import "./TodayCard.css"

interface TodayCardProps {
  now: Date
}

/** La date, l'heure, et le nom du jour férié s'il y en a un. */
export function TodayCard({ now }: TodayCardProps) {
  const holiday = publicHolidayOn(now)

  return (
    <Card variantColor="sun">
      <h2 className="today-card-date">{formatLongDate(now)}</h2>
      <p className="today-card-time">{formatTime(now)}</p>
      {holiday !== undefined && (
        <p className="today-card-holiday">Jour férié : {holiday.name}</p>
      )}
    </Card>
  )
}
