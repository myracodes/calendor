import { useNow } from "../../home/useNow"
import { TodayCard } from "./components/TodayCard/TodayCard"
import { WeatherCard } from "./components/WeatherCard/WeatherCard"

// Page d'accueil, ouverte par le titre de l'app : la journée en un coup d'œil.
export function HomePage() {
  // Une seule horloge pour toutes les cards : à minuit, tout passe au jour suivant ensemble.
  const now = useNow()

  return (
    <>
      <TodayCard now={now} />
      <WeatherCard />
    </>
  )
}
