import { EXPERIENCES, EXPERIENCES_TITLES } from "./content/experiences"
import {
  CONTACT_PLACEHOLDER,
  DEFAULT_TITLES,
  NAME,
  PERSONAL_INFO_PLACEHOLDER,
  PITCHES,
} from "./content/profile"
import { SIDEBAR } from "./content/sidebar"
import { SIDE_PROJECTS, SIDE_PROJECTS_TITLE } from "./content/sideProjects"
import type {
  CvLanguage,
  CvLocale,
  CvPitch,
  Experience,
  LocalizedExperience,
  LocalizedProject,
  LocalizedText,
  SidebarSection,
} from "./types"

// Résolution du contenu bilingue de src/cv/content/ vers une langue donnée :
// chaque LocalizedText devient une simple string, la structure reste identique.

/** Le texte d'un LocalizedText dans la langue demandée. */
function localizedText(text: LocalizedText, language: CvLanguage): string {
  return "bothLanguages" in text ? text.bothLanguages : text[language]
}

/** Comme localizedText, pour les champs optionnels (undefined reste undefined). */
function optionalText(
  text: LocalizedText | undefined,
  language: CvLanguage,
): string | undefined {
  return text === undefined ? undefined : localizedText(text, language)
}

/** Comme localizedText, pour les tableaux optionnels de textes. */
function optionalTexts(
  texts: LocalizedText[] | undefined,
  language: CvLanguage,
): string[] | undefined {
  return texts?.map(text => localizedText(text, language))
}

// Filtrage puis réordonnancement selon l'accroche choisie (voir
// PitchTaggedText dans types.ts) : appliqués avant la résolution de langue,
// sur les missions des expériences et de leurs projets.

/**
 * Retire les items réservés à d'autres accroches (`only` défini et ne
 * contenant pas l'accroche choisie). Les items sans `only` sont toujours
 * conservés.
 */
function filterByPitch<T extends { only?: CvPitch[] }>(
  items: T[],
  pitch: CvPitch,
): T[] {
  return items.filter(
    item => item.only === undefined || item.only.includes(pitch),
  )
}

/**
 * Trie un tableau tagué pour une accroche donnée : les items tagués pour
 * cette accroche remontent en tête (ordre relatif conservé), les items non
 * tagués gardent leur position déclarée, ceux tagués pour une autre accroche
 * redescendent en fin.
 */
function sortByPitch<T extends { tag?: CvPitch[] }>(
  items: T[],
  pitch: CvPitch,
): T[] {
  return [
    ...items.filter(item => item.tag?.includes(pitch)),
    ...items.filter(item => item.tag === undefined),
    ...items.filter(
      item => item.tag !== undefined && !item.tag.includes(pitch),
    ),
  ]
}

function applyPitchToProject(
  project: LocalizedProject,
  pitch: CvPitch,
): LocalizedProject {
  return {
    ...project,
    missions: sortByPitch(filterByPitch(project.missions, pitch), pitch),
  }
}

/** Filtre puis réordonne les missions d'une expérience, et celles de ses projets s'il y en a. */
function applyPitchToExperience(
  experience: LocalizedExperience,
  pitch: CvPitch,
): LocalizedExperience {
  return {
    ...experience,
    missions:
      experience.missions &&
      sortByPitch(filterByPitch(experience.missions, pitch), pitch),
    projects: experience.projects?.map(project =>
      applyPitchToProject(project, pitch),
    ),
  }
}

function resolveExperience(
  experience: LocalizedExperience,
  language: CvLanguage,
  pitch: CvPitch,
): Experience {
  return {
    page: experience.pageFor?.[pitch] ?? experience.page,
    role: localizedText(experience.role, language),
    employer: localizedText(experience.employer, language),
    team: optionalText(experience.team, language),
    context: optionalTexts(experience.context, language),
    missions: optionalTexts(experience.missions, language),
    projects: experience.projects?.map(project => ({
      name: localizedText(project.name, language),
      team: optionalText(project.team, language),
      context: optionalTexts(project.context, language),
      missions: project.missions.map(mission =>
        localizedText(mission, language),
      ),
    })),
    // Masquée pour l'accroche "pm" : la stack technique n'a pas sa place sur
    // un CV de cheffe de projet.
    stack:
      pitch === "pm" ? undefined : optionalTexts(experience.stack, language),
  }
}

/**
 * Expériences résolues pour une langue et une accroche données : à appeler à
 * la génération du CV (voir CvPage.tsx) une fois l'accroche choisie, plutôt
 * que d'utiliser CV_LOCALES[language].cv.experiences qui fige l'accroche
 * "dev". Les expériences marquées `hiddenFor` cette accroche sont retirées,
 * celles marquées `pageFor` basculent sur la page indiquée.
 */
export function resolveExperiences(
  pitch: CvPitch,
  language: CvLanguage,
): Experience[] {
  return EXPERIENCES.filter(
    experience => !experience.hiddenFor?.includes(pitch),
  ).map(experience =>
    resolveExperience(
      applyPitchToExperience(experience, pitch),
      language,
      pitch,
    ),
  )
}

/** Side projects résolus pour une langue et une accroche données — même logique que resolveExperiences. */
export function resolveSideProjects(
  pitch: CvPitch,
  language: CvLanguage,
): Experience[] {
  return SIDE_PROJECTS.filter(
    project => !project.hiddenFor?.includes(pitch),
  ).map(project =>
    resolveExperience(applyPitchToExperience(project, pitch), language, pitch),
  )
}

/**
 * Sections de la sidebar résolues pour une langue et une accroche données :
 * les sections, items et lignes marqués `hiddenFor` l'accroche choisie sont
 * retirés, les sections marquées `pageFor` pour cette accroche basculent sur
 * la page indiquée, celles marquées `titleFor` prennent ce titre à la place
 * (voir LocalizedSidebarSection/Item/SidebarLine dans types.ts), avant
 * résolution de langue. `hiddenSectionIds` retire en plus les sections dont
 * l'`id` y figure — masquage manuel choisi sur la page CV (voir CvPage.tsx).
 */
export function resolveSidebar(
  pitch: CvPitch,
  language: CvLanguage,
  hiddenSectionIds: string[] = [],
): SidebarSection[] {
  return SIDEBAR.filter(
    section =>
      !section.hiddenFor?.includes(pitch) &&
      (section.id === undefined || !hiddenSectionIds.includes(section.id)),
  ).map(section => ({
    title: localizedText(section.titleFor?.[pitch] ?? section.title, language),
    page: section.pageFor?.[pitch] ?? section.page,
    items: section.items
      .filter(item => !item.hiddenFor?.includes(pitch))
      .map(item => ({
        label: optionalText(item.label, language),
        lines: item.lines
          .filter(line => !line.hiddenFor?.includes(pitch))
          .map(line => localizedText(line, language)),
      })),
  }))
}

function buildLocale(language: CvLanguage): CvLocale {
  return {
    cv: {
      name: NAME,
      sectionTitles: {
        experiences: localizedText(EXPERIENCES_TITLES.experiences, language),
        experiencesSuite: localizedText(
          EXPERIENCES_TITLES.experiencesSuite,
          language,
        ),
        sideProjects: localizedText(SIDE_PROJECTS_TITLE, language),
      },
      contact: CONTACT_PLACEHOLDER.map(line => ({
        text: localizedText(line.text, language),
        url: line.url,
      })),
      personalInfo: PERSONAL_INFO_PLACEHOLDER.map(line => ({
        id: line.id,
        text: localizedText(line.text, language),
      })),
      // Accroche par défaut "dev" : CvPage.tsx recalcule ces trois tableaux
      // via resolveSidebar/resolveExperiences/resolveSideProjects dès qu'une
      // accroche est choisie, pour appliquer le masquage et le
      // réordonnancement des items tagués.
      sidebar: resolveSidebar("dev", language),
      experiences: resolveExperiences("dev", language),
      sideProjects: resolveSideProjects("dev", language),
    },
    pitches: {
      dev: localizedText(PITCHES.dev, language),
      hybrid: localizedText(PITCHES.hybrid, language),
      pm: localizedText(PITCHES.pm, language),
    },
    titles: {
      dev: localizedText(DEFAULT_TITLES.dev, language),
      hybrid: localizedText(DEFAULT_TITLES.hybrid, language),
      pm: localizedText(DEFAULT_TITLES.pm, language),
    },
  }
}

/** Les deux locales du CV, résolues une fois au chargement du module. */
export const CV_LOCALES: Record<CvLanguage, CvLocale> = {
  fr: buildLocale("fr"),
  en: buildLocale("en"),
}
