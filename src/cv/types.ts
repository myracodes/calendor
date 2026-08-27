// Types du CV.
// - Le contenu vit dans src/cv/content/ (un fichier par section du CV), écrit
//   dans les deux langues à la fois (types Localized*) pour qu'une modification
//   se fasse toujours aux deux endroits en même temps.
// - buildLocale.ts résout ce contenu par langue ; les composants de src/pdf/
//   ne consomment que les types résolus (CvData, Experience…).

/** Numéro de page du CV (document sur 2 pages). */
export type CvPageNumber = 1 | 2

/** Les langues disponibles du CV. */
export type CvLanguage = "fr" | "en"

/**
 * Un texte du CV dans les deux langues, écrites côte à côte pour être
 * modifiées ensemble. Quand le texte est identique dans les deux langues
 * (nom propre, liste de technos…), utiliser la forme `{ bothLanguages: "…" }`
 * plutôt que de dupliquer : elle rend l'intention explicite — un texte
 * identique est un choix assumé, pas un oubli de traduction.
 */
export type LocalizedText =
  | { fr: string; en: string }
  | { bothLanguages: string }

/**
 * Les accroches disponibles : "dev" (par défaut) pour postuler à des postes
 * de développeuse, "hybrid" pour des postes de cheffe de projet / dev
 * à double profil technique, "pm" pour des postes de cheffe de projet.
 * Les textes vivent dans content/profile.ts, le choix se
 * fait sur la page CV à la génération.
 */
export type CvPitch = "dev" | "hybrid" | "pm"

/**
 * Un texte localisé qu'on peut en plus taguer pour une ou plusieurs accroches :
 * à la génération, un item tagué `tag: ["pm"]` remonte en tête de son tableau
 * si l'accroche "pm" est choisie, ou redescend en fin sinon (et de même pour
 * les autres accroches). `tag: ["hybrid", "pm"]` le fait remonter en tête pour
 * ces deux accroches sans dupliquer l'item. Sans tag, l'item garde sa position
 * déclarée — voir sortByPitch dans buildLocale.ts.
 *
 * `only` va plus loin qu'un tag : un item avec `only: ["pm"]` n'apparaît que
 * si l'accroche "pm" est choisie, et disparaît entièrement pour les autres
 * (au lieu d'être simplement redescendu en fin de liste). `only: ["hybrid", "pm"]`
 * l'affiche pour ces deux accroches sans dupliquer l'item — voir
 * filterByPitch dans buildLocale.ts.
 */
export type PitchTaggedText = LocalizedText & {
  tag?: CvPitch[]
  only?: CvPitch[]
}

// --- Contenu bilingue, tel qu'écrit dans src/cv/content/ ---

/** Une ligne du bloc contact : un texte, avec une URL si la ligne est cliquable. */
export type LocalizedContactLine = {
  text: LocalizedText
  url?: string
}

/**
 * Une ligne d'un item de la sidebar, qu'on peut en plus marquer `hiddenFor`
 * pour la masquer, seule, pour les accroches listées — sans masquer le reste
 * de l'item — voir resolveSidebar dans buildLocale.ts.
 */
export type SidebarLine = LocalizedText & { hiddenFor?: CvPitch[] }

/**
 * Un item d'une section de la colonne de gauche.
 * `label` (optionnel) est mis en avant en gras, `lines` suit en dessous
 * (une ligne affichée par élément du tableau).
 * `hiddenFor` (optionnel) masque l'item entièrement pour les accroches
 * listées — voir resolveSidebar dans buildLocale.ts.
 */
export type LocalizedSidebarItem = {
  label?: LocalizedText
  lines: SidebarLine[]
  hiddenFor?: CvPitch[]
}

/**
 * Une section de la colonne de gauche (Formation, Compétences…), affectée à
 * une page. `hiddenFor` (optionnel) masque la section entière pour les
 * accroches listées ; `pageFor` (optionnel) bascule la section sur une autre
 * page pour les accroches qui y figurent, `page` restant la page par défaut
 * pour les autres ; `titleFor` (optionnel) remplace le titre pour les
 * accroches qui y figurent (ex. une section "(suite)" qui redevient la seule
 * section de son thème quand `pageFor` la fait rejoindre la première) — voir
 * resolveSidebar dans buildLocale.ts.
 */
export type LocalizedSidebarSection = {
  title: LocalizedText
  page: CvPageNumber
  items: LocalizedSidebarItem[]
  hiddenFor?: CvPitch[]
  pageFor?: Partial<Record<CvPitch, CvPageNumber>>
  titleFor?: Partial<Record<CvPitch, LocalizedText>>
}

/**
 * Un projet mené au sein d'une même expérience (ex. mission client et projets
 * internes en ESN). Tous les projets d'une expérience partagent la même mise
 * en page : nom en gras, puis équipe, contexte et missions.
 */
export type LocalizedProject = {
  name: LocalizedText
  team?: LocalizedText
  /** Contexte du projet (une ligne par élément du tableau). */
  context?: LocalizedText[]
  /** Chaque mission peut être taguée pour une accroche, voir PitchTaggedText. */
  missions: PitchTaggedText[]
}

/**
 * Une expérience professionnelle (ou un side project), affectée à une page.
 * Dans les textes, les segments entre `**` sont rendus en gras violet.
 */
export type LocalizedExperience = {
  page: CvPageNumber
  role: LocalizedText
  /** Employeur (ou type de projet) et période, ex. "Cap Collectif (2024 - aujourd'hui)". */
  employer: LocalizedText
  team?: LocalizedText
  /** Contexte de la mission (une ligne par élément du tableau). */
  context?: LocalizedText[]
  /**
   * Missions de l'expérience — absentes quand l'expérience est découpée en
   * `projects`. Chaque mission peut être taguée pour une accroche, voir
   * PitchTaggedText.
   */
  missions?: PitchTaggedText[]
  /** Projets distincts au sein de l'expérience, chacun avec ses propres équipe/contexte/missions. */
  projects?: LocalizedProject[]
  /** Technologies et outils, affichés en pied d'expérience séparés par des "/". */
  stack?: LocalizedText[]
  /** Masque l'expérience (ou le side project) entièrement pour les accroches listées — voir resolveExperiences/resolveSideProjects dans buildLocale.ts. */
  hiddenFor?: CvPitch[]
  /** Bascule l'expérience sur une autre page pour les accroches qui y figurent, `page` restant la page par défaut pour les autres — voir resolveExperiences dans buildLocale.ts. */
  pageFor?: Partial<Record<CvPitch, CvPageNumber>>
}

// --- Contenu résolu dans une langue (voir buildLocale.ts), consommé par src/pdf/ ---

export type ContactLine = {
  text: string
  url?: string
}

export type SidebarItem = {
  label?: string
  lines: string[]
}

export type SidebarSection = {
  title: string
  page: CvPageNumber
  items: SidebarItem[]
}

export type Project = {
  name: string
  team?: string
  context?: string[]
  missions: string[]
}

export type Experience = {
  page: CvPageNumber
  role: string
  employer: string
  team?: string
  context?: string[]
  missions?: string[]
  projects?: Project[]
  stack?: string[]
}

/** Le CV complet, tel que rendu par CvDocument. Assemblé à la génération (voir CvPage.tsx). */
export type CvData = {
  name: string
  /** Titre du CV, choisi à la génération (saisie libre, ou titre par défaut de l'accroche — voir CvLocale). */
  title: string
  /** Titres des sections de la colonne principale, dans la langue du CV. */
  sectionTitles: {
    experiences: string
    experiencesSuite: string
    sideProjects: string
  }
  /** Paragraphe d'introduction sous le titre : l'accroche choisie à la génération (voir CvLocale). */
  pitch: string
  /** URL de la photo (src/assets/images/cv-photo.jpg), ou null si aucune photo n'est fournie. */
  photo: string | null
  contact: ContactLine[]
  /** Ligne d'informations pratiques sous le bloc contact. */
  personalInfo: string
  sidebar: SidebarSection[]
  experiences: Experience[]
  /** Affichés après les expériences de leur page, sous le titre "Side projects". */
  sideProjects: Experience[]
}

/**
 * Le contenu résolu d'une langue : un CvData sans les champs injectés à la
 * génération (titre saisi/choisi, accroche choisie, photo importée). Les
 * écrire dans le contenu serait mensonger : ils sont systématiquement
 * remplacés, et ce type rend l'oubli d'une injection impossible à compiler.
 */
export type CvContent = Omit<CvData, "title" | "pitch" | "photo">

/**
 * Les coordonnées du CV, stockées dans Supabase (table cv_contact, voir
 * supabase/cv_contact.sql) plutôt que dans le code : le bundle déployé est
 * public, ces données ne doivent pas s'y trouver en clair.
 */
export type CvContact = Pick<CvData, "contact" | "personalInfo">

/**
 * Tout le contenu d'une langue du CV, résolu depuis src/cv/content/ par
 * buildLocale.ts : les données, plus l'accroche et le titre par défaut de
 * chaque type de poste visé.
 */
export type CvLocale = {
  cv: CvContent
  pitches: Record<CvPitch, string>
  titles: Record<CvPitch, string>
}
