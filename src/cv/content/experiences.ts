import type { LocalizedExperience, LocalizedText } from "../types"

// Expériences professionnelles du CV.
// - `page` (1 ou 2) : déplacer une expérience d'une page à l'autre pour rééquilibrer.
// - Dans les textes, les segments entre ** sont rendus en gras violet.
// - Les deux langues s'écrivent côte à côte (fr/en), ou en une fois via
//   bothLanguages quand le texte est identique — voir LocalizedText dans ../types.ts.
// - Une mission peut être taguée `tag: "pm"` ou `tag: "dev"` pour remonter en
//   tête (ou redescendre en fin) de sa liste quand l'accroche correspondante
//   est choisie sur la page CV. Elle peut aussi être réservée à une accroche
//   avec `only: "pm"` ou `only: "dev"` : elle n'apparaît alors que pour
//   cette accroche, et disparaît entièrement pour l'autre — voir
//   PitchTaggedText dans ../types.ts.

/** Titres de la section : page 1, puis "(suite)" en page 2. */
export const EXPERIENCES_TITLES: {
  experiences: LocalizedText
  experiencesSuite: LocalizedText
} = {
  experiences: {
    fr: "Expérience professionnelle",
    en: "Professional experience",
  },
  experiencesSuite: {
    fr: "Expérience professionnelle (suite)",
    en: "Professional experience (cont.)",
  },
}

export const EXPERIENCES: LocalizedExperience[] = [
  {
    page: 1,
    role: { fr: "Développeuse front-end", en: "Front-end web developer" },
    employer: {
      fr: "Cap Collectif (2024 - aujourd'hui)",
      en: "Cap Collectif (2024 - present)",
    },
    team: {
      fr: "Équipe de 9 personnes (5 dev / 1 DevOps / 1 QA / 1 PO / 1 UX/UI designer)",
      en: "Team of 9 people: 5 dev / 1 DevOps / 1 QA / 1 PO / 1 UX/UI designer",
    },
    context: [
      {
        fr: "Cap Collectif développe des outils open source d'intelligence collective, en SaaS.",
        en: "Cap Collectif develops open-source collective intelligence tools, offered as SaaS.",
      },
    ],
    missions: [
      {
        fr: "Développement de nouvelles features et refontes front-end (**React / Next.js**)",
        en: "Developed new features and front-end redesigns (**React / Next.js**)",
      },
      {
        fr: "Tests automatisés (**Cypress**)",
        en: "Automated testing (**Cypress**)",
      },
      {
        fr: "Correction de bugs en production",
        en: "Fixed bugs in production",
      },
      {
        fr: "Relecture des PR (code reviews)",
        en: "Reviewed pull requests (code reviews)",
      },
      {
        fr: "Améliorations SEO (Core Web Vitals, TTFB, etc)",
        en: "Enhanced SEO (Core Web Vitals, TTFB, etc)",
      },
      {
        fr: "Mise à jour du **Design System** (45 composants) : refontes, nouveautés, **accessibilité**",
        en: "Updated the **Design System** (45 components): redesigns, new features, **accessibility**",
      },
      {
        tag: "pm",
        fr: "Mise en place des ADR, documentation du code, présentations techniques",
        en: "Implemented ADRs, code documentation, technical presentations",
      },
      {
        fr: "Utilisation quotidienne de l'**IA** (**Claude Code** et autres) : débug, refactorisations, **back-end**, accélération des développements, découpage des tâches complexes, etc.",
        en: "Daily use of **AI** (**Claude Code** and others): debugging, refactoring, **back-end development**, faster and better developments, breaking down complex tasks, etc.",
      },
      {
        fr: "Gestion et réduction proactive de la **dette technique** : 80% de tests legacy traduits, planification des mises à jour de sécurité, montées de versions des librairies, etc.",
        en: "Proactively managed and reduced **technical debt**: 80% of legacy tests translated, scheduled security updates, upgraded libraries, etc.",
      },
      {
        tag: "pm",
        fr: "Pilotage des tâches techniques : analyse des besoins, recherche de solutions techniques, création des **EPIC**, découpage, priorisation, et planificationdes tâches",
        en: "Owned technical tasks: analyzed requirements, researched technical solutions, created **EPIC**, broke down tasks, prioritized and planned them",
      },
      {
        fr: "Amélioration de la DX : **correction de 100% des tests flaky** et des faux diffs Chromatic",
        en: "Improved DX: **100% of flaky tests fixed**, 100% of false diffs fixed on Chromatic builds",
      },
      {
        tag: "pm",
        fr: "Diminution des coûts variables (40% d'économies sur la CI)",
        en: "Reduced variable costs (40% savings on CI yearly)",
      },
      {
        tag: "pm",
        fr: "Coordination avec les PO, QA et designer pour aligner besoins, contraintes et priorités.",
        en: "Coordination with the PO, QA, and designer to align requirements, constraints, and priorities.",
      },
      {
        tag: "pm",
        only: "pm",
        fr: "Contribution à la vision produit via des propositions d'amélioration UX/UI",
        en: "Contributed to the product vision through UX/UI improvement proposals",
      },
      {
        tag: "pm",
        only: "pm",
        fr: "Mise en place ou amélioration des outils et processus de suivi (EPIC, tickets, priorisation, documentation, backlog).",
        en: "Implemented or improved tracking tools and processes (EPICs, tickets, prioritization, documentation, backlog).",
      },
    ],
    stack: [
      { bothLanguages: "React" },
      { bothLanguages: "TypeScript" },
      { bothLanguages: "GraphQL" },
      { bothLanguages: "Next.js" },
      { bothLanguages: "Relay" },
      { bothLanguages: "Storybook" },
      { bothLanguages: "Chromatic" },
      { bothLanguages: "Figma" },
      { bothLanguages: "Cypress" },
      { bothLanguages: "CircleCI" },
      { bothLanguages: "react-hook-form" },
      { bothLanguages: "Docker" },
      { bothLanguages: "NPM" },
      { fr: "méthode Agile", en: "Agile methodology" },
      { bothLanguages: "Claude Code" },
      { fr: "IA", en: "AI" },
    ],
  },
  {
    page: 1,
    role: { fr: "Développeuse front-end", en: "Front-end web developer" },
    employer: {
      fr: "Avanade (ESN) (2022 - 2024)",
      en: "Avanade (consulting firm) (2022 - 2024)",
    },
    projects: [
      {
        name: {
          fr: "Projet VEOLIA - Wat.erp : portage du front-end (ASP.NET) vers Angular",
          en: "VEOLIA - Wat.erp project: migrate the front-end (ASP.NET) to Angular",
        },
        team: {
          fr: "Équipe de 15 personnes (6 front / 4 back / 1 PO / 1 PM / 1 QA / 1 designer / 1 DevOps)",
          en: "Team of 15 people (6 front / 4 back / 1 PO / 1 PM / 1 QA / 1 UX/UI designer / 1 DevOps)",
        },
        context: [
          {
            fr: "Build/run de Wat.erp, le logiciel de gestion des contrats eau de ~90% du territoire français.",
            en: "Build/run of Wat.erp, the water contract management software for ~90% of the French territory.",
          },
        ],
        missions: [
          {
            fr: "Build : implémentation “pixel perfect” des écrans d'après les maquettes",
            en: "Build: delivered “pixel perfect” screens based on the mock-ups",
          },
          {
            fr: "Intégration du CRUD (API REST) côté front-end",
            en: "Integration of CRUD features (REST API) on the front-end",
          },
          {
            fr: "Mise en place du **Design System** et des composants réutilisables (**Angular**), en collaboration avec le designer UX/UI",
            en: "Implemented the **Design System** and reusable components (**Angular**) in collaboration with the UX/UI designer",
          },
          { fr: "Run : correction des bugs", en: "Run: bug fixes" },
          {
            fr: "Proposition et mise en place de normes (git flow, conventional commits, approche design system, conventions de nommage, etc.)",
            en: "Championed implementation of standards (git flow, conventional commits, design system approach, naming conventions, etc.)",
          },
        ],
      },
      {
        name: {
          fr: "Projets internes Avanade",
          en: "Avanade internal projects",
        },
        missions: [
          {
            fr: "Conception, développement et mise à jour de composants du **Design System** interne",
            en: "Designed, developed, and updated the internal **Design System** components",
          },
          {
            fr: "Développement d'outils internes",
            en: "Developed internal tools",
          },
          {
            fr: "Réalisation **pixel perfect** d'écrans d'après des maquettes Adobe XD",
            en: "Delivered **pixel perfect** screens based on Adobe XD mock-ups",
          },
        ],
      },
    ],
    stack: [
      { bothLanguages: "Angular" },
      { bothLanguages: "TypeScript" },
      { bothLanguages: "REST" },
      { bothLanguages: "Tailwind" },
      { bothLanguages: "NgRx" },
      { fr: "méthode Agile (Scrum)", en: "Agile methodology (Scrum)" },
      { bothLanguages: "Azure DevOps" },
      { bothLanguages: "SCSS" },
      { bothLanguages: "PrimeNG" },
      { bothLanguages: "Adobe XD" },
      { bothLanguages: "Figma" },
    ],
  },
  {
    page: 2,
    role: { fr: "Développeuse full-stack", en: "Full-stack web developer" },
    employer: {
      fr: "Agence Visigo & projet GOOD Vibes (2021 - 2022)",
      en: "Visigo agency & GOOD Vibes project (2021 - 2022)",
    },
    team: {
      fr: "Équipe de 3 personnes (1 CTPO / 1 dev full-stack / 1 UX/UI designer)",
      en: "Team of 3 people (1 CTPO / 1 full-stack developer / 1 UX/UI designer)",
    },
    context: [
      {
        fr: "GOOD Vibes est un système d'envoi de vidéos interactives par SMS, paramétrable via un dashboard admin.",
        en: "GOOD Vibes is a system for sending interactive videos via SMS, configurable through an admin dashboard.",
      },
    ],
    missions: [
      {
        fr: "Refonte intégrale du site vitrine en **React**",
        en: "Completely revamped the marketing website in **React**",
      },
      {
        fr: "Développement des features **front-end et back-end (React / Node.js)** et des composants",
        en: "Developed **front-end and back-end (React / Node.js)** features and components",
      },
      { fr: "Correction des bugs", en: "Fixed production bugs" },
      {
        tag: "pm",
        fr: "Amélioration continue: gestion des projets techniques de l'agence, documentation du code, amélioration des processus internes",
        en: "Drove continuous improvement: technical projects management, code documentation, internal processes",
      },
      {
        fr: "Définition et application de la stratégie **SEO**",
        en: "Designed and rolled out the **SEO** strategy",
      },
      {
        fr: "Mise en place d'outils digitaux & formation de l'équipe",
        en: "Set up and deployed digital tools, and trained the team to use them",
      },
    ],
    stack: [
      { bothLanguages: "React" },
      { bothLanguages: "Node.js" },
      { bothLanguages: "Storybook" },
      { bothLanguages: "Chromatic" },
      { bothLanguages: "Figma" },
      { bothLanguages: "Cypress" },
      { bothLanguages: "Jest" },
      { bothLanguages: "Netlify" },
      { bothLanguages: "Sentry" },
      { bothLanguages: "GitHub" },
      { bothLanguages: "Asana" },
      { bothLanguages: "AppDrag" },
      { bothLanguages: "Google Analytics" },
      { bothLanguages: "Search Console" },
      { bothLanguages: "Twilio" },
    ],
  },
  {
    page: 2,
    role: {
      fr: "Chargée de projets digitaux, et événements",
      en: "Digital projects and events officer",
    },
    employer: { bothLanguages: "BNP Paribas (2015 - 2018)" },
    context: [
      {
        fr: "BNP Paribas est un grand groupe bancaire au sein duquel j'ai mené des projets dans 3 entités différentes (Mécénat, Legal, Achats), avec une forte coordination et un niveau d'exigence élevé.",
        en: "BNP Paribas is an international banking group where I led projects in 3 different entities (Philantropy, Legal, Procurement), with strong coordination and a high level of quality.",
      },
    ],
    missions: [
      {
        fr: "Événémentiel : organisation de jusqu'à 130 événements/an, pour des centaines de participant·es",
        en: "Events: organized up to 130 events a year with hundreds of participants",
      },
      {
        fr: "Gestion de la communication digitale et webmastering : intranet, site externe, réseaux sociaux, réseau social d'entreprise, etc.",
        en: "Digital communication management and webmastering: intranet, external website, social networks, corporate social network, etc.",
      },
      {
        fr: "Acculturation digitale, mise en place des outils digitaux internes et formation des équipes à leur utilisation",
        en: "Digital acculturation, deployed new internal digital tools and trained the teams to use them",
      },
    ],
  },
]
