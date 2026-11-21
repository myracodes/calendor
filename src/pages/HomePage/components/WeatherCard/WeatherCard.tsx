import { useWeather } from "../../../../home/useWeather"
import { WEATHER_CITIES } from "../../../../home/weatherCities"
import { Card } from "../../../../shared/Card/Card"
import { CityWeatherRow } from "../CityWeatherRow/CityWeatherRow"
import "./WeatherCard.css"

/** Météo du jour de chaque ville de WEATHER_CITIES. */
export function WeatherCard() {
  const states = useWeather(WEATHER_CITIES)

  return (
    <Card variantColor="sky">
      <h2>Météo</h2>
      <ul className="weather-card-list">
        {WEATHER_CITIES.map(city => (
          <li key={city.name} className="weather-card-entry">
            <CityWeatherRow name={city.name} state={states[city.name]} />
          </li>
        ))}
      </ul>
      {/* Mention demandée par la licence des données (CC BY 4.0). */}
      <p className="hint">
        Données météo :{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
      </p>
    </Card>
  )
}
