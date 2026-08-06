import type { CvPitch, LocalizedContactLine, LocalizedText } from "../types"

// Identité et en-tête du CV : nom, accroches, titres par type de poste visé,
// et coordonnées de repli. Les deux langues s'écrivent côte à côte (fr/en),
// ou en une fois via bothLanguages quand le texte est identique — voir
// LocalizedText dans ../types.ts.

const EXPERIENCE_START_YEAR = 2021
const EXPERIENCE_START_MONTH = 11 // novembre

function getExperienceYears() {
  const now = new Date()
  const startDate = new Date(
    EXPERIENCE_START_YEAR,
    EXPERIENCE_START_MONTH - 1,
    1,
  )

  const totalMonths =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth())

  let years = Math.floor(totalMonths / 12)
  const remainingMonths = totalMonths % 12

  if (remainingMonths > 6) {
    years += 1
  }

  return years
}

export const NAME = "Myriam Mira"

/** Les accroches, par type de poste visé (le choix se fait sur la page CV, à la génération). */
export const PITCHES: Record<CvPitch, LocalizedText> = {
  dev: {
    fr: `Développeuse React, Angular, TypeScript, avec ${getExperienceYears()} ans d'expérience, et un focus sur la qualité du code, des processus, et de l'accessibilité.\nMes développements sont accélérés et améliorés par l'IA, avec une approche pragmatique et responsable.\nJe suis habituée aux environnements exigeants (tests, documentation, optimisation des coûts, collaboration inter-équipes), ainsi qu'au travail en mode Agile, dans des équipes de tailles variées.`,
    en: `React, Angular, and TypeScript Software Developer with ${getExperienceYears()} years of experience, focusing on software quality, optimized processes, and accessibility. My work is accelerated and enhanced by AI, with a pragmatic and responsible approach. I am accustomed to demanding environments (testing, documentation, cost optimization, cross-team collaboration) and to working in an Agile environment.`,
  },
  pm: {
    fr: `Cheffe de projets IT issue du développement web, habituée aux environnements Agile. Mon double profil technique et métier facilite la collaboration entre les équipes et l’alignement entre attentes métier et contraintes techniques.
    Grâce à une compréhension fine des enjeux, j’estime de façon fiable, anticipe les risques et pilote des projets qui exigent rigueur et coordination, notamment dans le secteur bancaire. J’utilise l’IA de manière pragmatique pour gagner en efficacité, automatiser et améliorer les processus.`,
    en: `IT Project Manager with a background in web development and experience in Agile environments. My hybrid profile facilitates collaboration across teams, and helps aligning business expectations with technical constraints.
    With a strong understanding of technical challenges, I provide reliable estimates, anticipate risks, and manage projects requiring rigor and coordination, including in the banking sector. I use AI pragmatically to improve efficiency, automate tasks, and enhance processes.`,
  },
}

/** Titre par défaut du CV selon l'accroche choisie ; reste modifiable sur la page CV. */
export const DEFAULT_TITLES: Record<CvPitch, LocalizedText> = {
  dev: { fr: "Software developer", en: "Software Developer" },
  pm: { fr: "Cheffe de projet IT", en: "IT Project Manager" },
}

// Coordonnées de REMPLACEMENT : les vraies vivent dans Supabase (table
// cv_contact, une ligne par langue, voir supabase/cv_contact.sql) et
// remplacent ces valeurs à la génération. Ne jamais écrire les vraies
// coordonnées ici : ce fichier est versionné et finit dans le bundle public.
export const CONTACT_PLACEHOLDER: LocalizedContactLine[] = [
  {
    text: { fr: "email@exemple.fr", en: "email@example.com" },
    url: "mailto:email@example.com",
  },
  { text: { bothLanguages: "+33(0)6.00.00.00.00" }, url: "tel:+33600000000" },
  {
    text: { fr: "github.com/exemple", en: "github.com/example" },
    url: "https://github.com/example",
  },
  {
    text: { fr: "linkedin.com/in/exemple", en: "linkedin.com/in/example" },
    url: "https://www.linkedin.com/in/example/",
  },
  {
    text: { fr: "Bilingue anglais / français", en: "Fluent English / French" },
  },
]

/** Ligne d'informations pratiques, de REMPLACEMENT elle aussi (la vraie vit dans Supabase). */
export const PERSONAL_INFO_PLACEHOLDER: LocalizedText = {
  fr: "Basée quelque part\nVélo | Permis B | remote :)",
  en: "Based somewhere\n\nBike | driving license | remote :)",
}
