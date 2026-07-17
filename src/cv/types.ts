// Types du CV. Le contenu vit dans dataFr.ts / dataEn.ts : pour faire évoluer le CV,
// ce sont les seuls fichiers à modifier (les composants de src/pdf/ ne font que l'afficher).

/** Numéro de page du CV (document sur 2 pages). */
export type CvPageNumber = 1 | 2

/** Les langues disponibles du CV (un fichier de données par langue : dataFr.ts, dataEn.ts). */
export type CvLanguage = "fr" | "en"

/** Une ligne du bloc contact : un texte, avec une URL si la ligne est cliquable. */
export type ContactLine = {
  texte: string
  url?: string
}

/**
 * Un item d'une section de la colonne de gauche.
 * `titre` (optionnel) est mis en avant en violet gras, `texte` suit en dessous.
 */
export type SidebarItem = {
  titre?: string
  texte: string
}

/** Une section de la colonne de gauche (Formation, Compétences…), affectée à une page. */
export type SidebarSection = {
  titre: string
  page: CvPageNumber
  items: SidebarItem[]
}

/**
 * Une expérience professionnelle, affectée à une page.
 * Dans les textes, les segments entre `**` sont rendus en gras violet.
 */
export type Experience = {
  page: CvPageNumber
  poste: string
  /** Employeur et période, ex. "Cap Collectif (2024 - aujourd'hui)". */
  employeur: string
  /** Composition de l'équipe (optionnel). */
  equipe?: string
  /** Contexte de la mission (optionnel, une ligne par élément du tableau). */
  contexte?: string[]
  missions: string[]
  /** Technologies et outils, affichés en pied d'expérience séparés par des "/". */
  stack?: string[]
}

/**
 * Un side project : même structure et même rendu qu'une expérience.
 * `employeur` porte le type de projet et la période (ex. "Projet personnel (2026 - aujourd'hui)").
 */
export type SideProject = Experience

/**
 * Les coordonnées du CV, stockées dans Supabase (table cv_contact, voir
 * supabase/cv_contact.sql) plutôt que dans le code : le bundle déployé est
 * public, ces données ne doivent pas s'y trouver en clair.
 */
export type CvContact = Pick<CvData, "contact" | "infos">

export type CvData = {
  nom: string
  titre: string
  /** Titres des sections de la colonne principale, dans la langue du CV. */
  sections: {
    experiences: string
    experiencesSuite: string
    sideProjects: string
  }
  /** Paragraphe d'introduction sous le titre. */
  accroche: string
  /**
   * URL de la photo (src/assets/images/cv-photo.jpg), ou null si aucune photo n'est fournie.
   * si null = rond d'initiales à la place.
   */
  photo: string | null
  contact: ContactLine[]
  /** Ligne d'informations pratiques sous le bloc contact. */
  infos: string
  sidebar: SidebarSection[]
  experiences: Experience[]
  /** Affichés après les expériences de leur page, sous le titre "Side projects". */
  sideProjects: SideProject[]
}
