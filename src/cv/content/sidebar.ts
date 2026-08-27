import type {
  CvPitch,
  LocalizedSidebarItem,
  LocalizedSidebarSection,
} from "../types"

// Sections de la colonne de gauche du CV (Formation, Compétences…).
// - `page` (1 ou 2) : déplacer une section d'une page à l'autre pour rééquilibrer.
// - Les deux langues s'écrivent côte à côte (fr/en), ou en une fois via
//   bothLanguages quand le texte est identique — voir LocalizedText dans ../types.ts.
// - Une section, un item, ou une simple ligne d'item peut être marqué
//   `hiddenFor: ["pm"]` (ou toute autre accroche) pour être masqué
//   entièrement quand cette accroche est choisie sur la page CV.
// - Une section peut être marquée `pageFor: { pm: 1 }` pour basculer sur la
//   page 1 uniquement quand l'accroche "pm" est choisie (`page` reste la
//   page par défaut pour les autres accroches) — utile pour faire tenir un
//   CV allégé sur une seule page.
// - Une section peut aussi être marquée `titleFor: { pm: { fr: "…", en: "…" } }`
//   pour remplacer son titre quand l'accroche "pm" est choisie — utile par
//   exemple pour une section "(suite)" qui redevient la seule section de son
//   thème une fois déplacée en page 1 via `pageFor` — voir resolveSidebar
//   dans ../buildLocale.ts.
// - Une section peut porter un `id` stable (indépendant de la langue et de
//   l'accroche) pour être masquée manuellement depuis la page CV (voir la
//   section "Activités" ci-dessous, et resolveSidebar/CvPage.tsx).

// Items purement techniques de "Compétences (suite)" : regroupés à part pour
// leur appliquer `hiddenFor: ["pm"]` en un seul point plutôt que sur chacun,
// mais fusionnés dans la même section/le même titre que le reste — pas une
// catégorie séparée de la sidebar.
const TECHNICAL_SKILL_ITEMS: LocalizedSidebarItem[] = [
  {
    label: { fr: "Maquettage :", en: "Mock-ups/design:" },
    lines: [{ bothLanguages: "Figma / Photoshop" }],
  },
  {
    label: { fr: "Tests :", en: "Tests:" },
    lines: [{ bothLanguages: "Cypress / Jest / Jasmine" }],
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
        fr: "The Pragmatic Programmer, Software Craft, Clean Code, Programmer avec Java, etc.",
        en: "The Pragmatic Programmer, Software Craft, Clean Code, Programming with Java, etc.",
      },
    ],
  },
]

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
    hiddenFor: ["pm"],
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
    pageFor: { pm: 1 },
    titleFor: { pm: { fr: "Compétences", en: "Skills" } },
    items: [
      {
        label: { fr: "Gestion de projet :", en: "Project management:" },
        lines: [
          {
            fr: "GitHub Projects, Notion, Trello, Asana, Azure DevOps etc.",
            en: "GitHub Projects, Notion, Trello, Asana, Azure DevOps etc.",
          },
        ],
      },
      {
        label: { fr: "Méthodologie :", en: "Methodology:" },
        lines: [
          { bothLanguages: "pair programming", hiddenFor: ["pm"] },
          { bothLanguages: "code reviews", hiddenFor: ["pm"] },
          { bothLanguages: "Agile - Scrum / Kanban" },
          {
            fr: "Scrum PSM I : octobre 2026",
            en: "Scrum PSM I: October 2026",
          },
        ],
      },
      ...TECHNICAL_SKILL_ITEMS.map(item => ({
        ...item,
        hiddenFor: ["pm"] as CvPitch[],
      })),
    ],
  },
  {
    title: { bothLanguages: "Soft skills" },
    page: 2,
    pageFor: { pm: 1 },
    items: [
      {
        lines: [
          { bothLanguages: "Communication" },
          { bothLanguages: "Leadership" },
          { fr: "Capacité à fédérer", en: "Ability to unite" },
          { fr: "Esprit d'équipe", en: "Team spirit" },
          { fr: "Capacité d'adaptation", en: "Adaptability" },
          { fr: "Amélioration continue", en: "Continuous improvement" },
          { fr: "Vision long terme", en: "Long-term thinking" },
          { fr: "Curiosité", en: "Curiosity" },
          { fr: "Sens du détail", en: "Attention to detail" },
          { fr: "Proactivité", en: "Proactivity" },
        ],
      },
    ],
  },
  {
    id: "activities",
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
