/** Un tour mesuré en même temps qu'une pesée (voir measurements.ts) : taille, ventre, hanche, cuisse. */
export type MeasurementId = "waist" | "belly" | "hip" | "thigh"

/** Une pesée : un point de la courbe, et les mesures prises le même jour. */
export interface WeightEntry {
  id: string
  /** Poids en kilos, au dixième près. */
  weightKg: number
  /** Jour de la pesée, ISO « aaaa-mm-jj » : une seule pesée par jour. */
  measuredOn: string
  /** Tours mesurés ce jour-là, en centimètres au dixième près ; null = pas mesuré. */
  measurements: Record<MeasurementId, number | null>
  /** Date d'ajout (ISO 8601), tenue par la base : remise telle quelle si on annule une suppression. */
  createdAt: string
}

/** Pesée en cours de saisie ou de modification ; id null = pas encore enregistrée. */
export interface WeightEntryDraft {
  id: string | null
  /** Poids tel que saisi dans le champ (« 65.2 »), converti en kilos à l'enregistrement. */
  weight: string
  /** Jour de la pesée ; vide = aujourd'hui. */
  measuredOn: string
  /** Tours tels que saisis ; vide = pas mesuré. */
  measurements: Record<MeasurementId, string>
}
