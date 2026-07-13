/** Largeur d'une colonne à pointillés : petit (une lettre), moyen (quelques mots), grand (le reste de la page). */
export type DottedWidth = "small" | "medium" | "large"

export interface BujoColumn {
  id: string
  /** intitulé affiché en tête de colonne */
  label: string
  /** contenu de chaque ligne : une case à cocher, ou une ligne pointillée à écrire */
  kind: "checkbox" | "dotted"
  /** largeur de la colonne — ignorée pour les cases à cocher (largeur fixe) */
  width: DottedWidth
}

export interface BujoSettings {
  /** titre affiché en haut de la page (aucun titre si vide) */
  title: string
  orientation: "portrait" | "landscape"
  /** nombre de pages identiques à générer */
  pageCount: number
  columns: BujoColumn[]
}
