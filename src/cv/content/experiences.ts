import type { LocalizedExperience, LocalizedText } from "../types"

// Expériences professionnelles du CV.
// - `page` (1 ou 2) : déplacer une expérience d'une page à l'autre pour rééquilibrer.
// - Une expérience peut être marquée `pageFor: { pm: 1 }` pour basculer sur
//   la page 1 uniquement quand l'accroche "pm" est choisie (`page` reste la
//   page par défaut pour les autres accroches) — utile pour faire tenir un
//   CV allégé sur une seule page, voir resolveExperiences dans ../buildLocale.ts.
// - Dans les textes, les segments entre ** sont rendus en gras violet.
// - Les deux langues s'écrivent côte à côte (fr/en), ou en une fois via
//   bothLanguages quand le texte est identique — voir LocalizedText dans ../types.ts.
// - Une mission peut être taguée `tag: [...]` (ex. `tag: ["hybrid", "pm"]`)
//   pour remonter en tête (ou redescendre en fin) de sa liste quand une des
//   accroches listées est choisie sur la page CV. Elle peut aussi être
//   réservée à un sous-ensemble d'accroches avec `only: [...]` (ex.
//   `only: ["hybrid", "pm"]`) : elle n'apparaît alors que pour les accroches
//   listées, et disparaît entièrement pour les autres — voir PitchTaggedText
//   dans ../types.ts.

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
      // #region FEATURES
      // missions rédigées différemment selon le rôle
      {
        only: ["dev"],
        fr: "Développement de nouvelles features et refontes front-end (**React / Next.js**)",
        en: "Developed new features and front-end redesigns (**React / Next.js**)",
      },
      {
        only: ["hybrid"],
        fr: "Développement de nouvelles fonctionnalités et refontes",
        en: "Developed new features and front-end redesigns",
      },
      // #endregion FEATURES
      // ---------------------
      // #region TESTS
      // missions rédigées différemment selon le rôle
      {
        only: ["dev"],
        fr: "Tests automatisés (**Cypress**)",
        en: "Automated testing (**Cypress**)",
      },
      {
        only: ["hybrid"],
        fr: "Augmentation de la couverture des tests automatisés",
        en: "Increased automated test coverage",
      },
      // #endregion TESTS
      // ---------------------
      // #region BUGS FIXING
      // missions rédigées différemment selon le rôle
      {
        only: ["dev"],
        fr: "Correction de bugs en production",
        en: "Fixed bugs in production",
      },
      {
        only: ["hybrid"],
        fr: "Gestion des incidents en production",
        en: "Managed incidents in production",
      },
      // #endregion BUGS FIXING
      {
        only: ["pm"],
        fr: "Gestion des incidents, des demandes de support, et des commandes clients",
        en: "Managed incidents, support requests, and client orders",
      },
      // ---------------------
      {
        only: ["dev"],
        fr: "Relecture des PR (code reviews)",
        en: "Reviewed pull requests (code reviews)",
      },
      // ---------------------
      {
        only: ["dev"],
        fr: "Améliorations SEO (Core Web Vitals, TTFB, etc)",
        en: "Enhanced SEO (Core Web Vitals, TTFB, etc)",
      },
      // ---------------------
      {
        only: ["dev", "hybrid"],
        fr: "Mise à jour du **Design System** (45 composants) : refontes, nouveautés, **accessibilité**",
        en: "Updated the **Design System** (45 components): redesigns, new features, **accessibility**",
      },
      // ---------------------
      {
        only: ["dev", "hybrid"],
        fr: "Mise en place des ADR, documentation du code, présentations techniques",
        en: "Implemented ADRs, code documentation, technical presentations",
      },
      // ---------------------
      // #region AI
      {
        only: ["pm"],
        fr: "Utilisation quotidienne de l'**IA** : automatisations, découpage, etc.",
        en: "Daily use of **AI**: automations, breaking down tasks, etc.",
      },
      {
        only: ["dev", "hybrid"],
        fr: "Utilisation quotidienne de l'**IA** (**Claude Code** et autres) : débug, refactorisations, **back-end**, accélération des développements, découpage des tâches complexes, etc.",
        en: "Daily use of **AI** (**Claude Code** and others): debugging, refactoring, **back-end development**, faster and better developments, breaking down complex tasks, etc.",
      },
      // #endregion AI
      // ---------------------
      {
        only: ["dev", "hybrid"],
        fr: "**Gestion et réduction proactive de la dette technique** : 100% de tests legacy traduits, planification des mises à jour de sécurité, montées de versions des librairies, etc.",
        en: "**Proactively managed and reduced technical debt**: 100% of legacy tests translated, scheduled security updates, upgraded libraries, etc.",
      },
      // ---------------------
      {
        only: ["dev", "hybrid", "pm"],
        tag: ["hybrid", "pm"],
        fr: "**Pilotage des tâches techniques** : analyse des besoins, recherche de solutions techniques, création des EPIC, découpage, priorisation, et planification",
        en: "**Owned technical tasks**: analyzed requirements, researched technical solutions, created EPICs, broke down tasks, prioritized and planned them",
      },
      // ---------------------
      // #region DX
      // missions rédigées différemment selon le rôle
      {
        only: ["dev"],
        fr: "Amélioration de la DX : **correction de 100% des tests flaky** et des faux diffs Chromatic",
        en: "Improved DX: **100% of flaky tests fixed**, 100% of false diffs fixed on Chromatic builds",
      },
      {
        only: ["hybrid"],
        fr: "**Correction de 100% des tests instables et des faux positifs** dans les outils de vérification visuelle (CircleCI, Chromatic)",
        en: "**Fixed 100% of unstable tests and false positives** in visual verification tools (CircleCI, Chromatic)",
      },
      // #endregion DX
      // ---------------------
      {
        only: ["dev", "hybrid", "pm"],
        tag: ["hybrid"],
        fr: "Coordination avec les PO, QA et designer pour aligner besoins, contraintes et priorités.",
        en: "Coordinated with PO, QA, and design to align priorities.",
      },
      // ---------------------
      {
        only: ["dev", "hybrid", "pm"],
        tag: ["hybrid"],
        fr: "Diminution des coûts fixes et variables (40% d'économies sur la CI)",
        en: "Reduced fixed and variable costs (40% savings on CI yearly)",
      },
      // ---------------------
      {
        tag: ["hybrid"],
        only: ["hybrid", "pm"],
        fr: "**Contribution à la vision produit** via des propositions d'améliorations UX/UI",
        en: "Contributed to the product vision through UX/UI improvement proposals",
      },
      // ---------------------
      {
        tag: ["hybrid"],
        only: ["hybrid", "pm"],
        fr: "**Mise en place / amélioration des outils et processus de suivi**.",
        en: "**Implemented / improved tracking tools and processes**.",
      },
      // ---------------------
      {
        tag: ["hybrid"],
        only: ["hybrid", "pm"],
        fr: "Mise en place **d'automatisations** dans le backlog (GitHub Actions)",
        en: "Implemented automations in backlog (GitHub Actions)",
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
          // ---------------------
          {
            only: ["dev", "hybrid"],
            fr: "Build : implémentation pixel perfect des écrans d'après les maquettes",
            en: "Build: delivered pixel perfect screens based on the mock-ups",
          },
          // ---------------------
          {
            only: ["dev", "hybrid"],
            fr: "Intégration du CRUD (API REST) côté front-end",
            en: "Integration of CRUD features (REST API) on the front-end",
          },
          // ---------------------
          // #region UX/UI COLLABORATION
          {
            only: ["dev"],
            tag: ["hybrid"],
            fr: "Mise en place du **Design System** et des composants réutilisables (**Angular**), en collaboration avec le designer UX/UI",
            en: "Implemented the **Design System** and reusable components (**Angular**) in collaboration with the UX/UI designer",
          },
          {
            only: ["hybrid"],
            fr: "Coordination avec l'UX/UI designer autour des contraintes techniques",
            en: "Coordinated with the UX/UI regarding technical constraints",
          },
          {
            only: ["pm"],
            fr: "Collaboration avec le designer UX/UI pour la mise en place du Design System et analyse des contraintes métier et techniques",
            en: "Collaborated with the UX/UI designer to implement the Design System and analyze business and technical constraints",
          },
          // #endregion UX/UI COLLABORATION
          // ---------------------
          // #region BUGS FIXING
          // missions rédigées différemment selon le rôle
          {
            only: ["dev"],
            fr: "Run : correction des bugs",
            en: "Run: bug fixes",
          },
          {
            only: ["hybrid"],
            fr: "Run : gestion des incidents",
            en: "Run: incident management",
          },
          {
            only: ["pm"],
            fr: "Gestion des incidents",
            en: "Incident management",
          },
          // #endregion BUGS FIXING
          // ---------------------
          // #region CONVENTIONS
          // missions rédigées différemment selon le rôle
          {
            only: ["dev", "hybrid"],
            fr: "Proposition et mise en place de normes (git flow, conventional commits, design system, conventions de nommage, etc.)",
            en: "Championed implementation of standards (git flow, conventional commits, design system, naming conventions, etc.)",
          },
          {
            only: ["pm"],
            fr: "Proposition et mise en place de normes et bonnes pratiques au sein de l'équipe",
            en: "Championed implementation of standards and best practices within the team",
          },
          // #endregion CONVENTIONS
        ],
      },
      {
        name: {
          fr: "Projets internes Avanade",
          en: "Avanade internal projects",
        },
        missions: [
          {
            only: ["dev", "hybrid"],
            fr: "Conception, développement et mise à jour de composants du **Design System** interne",
            en: "Designed, developed, and updated the internal **Design System** components",
          },
          // ---------------------
          {
            fr: "Développement d'outils internes",
            en: "Developed internal tools",
          },
          // ---------------------
          {
            only: ["dev", "hybrid"],
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
    pageFor: { pm: 1 },
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
        fr: "GOOD Vibes est un système d'envoi de vidéos interactives par SMS, paramétrable via un dashboard admin ; Visigo est l'agence qui l'édite.",
        en: "GOOD Vibes is a system for sending interactive videos via SMS, configurable through an admin dashboard ; Visigo is the agency that publishes it.",
      },
    ],
    missions: [
      {
        only: ["dev"],
        fr: "Refonte intégrale du site vitrine GOOD Vibes en **React**",
        en: "Completely revamped the GOOD Vibes marketing website in **React**",
      },
      // ---------------------
      {
        only: ["dev", "hybrid"],
        fr: "Développement des features **front-end et back-end (React / Node.js)**",
        en: "Developed **front-end and back-end (React / Node.js)** features",
      },
      // ---------------------
      {
        only: ["dev"],
        fr: "Standardisation des composants",
        en: "Standardized components",
      },
      // #region BUGS FIXING
      // missions rédigées différemment selon le rôle
      { only: ["dev"], fr: "Correction des bugs", en: "Fixed production bugs" },
      {
        only: ["hybrid", "pm"],
        fr: "Gestion des incidents",
        en: "Incident management",
      },
      // #endregion BUGS FIXING
      // ---------------------
      {
        only: ["dev"],
        fr: "Déploiement (Netlify)",
        en: "Deployment (Netlify)",
      },
      // ---------------------
      {
        tag: ["hybrid", "pm"],
        fr: "Amélioration continue : gestion des projets techniques de l'agence, documentation approfondie du code et des processus, amélioration des processus internes",
        en: "Drove continuous improvement: technical projects management, in-depth code documentation, internal processes",
      },
      // ---------------------
      {
        only: ["dev", "hybrid"],
        fr: "Définition et application de la stratégie **SEO**",
        en: "Designed and rolled out the **SEO** strategy",
      },
      // ---------------------
      {
        fr: "Mise en place d'outils digitaux & formation de l'équipe",
        en: "Set up and deployed digital tools, and trained the team to use them",
      },
      // ---------------------
      {
        only: ["hybrid", "pm"],
        fr: "Monitoring de la qualité éditoriale (FR/EN) et applicative",
        en: "Monitored editorial quality (FR/EN) and application quality",
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
    pageFor: { pm: 1 },
    role: {
      fr: "Chargée de projets digitaux et événements",
      en: "Digital projects and events officer",
    },
    employer: { bothLanguages: "BNP Paribas (2015 - 2018)" },
    context: [
      {
        fr: "Grand groupe bancaire au sein duquel j'ai mené des projets dans 3 entités (Mécénat, Legal, Achats), avec une forte coordination et un niveau d'exigence élevé.",
        en: "International banking group where I led projects in 3 entities (Philantropy, Legal, Procurement), with strong coordination and a high level of quality.",
      },
    ],
    missions: [
      {
        fr: "Organisation de jusqu'à 130 événements/an, pour des centaines de participant·es",
        en: "Organized up to 130 events a year with hundreds of participants",
      },
      // ---------------------
      // #region DIGITAL COMMUNICATION
      {
        only: ["dev", "hybrid"],
        fr: "Gestion de la communication digitale et webmastering : intranet, site externe, réseaux sociaux, réseau social d'entreprise, etc.",
        en: "Digital communication management and webmastering: intranet, external website, social networks, corporate social network, etc.",
      },
      {
        only: ["pm"],
        fr: "Gestion de la communication digitale et webmastering",
        en: "Digital communication management and webmastering",
      },
      // #endregion DIGITAL COMMUNICATION
      // ---------------------
      // #region ACCULTURATION & CHANGE MANAGEMENT
      {
        only: ["dev"],
        fr: "Acculturation digitale, mise en place des outils digitaux internes et formation des équipes à leur utilisation, accompagnement au changement",
        en: "Digital acculturation, deployed new internal digital tools and trained the teams to use them, change management",
      },
      {
        only: ["hybrid", "pm"],
        tag: ["hybrid", "pm"],
        fr: "Mise en place d'outils, formation, et accompagnement au changement",
        en: "Deployed new tools, trainings, and change management",
      },
      // #endregion ACCULTURATION & CHANGE MANAGEMENT
      // ---------------------
      {
        tag: ["hybrid", "pm"],
        fr: "Amélioration des outils de suivi de projet, pour fluidifier la gestion et le reporting",
        en: "Improved project tracking tools, for better project management and reporting",
      },
    ],
  },
]
