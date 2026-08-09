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
 * Retire les items réservés à l'autre accroche (`only` défini et différent
 * de l'accroche choisie). Les items sans `only` sont toujours conservés.
 */
function filterByPitch<T extends { only?: CvPitch }>(
  items: T[],
  pitch: CvPitch,
): T[] {
  return items.filter(item => item.only === undefined || item.only === pitch)
}

/**
 * Trie un tableau tagué pour une accroche donnée : les items tagués pour
 * cette accroche remontent en tête (ordre relatif conservé), les items non
 * tagués gardent leur position déclarée, ceux tagués pour l'autre accroche
 * redescendent en fin.
 */
function sortByPitch<T extends { tag?: CvPitch }>(
  items: T[],
  pitch: CvPitch,
): T[] {
  const otherPitch: CvPitch = pitch === "dev" ? "pm" : "dev"
  return [
    ...items.filter(item => item.tag === pitch),
    ...items.filter(item => item.tag === undefined),
    ...items.filter(item => item.tag === otherPitch),
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
): Experience {
  return {
    page: experience.page,
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
    stack: optionalTexts(experience.stack, language),
  }
}

/**
 * Expériences résolues pour une langue et une accroche données : à appeler à
 * la génération du CV (voir CvPage.tsx) une fois l'accroche choisie, plutôt
 * que d'utiliser CV_LOCALES[language].cv.experiences qui fige l'accroche
 * "dev".
 */
export function resolveExperiences(
  pitch: CvPitch,
  language: CvLanguage,
): Experience[] {
  return EXPERIENCES.map(experience =>
    resolveExperience(applyPitchToExperience(experience, pitch), language),
  )
}

/** Side projects résolus pour une langue et une accroche données — même logique que resolveExperiences. */
export function resolveSideProjects(
  pitch: CvPitch,
  language: CvLanguage,
): Experience[] {
  return SIDE_PROJECTS.map(project =>
    resolveExperience(applyPitchToExperience(project, pitch), language),
  )
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
      personalInfo: localizedText(PERSONAL_INFO_PLACEHOLDER, language),
      sidebar: SIDEBAR.map(section => ({
        title: localizedText(section.title, language),
        page: section.page,
        items: section.items.map(item => ({
          label: optionalText(item.label, language),
          lines: item.lines.map(line => localizedText(line, language)),
        })),
      })),
      // Accroche par défaut "dev" : CvPage.tsx recalcule ces deux tableaux
      // via resolveExperiences/resolveSideProjects dès qu'une accroche est
      // choisie, pour appliquer le réordonnancement des missions taguées.
      experiences: resolveExperiences("dev", language),
      sideProjects: resolveSideProjects("dev", language),
    },
    pitches: {
      dev: localizedText(PITCHES.dev, language),
      pm: localizedText(PITCHES.pm, language),
    },
    titles: {
      dev: localizedText(DEFAULT_TITLES.dev, language),
      pm: localizedText(DEFAULT_TITLES.pm, language),
    },
  }
}

/** Les deux locales du CV, résolues une fois au chargement du module. */
export const CV_LOCALES: Record<CvLanguage, CvLocale> = {
  fr: buildLocale("fr"),
  en: buildLocale("en"),
}
