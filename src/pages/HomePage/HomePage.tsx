import { useNow } from "../../home/useNow"
import { BirthdaysCard } from "./components/BirthdaysCard/BirthdaysCard"
import { SchedulesCard } from "./components/SchedulesCard/SchedulesCard"
import { TodayCard } from "./components/TodayCard/TodayCard"
import { WeatherCard } from "./components/WeatherCard/WeatherCard"
import "./HomePage.css"

// Page d'accueil, ouverte par le titre de l'app : la journée en un coup d'œil.
export function HomePage() {
  // Une seule horloge pour toutes les cards : à minuit, tout passe au jour suivant ensemble.
  const now = useNow()

  return (
    <>
      <TodayCard now={now} />
      <WeatherCard />
      <BirthdaysCard date={now} />
      <SchedulesCard date={now} />
    </>
  )
}
