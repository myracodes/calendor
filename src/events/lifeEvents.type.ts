import type { Month } from "../constants/months"

export interface LifeEvent {
  name: string
  day: number // 1-31
  month: Month // constantes MONTH (1 = janvier … 12 = décembre)
  year?: number // année de naissance ou de décès (optionnelle : sans elle, seul le nom est affiché)
  /**
   * Personne décédée. La présence de l'objet fait office de booléen (absent = en vie) :
   * le calendrier n'affiche alors plus l'âge mais "naissance-mort" (ex. "Papi (1927-2003)"),
   * ou l'année de naissance seule si l'année de décès n'est pas renseignée.
   */
  died?: { year?: number }
}
