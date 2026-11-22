import {
  formatBirthday,
  formatLongDate,
  formatTime,
} from "../../../../home/format"
import {
  birthdaysOn,
  publicHolidayOn,
  schedulesOn,
} from "../../../../home/today"
import { Card } from "../../../../shared/Card/Card"
import "./TodayCard.css"

interface TodayCardProps {
  now: Date
}

/**
 * La journée en deux colonnes : à gauche la date, l'heure, le jour férié et les anniversaires ;
 * à droite les horaires hebdomadaires du jour (marché, bibliothèque, piscine…).
 */
export function TodayCard({ now }: TodayCardProps) {
  const holiday = publicHolidayOn(now)
  const birthdays = birthdaysOn(now)
  const schedules = schedulesOn(now)

  return (
    <Card variantColor="sun">
      <div className="today-card-columns">
        <div className="today-card-column">
          <h2 className="today-card-date">{formatLongDate(now)}</h2>
          <p className="today-card-time">{formatTime(now)}</p>
          {holiday !== undefined && (
            <p className="today-card-holiday">Jour férié : {holiday.name}</p>
          )}
          {birthdays.length > 0 && (
            <ul className="today-card-list">
              {birthdays.map(birthday => (
                <li key={`${birthday.name}-${birthday.year}`}>
                  {formatBirthday(birthday, now.getFullYear())}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="today-card-column today-card-schedules">
          {schedules.length === 0 ? (
            <p className="hint">Rien de prévu aujourd'hui.</p>
          ) : (
            <ul className="today-card-list">
              {schedules.map(schedule => (
                <li key={schedule.name}>
                  <span className="today-card-list-label">{schedule.name}</span>
                  {schedule.hours !== undefined && ` : ${schedule.hours}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  )
}
