/** Personne à qui faire un cadeau : elle a sa card et sa liste d'idées. */
export interface GiftRecipient {
  id: string
  /** Nom affiché en titre de sa card (« Maman », « Julie »…). */
  name: string
  /** Date d'ajout (ISO 8601), tenue par la base. */
  createdAt: string
}

/** Personne en cours de saisie ou de modification ; id null = pas encore enregistrée. */
export type GiftRecipientDraft = Omit<GiftRecipient, "id" | "createdAt"> & {
  id: string | null
}

export interface GiftIdea {
  id: string
  /** Personne à qui l'offrir. */
  recipientId: string
  title: string
  /** Date d'ajout (ISO 8601), tenue par la base : la plus récente en tête de liste. */
  createdAt: string
}

/** Idée en cours de saisie ou de modification ; id null = pas encore enregistrée. */
export type GiftIdeaDraft = Omit<GiftIdea, "id" | "createdAt"> & {
  id: string | null
}
