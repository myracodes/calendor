// Météo du jour d'une ville via l'API publique et gratuite d'Open-Meteo
// (sans clé, appelable depuis le navigateur) : https://open-meteo.com/en/docs

import type { CityWeather, WeatherCity } from "./types"

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

/** Partie de la réponse lue ici ; les tableaux de `daily` n'ont qu'une valeur (forecast_days=1). */
type ForecastResponse = {
  current: { temperature_2m: number; weather_code: number }
  daily: {
    temperature_2m_min: number[]
    temperature_2m_max: number[]
    precipitation_probability_max: (number | null)[]
  }
}

export async function fetchCityWeather(
  city: WeatherCity,
): Promise<CityWeather> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m,weather_code",
    daily:
      "temperature_2m_min,temperature_2m_max,precipitation_probability_max",
    // La journée et ses min/max s'entendent à l'heure de Paris.
    timezone: "Europe/Paris",
    forecast_days: "1",
  })
  const response = await fetch(`${FORECAST_URL}?${params}`)
  if (!response.ok) {
    throw new Error(`Météo indisponible (erreur ${response.status}).`)
  }
  const { current, daily } = (await response.json()) as ForecastResponse
  return {
    weatherCode: current.weather_code,
    temperature: Math.round(current.temperature_2m),
    min: Math.round(daily.temperature_2m_min[0]),
    max: Math.round(daily.temperature_2m_max[0]),
    rainChance: daily.precipitation_probability_max[0] ?? null,
  }
}
