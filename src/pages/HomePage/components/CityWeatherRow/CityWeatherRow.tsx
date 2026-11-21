import { formatTemperature } from "../../../../home/format"
import type { CityWeatherState } from "../../../../home/types"
import { describeWeather } from "../../../../home/weatherCodes"
import "./CityWeatherRow.css"

interface CityWeatherRowProps {
  name: string
  state: CityWeatherState
}

/** Une ville : pictogramme et libellé du temps, min/max et risque de pluie du jour, température du moment. */
export function CityWeatherRow({ name, state }: CityWeatherRowProps) {
  if (state.status !== "loaded") {
    return (
      <div className="city-weather">
        <span className="city-weather-emoji" />
        <div>
          <p className="city-weather-name">{name}</p>
          {state.status === "loading" ? (
            <p className="city-weather-detail">Chargement…</p>
          ) : (
            <p className="city-weather-error">{state.message}</p>
          )}
        </div>
      </div>
    )
  }

  const { weather } = state
  const description = describeWeather(weather.weatherCode)
  const detail = [
    description.label,
    `min ${formatTemperature(weather.min)}`,
    `max ${formatTemperature(weather.max)}`,
    weather.rainChance !== null && `pluie ${weather.rainChance} %`,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <div className="city-weather">
      {/* Le libellé du temps est écrit à côté : l'emoji n'est pas lu. */}
      <span className="city-weather-emoji" aria-hidden="true">
        {description.emoji}
      </span>
      <div>
        <p className="city-weather-name">{name}</p>
        <p className="city-weather-detail">{detail}</p>
      </div>
      <p className="city-weather-temperature">
        {formatTemperature(weather.temperature)}
      </p>
    </div>
  )
}
