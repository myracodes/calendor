import { birthdaysOn } from "../../../../home/today"
import { lifeEventLabel } from "../../../../pdf/calendar/calendarData"
import { Card } from "../../../../shared/Card/Card"

interface BirthdaysCardProps {
  date: Date
}

/** Les anniversaires du jour, libellés comme sur le calendrier (« 🎂 Maman (1963 — 63 ans) »). */
export function BirthdaysCard({ date }: BirthdaysCardProps) {
  const birthdays = birthdaysOn(date)

  return (
    <Card variantColor="candy">
      <h2>Anniversaires du jour</h2>
      {birthdays.length === 0 ? (
        <p className="hint">Pas d'anniversaire aujourd'hui.</p>
      ) : (
        <ul className="home-list">
          {birthdays.map(birthday => (
            <li key={`${birthday.name}-${birthday.year}`}>
              {lifeEventLabel("🎂", birthday, date.getFullYear(), true)}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
