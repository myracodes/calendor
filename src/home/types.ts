/** Ville dont la page d'accueil affiche la météo. */
export interface WeatherCity {
  name: string
  latitude: number
  longitude: number
}

/** Météo du jour d'une ville, températures en °C arrondies au degré. */
export interface CityWeather {
  /** Code météo WMO du moment (voir weatherCodes.ts). */
  weatherCode: number
  temperature: number
  min: number
  max: number
  /** Probabilité de pluie la plus forte de la journée, en % ; null si le modèle ne la donne pas. */
  rainChance: number | null
}

/** Où en est le chargement de la météo d'une ville : chacune est chargée à part. */
export type CityWeatherState =
  | { status: "loading" }
  | { status: "loaded"; weather: CityWeather }
  | { status: "error"; message: string }
