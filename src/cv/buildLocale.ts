import { CONTACT_PLACEHOLDER, DEFAULT_TITLES, NAME, PERSONAL_INFO_PLACEHOLDER, PITCHES } from "./content/profile"
import { EXPERIENCES, EXPERIENCES_TITLES } from "./content/experiences"
import { SIDEBAR } from "./content/sidebar"
import { SIDE_PROJECTS, SIDE_PROJECTS_TITLE } from "./content/sideProjects"
import type { CvLanguage, CvLocale, Experience, LocalizedExperience, LocalizedText } from "./types"

// Résolution du contenu bilingue de src/cv/content/ vers une langue donnée :
// chaque LocalizedText devient une simple string, la structure reste identique.

/** Le texte d'un LocalizedText dans la langue demandée. */
function localizedText(text: LocalizedText, language: CvLanguage): string {
  return "bothLanguages" in text ? text.bothLanguages : text[language]
}

/** Comme localizedText, pour les champs optionnels (undefined reste undefined). */
function optionalText(text: LocalizedText | undefined, language: CvLanguage): string | undefined {
  return text === undefined ? undefined : localizedText(text, language)
}

/** Comme localizedText, pour les tableaux optionnels de textes. */
function optionalTexts(texts: LocalizedText[] | undefined, language: CvLanguage): string[] | undefined {
  return texts?.map(text => localizedText(text, language))
}

function resolveExperience(experience: LocalizedExperience, language: CvLanguage): Experience {
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
      missions: project.missions.map(mission => localizedText(mission, language)),
    })),
    stack: optionalTexts(experience.stack, language),
  }
}

function buildLocale(language: CvLanguage): CvLocale {
  return {
    cv: {
      name: NAME,
      sectionTitles: {
        experiences: localizedText(EXPERIENCES_TITLES.experiences, language),
        experiencesSuite: localizedText(EXPERIENCES_TITLES.experiencesSuite, language),
        sideProjects: localizedText(SIDE_PROJECTS_TITLE, language),
      },
      contact: CONTACT_PLACEHOLDER.map(line => ({ text: localizedText(line.text, language), url: line.url })),
      personalInfo: localizedText(PERSONAL_INFO_PLACEHOLDER, language),
      sidebar: SIDEBAR.map(section => ({
        title: localizedText(section.title, language),
        page: section.page,
        items: section.items.map(item => ({
          label: optionalText(item.label, language),
          lines: item.lines.map(line => localizedText(line, language)),
        })),
      })),
      experiences: EXPERIENCES.map(experience => resolveExperience(experience, language)),
      sideProjects: SIDE_PROJECTS.map(project => resolveExperience(project, language)),
    },
    pitches: {
      dev: localizedText(PITCHES.dev, language),
      management: localizedText(PITCHES.management, language),
    },
    titles: {
      dev: localizedText(DEFAULT_TITLES.dev, language),
      management: localizedText(DEFAULT_TITLES.management, language),
    },
  }
}

/** Les deux locales du CV, résolues une fois au chargement du module. */
export const CV_LOCALES: Record<CvLanguage, CvLocale> = {
  fr: buildLocale("fr"),
  en: buildLocale("en"),
}
