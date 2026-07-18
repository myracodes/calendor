import type { LocalizedSidebarSection } from "../types"

// Sections de la colonne de gauche du CV (Formation, Compétences…).
// - `page` (1 ou 2) : déplacer une section d'une page à l'autre pour rééquilibrer.
// - Les deux langues s'écrivent côte à côte (fr/en), ou en une fois via
//   bothLanguages quand le texte est identique — voir LocalizedText dans ../types.ts.

export const SIDEBAR: LocalizedSidebarSection[] = [
  {
    title: { fr: "Formation", en: "Education" },
    page: 1,
    items: [
      {
        label: {
          fr: "Développement web et mobile avancé",
          en: "Advanced web and mobile development",
        },
        lines: [
          { bothLanguages: "Wild Code School Paris (2021-2022)" },
          { fr: "1 an en alternance", en: "1-year apprenticeship" },
        ],
      },
      {
        label: {
          fr: "Développement web fullstack",
          en: "Full-stack web development",
        },
        lines: [
          {
            fr: "Titre RNCP niveau 6 / Bac+3/4",
            en: "Bachelor's degree (RNCP Level 6)",
          },
          {
            fr: "Ironhack Paris (2021) - en anglais",
            en: "Ironhack Paris (2021) - English course",
          },
        ],
      },
      {
        label: { bothLanguages: "HTML, CSS, Javascript" },
        lines: [{ fr: "Autoformation (2021)", en: "Self-learning (2021)" }],
      },
      {
        label: {
          fr: "M2 Manager de la Communication et Stratégie Digitale",
          en: "Communications, Management, and Digital Strategy",
        },
        lines: [
          {
            fr: "Sup de Pub - INSEEC (2018)",
            en: "Master's Degree: Sup de Pub (2018)",
          },
        ],
      },
      {
        label: {
          fr: "Licence Pro (L3) Métiers du Numérique : conception, rédaction et réalisation web",
          en: "Digital Professions: Web Design, Writing, and Development",
        },
        lines: [
          {
            fr: "Université de Cergy-Pontoise (2016)",
            en: "Bachelor's Degree: Cergy-Pontoise University (2016)",
          },
        ],
      },
    ],
  },
  {
    title: { fr: "Compétences", en: "Skills" },
    page: 1,
    items: [
      {
        label: { fr: "Front-end :", en: "Front-end:" },
        lines: [
          { bothLanguages: "React / Angular" },
          { bothLanguages: "Next.js" },
          { bothLanguages: "JavaScript (TypeScript)" },
          { bothLanguages: "Storybook / Chromatic" },
        ],
      },
      {
        label: { fr: "UX/UI / CSS :", en: "UX/UI / CSS:" },
        lines: [
          { bothLanguages: "Tailwind" },
          { fr: "librairies de composants", en: "component libraries" },
          { bothLanguages: "Design System" },
          { fr: "perfectionnisme UX/UI", en: "UX/UI sensitivity" },
          { fr: "accessibilité (WCAG/ARIA)", en: "accessibility (WCAG/ARIA)" },
        ],
      },
      {
        label: { fr: "Back-end :", en: "Back-end:" },
        lines: [{ bothLanguages: "Node.js / PHP / Java" }],
      },
    ],
  },
  {
    title: { fr: "Compétences (suite)", en: "Skills (cont.)" },
    page: 2,
    items: [
      {
        label: { fr: "Maquettage :", en: "Mock-ups/design:" },
        lines: [{ bothLanguages: "Figma / Photoshop" }],
      },
      {
        label: { fr: "Tests :", en: "Tests:" },
        lines: [{ bothLanguages: "Cypress / Jest / Jasmine" }],
      },
      {
        label: { fr: "Méthodologie :", en: "Methodology:" },
        lines: [
          { bothLanguages: "pair programming" },
          { bothLanguages: "code reviews" },
          { bothLanguages: "Scrum / Agile" },
        ],
      },
      {
        label: { fr: "Veille :", en: "Tech watch:" },
        lines: [
          { bothLanguages: "meetups" },
          {
            fr: "conférences (React Paris, NewCrafts, Devoxx, Cloud Native Days, etc.)",
            en: "conferences (React Paris, NewCrafts, Devoxx, Cloud Native Days, etc.)",
          },
        ],
      },
      {
        label: { fr: "Partage :", en: "Share:" },
        lines: [
          { fr: "oratrice Ladies of Code", en: "speaker for Ladies of Code" },
        ],
      },
      {
        label: { fr: "Certifications :", en: "Certifications:" },
        lines: [{ bothLanguages: "Microsoft AZ-900 & PL-900" }],
      },
      {
        label: { fr: "Lectures tech :", en: "Tech reads:" },
        lines: [
          {
            bothLanguages:
              "The Pragmatic Programmer, Software Craft, Clean Code, etc.",
          },
        ],
      },
    ],
  },
  {
    title: { bothLanguages: "Soft skills" },
    page: 2,
    items: [
      {
        lines: [
          { fr: "Amélioration continue", en: "Continuous improvement" },
          { fr: "Vision long terme", en: "Long-term thinking" },
          { bothLanguages: "Communication" },
          { fr: "Pensée systémique", en: "Systems thinking" },
          { fr: "Curiosité", en: "Curiosity" },
          { fr: "Sens du détail", en: "Attention to detail" },
        ],
      },
    ],
  },
  {
    title: { fr: "Activités", en: "Activities" },
    page: 2,
    items: [
      {
        lines: [
          {
            fr: "Sport / chant & guitare / bénévolat / lecture / théâtre / couture / langues vivantes / et autres !",
            en: "Sports / singing & guitar playing / volunteering / reading / theater / sewing / languages / and more!",
          },
        ],
      },
    ],
  },
]
