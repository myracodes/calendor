import { useEffect, useState } from "react"
import { fetchCityWeather } from "./fetchCityWeather"
import type { CityWeatherState, WeatherCity } from "./types"

/**
 * Météo de chaque ville, chargée au montage : chaque ville s'affiche dès que
 * sa réponse arrive, et une ville en erreur n'empêche pas les autres.
 */
export function useWeather(
  cities: WeatherCity[],
): Record<string, CityWeatherState> {
  const [states, setStates] = useState<Record<string, CityWeatherState>>(() =>
    Object.fromEntries(cities.map(city => [city.name, { status: "loading" }])),
  )

  useEffect(() => {
    // Ignore une réponse arrivée après le démontage (ex. changement de page).
    let cancelled = false
    for (const city of cities) {
      fetchCityWeather(city)
        .then(weather => ({ status: "loaded" as const, weather }))
        .catch((error: Error) => ({
          status: "error" as const,
          message: error.message,
        }))
        .then(state => {
          if (!cancelled) {
            setStates(previous => ({ ...previous, [city.name]: state }))
          }
        })
    }
    return () => {
      cancelled = true
    }
  }, [cities])

  return states
}
