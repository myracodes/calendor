import { schedulesOn } from "../../../../home/today"
import { Card } from "../../../../shared/Card/Card"

interface SchedulesCardProps {
  date: Date
}

/** Les horaires hebdomadaires du jour (marché, bibliothèque, piscine…), ceux du calendrier. */
export function SchedulesCard({ date }: SchedulesCardProps) {
  const schedules = schedulesOn(date)

  return (
    <Card variantColor="sun">
      <h2>Horaires du jour</h2>
      {schedules.length === 0 ? (
        <p className="hint">Rien de prévu aujourd'hui.</p>
      ) : (
        <ul className="home-list">
          {schedules.map(schedule => (
            <li key={schedule.name}>
              <span className="home-list-label">{schedule.name}</span>
              {schedule.hours !== undefined && ` : ${schedule.hours}`}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
