export interface Schedule {
  name: string
  /** 0 = Monday … 6 = Sunday */
  weekday: number
  /** e.g. "11h-19h" — omise quand il n'y a pas d'horaire fixe */
  hours?: string
  /** couleur du texte ; repli sur la couleur générique du thème si omise */
  color?: string
}
