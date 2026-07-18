import type { LocalizedExperience, LocalizedText } from "../types"

// Expériences professionnelles du CV.
// - `page` (1 ou 2) : déplacer une expérience d'une page à l'autre pour rééquilibrer.
// - Dans les textes, les segments entre ** sont rendus en gras violet.
// - Les deux langues s'écrivent côte à côte (fr/en), ou en une fois via
//   bothLanguages quand le texte est identique — voir LocalizedText dans ../types.ts.

/** Titres de la section : page 1, puis "(suite)" en page 2. */
export const EXPERIENCES_TITLES: { experiences: LocalizedText; experiencesSuite: LocalizedText } = {
  experiences: { fr: "Expérience professionnelle", en: "Professional experience" },
  experiencesSuite: { fr: "Expérience professionnelle (suite)", en: "Professional experience (cont.)" },
}

export const EXPERIENCES: LocalizedExperience[] = [
  {
    page: 1,
    role: { fr: "Développeuse front-end", en: "Front-end web developer" },
    employer: { fr: "Cap Collectif (2024 - aujourd'hui)", en: "Cap Collectif (2024 - present)" },
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
        fr: "Conception et développement de nouvelles features et refontes front-end en **React / Next.js**",
        en: "Designed and developed new features and front-end redesigns using **React / Next.js**",
      },
      { fr: "Tests automatisés (**Cypress**)", en: "Automated testing (**Cypress**)" },
      { fr: "Correction de bugs en production", en: "Fixed bugs in production" },
      { fr: "Relecture des PR (code reviews)", en: "Reviewed pull requests (code reviews)" },
      { fr: "Améliorations SEO (Core Web Vitals, TTFB, etc)", en: "Enhanced SEO (Core Web Vitals, TTFB, etc)" },
      {
        fr: "Mise à jour du **Design System** (45 composants) : refontes, nouveautés, **accessibilité**",
        en: "Updated the **Design System** (45 components): redesigns, new features, **accessibility**",
      },
      {
        fr: "Mise en place des ADR, documentation du code, présentations techniques",
        en: "Implemented ADRs, code documentation, technical presentations",
      },
      {
        fr: "Utilisation quotidienne de l'**IA** (**Claude Code** / Mistral / Copilot) : débug, refactorisations, **back-end**, accélération des développements",
        en: "Daily use of **AI** (**Claude Code** / Mistral / Copilot): debugging, refactoring, **back-end development**, faster and better developments",
      },
      {
        fr: "Réduction proactive de la **dette technique** : 55% de tests legacy traduits, patch des failles de sécurité (1x/mois), montées de versions des librairies, etc.",
        en: "Proactively reduced **technical debt**: 55% of legacy tests translated, regularly patched known vulnerabilities (each month), upgraded libraries, etc.",
      },
      {
        fr: "Amélioration de la DX : **correction de 100% des tests flaky** et des “faux diffs” Chromatic",
        en: "Improved DX: **100% of flaky tests fixed**, 100% of “false diffs” fixed on Chromatic builds",
      },
      {
        fr: "Diminution des coûts variables (40% d'économies sur la CI)",
        en: "Reduced variable costs (40% savings on CI yearly)",
      },
      {
        fr: "Pilotage des tâches techniques : recherches, création des **EPIC**, découpage et **priorisation** des tâches",
        en: "Owned technical tasks: research, **EPIC** creation, task breakdown and **prioritization**",
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
    employer: { fr: "Avanade (ESN) (2022 - 2024)", en: "Avanade (consulting firm) (2022 - 2024)" },
    projects: [
      {
        name: {
          fr: "Projet VEOLIA - Wat.erp : portage du front-end d'une application ASP.NET vers Angular",
          en: "VEOLIA - Wat.erp project: migrate an ASP.NET application's front-end to Angular",
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
            fr: "Build : implémentation “pixel perfect” des écrans et du CRUD (**API REST**)",
            en: "Build: delivered “pixel perfect” screens and implemented CRUD features (**Angular/TypeScript, REST API**)",
          },
          {
            fr: "Mise en place du **Design System** et des composants réutilisables (**Angular/TypeScript**)",
            en: "Implemented the **Design System** and reusable components (**Tailwind/Angular**)",
          },
          { fr: "Run : correction des bugs", en: "Run: bug fixes" },
          { fr: "Proposition et mise en place de normes", en: "Championed implementation of standards" },
        ],
      },
      {
        name: { fr: "Projets internes Avanade", en: "Avanade internal projects" },
        missions: [
          {
            fr: "Conception, développement et mise à jour de composants du **Design System** interne",
            en: "Design, development, and updates of internal **Design System** components",
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
        fr: "Gestion des projets, documentation du code, amélioration des processus internes",
        en: "Drove continuous improvement: project management, code documentation, internal processes",
      },
      { fr: "Définition et application de la stratégie **SEO**", en: "Designed and rolled out the **SEO** strategy" },
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
      fr: "Chargée de projets digitaux, communication, et événements",
      en: "Communications and events project manager",
    },
    employer: { bothLanguages: "BNP Paribas (2015 - 2018)" },
    missions: [
      {
        fr: "Organisation de jusqu'à 130 événements/an, communication interne et externe",
        en: "Organized up to 130 events a year + internal & external communication",
      },
      {
        fr: "Webmastering des sites et outils internes et externes",
        en: "Webmastering internal and external websites and tools",
      },
      {
        fr: "Acculturation digitale et formation aux outils digitaux internes",
        en: "Acculturated staff on digital tools and trained them on internal digital platforms",
      },
    ],
  },
]
