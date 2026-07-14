import type { Weekday } from "../constants/weekdays"

export interface Schedule {
  name: string
  /** jour de la semaine (constantes WEEKDAY : 0 = lundi … 6 = dimanche) */
  weekday: Weekday
  /** e.g. "11h-19h" — omise quand il n'y a pas d'horaire fixe */
  hours?: string
  /** couleur du texte ; repli sur la couleur générique du thème si omise */
  color?: string
}
