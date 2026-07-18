// Types du CV. Le contenu vit dans dataFr.ts / dataEn.ts : pour faire évoluer le CV,
// ce sont les seuls fichiers à modifier (les composants de src/pdf/ ne font que l'afficher).

/** Numéro de page du CV (document sur 2 pages). */
export type CvPageNumber = 1 | 2

/** Les langues disponibles du CV (un fichier de données par langue : dataFr.ts, dataEn.ts). */
export type CvLanguage = "fr" | "en"

/**
 * Les accroches disponibles : "dev" (par défaut) pour postuler à des postes de
 * développeuse, "management" pour des postes de cheffe de projet / scrum master.
 * Les textes vivent dans la locale de chaque langue (voir CvLocale),
 * le choix se fait sur la page CV à la génération.
 */
export type CvAccroche = "dev" | "management"

/** Une ligne du bloc contact : un texte, avec une URL si la ligne est cliquable. */
export type ContactLine = {
  texte: string
  url?: string
}

/**
 * Un item d'une section de la colonne de gauche.
 * `titre` (optionnel) est mis en avant en violet gras, `texte` suit en dessous
 * (une ligne par élément du tableau).
 */
export type SidebarItem = {
  titre?: string
  texte: string[]
}

/** Une section de la colonne de gauche (Formation, Compétences…), affectée à une page. */
export type SidebarSection = {
  titre: string
  page: CvPageNumber
  items: SidebarItem[]
}

/**
 * Un projet mené au sein d'une même expérience (ex. mission client et projets
 * internes en ESN). Tous les projets d'une expérience partagent la même mise
 * en page : nom en gras violet, puis équipe, contexte et missions.
 */
export type Projet = {
  nom: string
  /** Composition de l'équipe (optionnel). */
  equipe?: string
  /** Contexte du projet (optionnel, une ligne par élément du tableau). */
  contexte?: string[]
  missions: string[]
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
  /** Missions de l'expérience — absentes quand l'expérience est découpée en `projets`. */
  missions?: string[]
  /** Projets distincts au sein de l'expérience, chacun avec ses propres équipe/contexte/missions. */
  projets?: Projet[]
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

/** Le CV complet, tel que rendu par CvDocument. Assemblé à la génération (voir CvPage.tsx). */
export type CvData = {
  nom: string
  /** Titre du CV, choisi à la génération (saisie libre, ou titre par défaut de l'accroche — voir CvLocale). */
  titre: string
  /** Titres des sections de la colonne principale, dans la langue du CV. */
  sections: {
    experiences: string
    experiencesSuite: string
    sideProjects: string
  }
  /** Paragraphe d'introduction sous le titre : l'accroche choisie à la génération (voir CvLocale). */
  accroche: string
  /** URL de la photo (src/assets/images/cv-photo.jpg), ou null si aucune photo n'est fournie. */
  photo: string | null
  contact: ContactLine[]
  /** Ligne d'informations pratiques sous le bloc contact. */
  infos: string
  sidebar: SidebarSection[]
  experiences: Experience[]
  /** Affichés après les expériences de leur page, sous le titre "Side projects". */
  sideProjects: SideProject[]
}

/**
 * Le contenu que les fichiers de langue fournissent : un CvData sans les
 * champs injectés à la génération (titre saisi/choisi, accroche choisie,
 * photo importée). Les écrire dans les données serait mensonger : ils sont
 * systématiquement remplacés, et ce type rend l'oubli d'une injection
 * impossible à compiler.
 */
export type CvContent = Omit<CvData, "titre" | "accroche" | "photo">

/**
 * Tout le contenu d'une langue du CV : les données, plus l'accroche et le
 * titre par défaut de chaque type de poste visé. Chaque fichier de langue
 * (dataFr.ts, dataEn.ts) exporte un unique objet de ce type — c'est lui qui
 * garantit que les deux langues restent structurellement symétriques.
 */
export type CvLocale = {
  cv: CvContent
  accroches: Record<CvAccroche, string>
  titres: Record<CvAccroche, string>
}
