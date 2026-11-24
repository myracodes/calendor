import { useNow } from "../../home/useNow"
import { useLifeEvents } from "../../lifeEvents/useLifeEvents"
import { TodayCard } from "./components/TodayCard/TodayCard"
import { WeatherCard } from "./components/WeatherCard/WeatherCard"

// Page d'accueil, ouverte par le titre de l'app : la journée en un coup d'œil.
export function HomePage() {
  // Une seule horloge pour toutes les cards : à minuit, tout passe au jour suivant ensemble.
  const now = useNow()
  const lifeEvents = useLifeEvents()

  return (
    <>
      <TodayCard
        now={now}
        lifeEvents={lifeEvents.entries}
        lifeEventsError={lifeEvents.loadError}
      />
      <WeatherCard />
    </>
  )
}
