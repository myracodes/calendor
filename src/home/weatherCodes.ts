// Codes météo WMO renvoyés par Open-Meteo, regroupés en libellés courts.
// Liste des codes : https://open-meteo.com/en/docs (section « WMO Weather interpretation codes »).

export interface WeatherDescription {
  label: string
  emoji: string
}

const WEATHER_DESCRIPTIONS: (WeatherDescription & { codes: number[] })[] = [
  { codes: [0], label: "Ciel dégagé", emoji: "☀️" },
  { codes: [1], label: "Peu nuageux", emoji: "🌤️" },
  { codes: [2], label: "Partiellement nuageux", emoji: "⛅" },
  { codes: [3], label: "Couvert", emoji: "☁️" },
  { codes: [45, 48], label: "Brouillard", emoji: "🌫️" },
  { codes: [51, 53, 55], label: "Bruine", emoji: "🌦️" },
  { codes: [56, 57, 66, 67], label: "Pluie verglaçante", emoji: "🧊" },
  { codes: [61, 63, 65], label: "Pluie", emoji: "🌧️" },
  { codes: [71, 73, 75, 77], label: "Neige", emoji: "❄️" },
  { codes: [80, 81, 82], label: "Averses", emoji: "🌦️" },
  { codes: [85, 86], label: "Averses de neige", emoji: "🌨️" },
  { codes: [95, 96, 99], label: "Orage", emoji: "⛈️" },
]

/** Repli pour un code absent de la liste (nouveau code de l'API). */
const UNKNOWN_WEATHER: WeatherDescription = {
  label: "Météo inconnue",
  emoji: "🌡️",
}

export function describeWeather(code: number): WeatherDescription {
  return (
    WEATHER_DESCRIPTIONS.find(description =>
      description.codes.includes(code),
    ) ?? UNKNOWN_WEATHER
  )
}
