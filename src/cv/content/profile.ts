import type { CvPitch, LocalizedContactLine, LocalizedText } from "../types"

// Identité et en-tête du CV : nom, accroches, titres par type de poste visé,
// et coordonnées de repli. Les deux langues s'écrivent côte à côte (fr/en),
// ou en une fois via bothLanguages quand le texte est identique — voir
// LocalizedText dans ../types.ts.

export const NAME = "Myriam Mira"

/** Les accroches, par type de poste visé (le choix se fait sur la page CV, à la génération). */
export const PITCHES: Record<CvPitch, LocalizedText> = {
  dev: {
    fr: "Développeuse React, Angular, TypeScript, avec ~5 ans d'expérience, et un focus sur la qualité du code, des processus, et de l'accessibilité.\nMes développements sont accélérés et améliorés par l'IA, avec une approche pragmatique et responsable.\nJe suis habituée aux environnements exigeants (tests, documentation, optimisation des coûts, collaboration inter-équipes), ainsi qu'au travail en mode Agile, dans des équipes de tailles variées.",
    en: "React, Angular, and TypeScript Software Developer with ~5 years of experience, focusing on software quality, optimized processes, and accessibility. My work is accelerated and enhanced by AI, with a pragmatic and responsible approach. I am accustomed to demanding environments (testing, documentation, cost optimization, cross-team collaboration) and to working in an Agile environment.",
  },
  management: {
    fr: `Cheffe de projets IT issue du développement web et habituée aux environnements Agile (Scrum). Mon double profil technique et métier me permet de clarifier les besoins, faciliter la collaboration entre les équipes et garantir la cohérence entre attentes métier et contraintes techniques.
    Grâce à une compréhension fine des enjeux techniques, j’établis des estimations fiables, j’anticipe les risques et je pilote des projets nécessitant rigueur, coordination et suivi précis, notamment dans le secteur bancaire où j’ai travaillé pendant plusieurs années.
    J’utilise l’IA de manière pragmatique et responsable pour gagner en efficacité dans mes activités techniques et dans la structuration du travail au sein des projets.`,
    en: `IT Project Manager with a background in web development and experience working in Agile (Scrum) environments.
    My combined technical and business profile helps me clarify requirements, support collaboration between teams, and ensure consistency between business needs and technical constraints.
    With a solid understanding of technical considerations, I provide reliable estimates, anticipate risks, and manage projects that require rigor, coordination, and careful follow‑up — including in the banking sector, where I worked for several years.
    I use AI in a pragmatic and responsible way to improve efficiency in both technical work and project-related activities.`,
  },
}

/** Titre par défaut du CV selon l'accroche choisie ; reste modifiable sur la page CV. */
export const DEFAULT_TITLES: Record<CvPitch, LocalizedText> = {
  dev: { fr: "Software developer", en: "Software Developer" },
  management: { fr: "Cheffe de projet IT", en: "IT Project Manager" },
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
