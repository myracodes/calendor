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
    fr: "Cheffe de projet issue du développement web : ~5 ans d'expérience sur des projets web en mode Agile (Scrum), après une formation en communication et stratégie digitale, et plusieurs années comme cheffe de projets dans une banque. Ma double casquette me permet de faire le pont entre les équipes techniques et métier, d'estimer les charges avec réalisme, de comprendre les contraintes techniques, et de veiller à la qualité des livrables comme des processus. J'utilise l'IA avec une approche pragmatique et responsable pour accélérer et fiabiliser le suivi de projet en gardant le contrôle sur la qualité.",
    en: "Project Manager with a web development background: ~5 years of experience on web projects in Agile (Scrum) environments, following a degree in communication and digital strategy and several years as a project manager in a bank.\nThis dual profile allows me to bridge technical and business teams, produce realistic estimates, understand technical constraints, and ensure the quality of deliverables as well as processes.\nI use AI in a pragmatic and responsible way to speed up and strengthen project tracking, while keeping quality under control.",
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
  { text: { fr: "email@exemple.fr", en: "email@example.com" }, url: "mailto:email@example.com" },
  { text: { bothLanguages: "+33(0)6.00.00.00.00" }, url: "tel:+33600000000" },
  { text: { fr: "github.com/exemple", en: "github.com/example" }, url: "https://github.com/example" },
  {
    text: { fr: "linkedin.com/in/exemple", en: "linkedin.com/in/example" },
    url: "https://www.linkedin.com/in/example/",
  },
  { text: { fr: "Bilingue anglais / français", en: "Fluent English / French" } },
]

/** Ligne d'informations pratiques, de REMPLACEMENT elle aussi (la vraie vit dans Supabase). */
export const PERSONAL_INFO_PLACEHOLDER: LocalizedText = {
  fr: "Basée quelque part\nVélo | Permis B | remote :)",
  en: "Based somewhere\n\nBike | driving license | remote :)",
}
