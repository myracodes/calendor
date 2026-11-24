import type { Month } from "../constants/months"

export interface LifeEvent {
  name: string
  day: number // 1-31
  month: Month // constantes MONTH (1 = janvier … 12 = décembre)
  year?: number // année de naissance ou de décès (optionnelle : sans elle, seul le nom est affiché)
  /**
   * Anniversaire d'une personne décédée : l'année de son décès. Le calendrier
   * n'affiche alors plus l'âge mais "naissance-décès" (ex. "Papi (1924-2003)").
   */
  deathYear?: number
}
