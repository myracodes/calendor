import type { CvAccroche, CvData, CvLocale } from "./types"

// Contenu du CV en FRANÇAIS (version anglaise : dataEn.ts). C'est le seul
// fichier à modifier pour faire évoluer cette version du CV.
// - `page` (1 ou 2) : déplacer un bloc d'une page à l'autre pour rééquilibrer.
// - Dans les textes, les segments entre ** sont rendus en gras violet.

/**
 * Les accroches disponibles en français : "dev" pour postuler à des postes de
 * développeuse (défaut), "management" pour des postes de cheffe de projet /
 * scrum master. Le choix se fait sur la page CV, à la génération.
 */
const ACCROCHES_FR: Record<CvAccroche, string> = {
  dev: "Développeuse React, Angular, TypeScript, avec ~5 ans d'expérience, et un focus sur la qualité du code, des processus, et de l'accessibilité.\nMes développements sont accélérés et améliorés par l'IA, avec une approche pragmatique et responsable.\nJe suis habituée aux environnements exigeants (tests, documentation, optimisation des coûts, collaboration inter-équipes), ainsi qu'au travail en mode Agile, dans des équipes de tailles variées.",
  management:
    "Cheffe de projet issue du développement web : ~5 ans d'expérience sur des projets web en mode Agile (Scrum), après une formation en communication et stratégie digitale, et plusieurs années comme cheffe de projets dans une banque. Ma double casquette me permet de faire le pont entre les équipes techniques et métier, d'estimer les charges avec réalisme, de comprendre les contraintes techniques, et de veiller à la qualité des livrables comme des processus. J'utilise l'IA avec une approche pragmatique et responsable pour accélérer et fiabiliser le suivi de projet en gardant le contrôle sur la qualité.",
}

/** Titre par défaut du CV selon l'accroche choisie (voir ACCROCHES_FR) ; reste modifiable sur la page CV. */
const TITRES_FR: Record<CvAccroche, string> = {
  dev: "Software developer",
  management: "Cheffe de projet IT",
}

const CV_FR: CvData = {
  nom: "Myriam Mira",
  titre: TITRES_FR.dev,
  sections: {
    experiences: "Expérience professionnelle",
    experiencesSuite: "Expérience professionnelle (suite)",
    sideProjects: "Side projects",
  },
  accroche: ACCROCHES_FR.dev,
  // Injectée à la génération depuis src/assets/images/cv-photo.jpg (voir CvPage.tsx).
  photo: null,
  // Les vraies données sont dans la BDD (table cv_contact
  // voir supabase/cv_contact.sql) et remplacent ces valeurs à la génération.
  // Ne jamais commiter les vraies coordonnées
  contact: [
    { texte: "email@exemple.fr", url: "mailto:email@exemple.fr" },
    { texte: "+33(0)6.00.00.00.00", url: "tel:+33600000000" },
    { texte: "github.com/exemple", url: "https://github.com/exemple" },
    { texte: "linkedin.com/in/exemple", url: "https://www.linkedin.com/in/exemple/" },
    { texte: "Bilingue anglais / français" },
  ],
  infos: "Basée quelque part\nVélo | Permis B | remote :)",

  sidebar: [
    {
      titre: "Formation",
      page: 1,
      items: [
        {
          titre: "Développement web et mobile avancé",
          texte: ["Wild Code School Paris (2021-2022)", "1 an en alternance"],
        },
        {
          titre: "Développement web fullstack",
          texte: ["Titre RNCP niveau 6 / Bac+3/4", "Ironhack Paris (2021) - en anglais"],
        },
        {
          titre: "HTML, CSS, Javascript",
          texte: ["Autoformation (2021)"],
        },
        {
          titre: "M2 Manager de la Communication et Stratégie Digitale",
          texte: ["Sup de Pub - INSEEC (2018)"],
        },
        {
          titre: "Licence Pro (L3) Métiers du Numérique : conception, rédaction et réalisation web",
          texte: ["Université de Cergy-Pontoise (2016)"],
        },
      ],
    },
    {
      titre: "Compétences",
      page: 1,
      items: [
        {
          titre: "Front-end :",
          texte: ["React / Angular", "Next.js", "JavaScript (TypeScript)", "Storybook / Chromatic"],
        },
        {
          titre: "UX/UI / CSS :",
          texte: [
            "Tailwind",
            "librairies de composants",
            "Design System",
            "perfectionnisme UX/UI",
            "accessibilité (WCAG/ARIA)",
          ],
        },
        { titre: "Back-end :", texte: ["Node.js / PHP / Java"] },
      ],
    },
    {
      titre: "Compétences (suite)",
      page: 2,
      items: [
        { titre: "Maquettage :", texte: ["Figma / Photoshop"] },
        { titre: "Tests :", texte: ["Cypress / Jest / Jasmine"] },
        { titre: "Méthodologie :", texte: ["pair programming", "code reviews", "Scrum / Agile"] },
        {
          titre: "Veille :",
          texte: ["meetups", "conférences (React Paris, NewCrafts, Devoxx, Cloud Native Days, etc.)"],
        },
        { titre: "Partage :", texte: ["oratrice Ladies of Code"] },
        { titre: "Certifications :", texte: ["Microsoft AZ-900 & PL-900"] },
        {
          titre: "Lectures tech :",
          texte: ["The Pragmatic Programmer, Software Craft, Clean Code, etc."],
        },
      ],
    },
    {
      titre: "Soft skills",
      page: 2,
      items: [
        {
          texte: [
            "Amélioration continue",
            "Vision long terme",
            "Communication",
            "Pensée systémique",
            "Curiosité",
            "Sens du détail",
          ],
        },
      ],
    },
    {
      titre: "Activités",
      page: 2,
      items: [
        {
          texte: ["Sport / chant & guitare / bénévolat / lecture / théâtre / couture / langues vivantes / et autres !"],
        },
      ],
    },
  ],

  experiences: [
    {
      page: 1,
      poste: "Développeuse front-end",
      employeur: "Cap Collectif (2024 - aujourd'hui)",
      equipe: "Équipe de 9 personnes (5 dev / 1 DevOps / 1 QA / 1 PO / 1 UX/UI designer)",
      contexte: ["Cap Collectif développe des outils open source d'intelligence collective, en SaaS."],
      missions: [
        "Conception et développement de nouvelles features et refontes front-end en **React / Next.js**",
        "Tests automatisés (**Cypress**)",
        "Correction de bugs en production",
        "Relecture des PR (code reviews)",
        "Améliorations SEO (Core Web Vitals, TTFB, etc)",
        "Mise à jour du **Design System** (45 composants) : refontes, nouveautés, **accessibilité**",
        "Mise en place des ADR, documentation du code, présentations techniques",
        "Utilisation quotidienne de l'**IA** (**Claude Code** / Mistral / Copilot) : débug, refactorisations, **back-end**, accélération des développements",
        "Réduction proactive de la **dette technique** : 55% de tests legacy traduits, patch des failles de sécurité (1x/mois), montées de versions des librairies, etc.",
        "Amélioration de la DX : **correction de 100% des tests flaky** et des “faux diffs” Chromatic",
        "Diminution des coûts variables (40% d'économies sur la CI)",
      ],
      stack: [
        "React",
        "TypeScript",
        "GraphQL",
        "Next.js",
        "Relay",
        "Storybook",
        "Chromatic",
        "Figma",
        "Cypress",
        "CircleCI",
        "react-hook-form",
        "Docker",
        "NPM",
        "méthode Agile",
        "Claude Code",
        "IA",
      ],
    },
    {
      page: 1,
      poste: "Développeuse front-end",
      employeur: "Avanade (ESN) (2022 - 2024)",
      projets: [
        {
          nom: "Projet VEOLIA - Wat.erp : portage du front-end d'une application ASP.NET vers Angular",
          equipe: "Équipe de 15 personnes (6 front / 4 back / 1 PO / 1 PM / 1 QA / 1 designer / 1 DevOps)",
          contexte: ["Build/run de Wat.erp, le logiciel de gestion des contrats eau de ~90% du territoire français."],
          missions: [
            "Build : implémentation “pixel perfect” des écrans et du CRUD (**API REST**)",
            "Mise en place du **Design System** et des composants réutilisables (**Angular/TypeScript**)",
            "Run : correction des bugs",
            "Proposition et mise en place de normes",
          ],
        },
        {
          nom: "Projets internes Avanade",
          missions: ["Conception, développement et mise à jour de composants du **Design System** interne"],
        },
      ],
      stack: [
        "Angular",
        "TypeScript",
        "REST",
        "Tailwind",
        "NgRx",
        "méthode Agile (Scrum)",
        "Azure DevOps",
        "SCSS",
        "PrimeNG",
        "Adobe XD",
        "Figma",
      ],
    },
    {
      page: 2,
      poste: "Développeuse full-stack",
      employeur: "Agence Visigo & projet GOOD Vibes (2021 - 2022)",
      equipe: "Équipe de 3 personnes (1 CTPO / 1 dev full-stack / 1 UX/UI designer)",
      contexte: [
        "GOOD Vibes est un système d'envoi de vidéos interactives par SMS, paramétrable via un dashboard admin.",
      ],
      missions: [
        "Refonte intégrale du site vitrine en **React**",
        "Développement des features **front-end et back-end (React / Node.js)** et des composants",
        "Correction des bugs",
        "Gestion des projets, documentation du code, amélioration des processus internes",
        "Définition et application de la stratégie **SEO**",
        "Mise en place d'outils digitaux & formation de l'équipe",
      ],
      stack: [
        "React",
        "Node.js",
        "Storybook",
        "Chromatic",
        "Figma",
        "Cypress",
        "Jest",
        "Netlify",
        "Sentry",
        "GitHub",
        "Asana",
        "AppDrag",
        "Google Analytics",
        "Search Console",
        "Twilio",
      ],
    },
    {
      page: 2,
      poste: "Chargée de projets digitaux, communication, et événements",
      employeur: "BNP Paribas (2015 - 2018)",
      missions: [
        "Organisation de jusqu'à 130 événements/an, communication interne et externe",
        "Webmastering des sites et outils internes et externes",
        "Acculturation digitale et formation aux outils digitaux internes",
      ],
    },
  ],

  sideProjects: [
    {
      page: 2,
      poste: "Calendor",
      employeur: "Projet personnel (2026 - aujourd'hui)",
      contexte: [
        "Application web qui génère des documents d'organisation au design moderne : calendriers personnalisés, pages de bullet journal, listes de courses, courriers, menus de batch cooking, etc.",
      ],
      missions: [
        "Génération des **PDF 100% côté client** (@react-pdf/renderer) : calendriers multi-pages avec événements récurrents, jours fériés et illustrations, bullet journal paramétrable (colonnes, pointillés, cases à cocher), listes de courses avec presets",
        "**Authentification Supabase** activable par variables d'environnement, en route vers des listes partagées à plusieurs (**RLS**)",
        "Calculs de calendrier en **UTC natif**, sans librairie de dates",
        "Qualité : **TypeScript strict**, Biome + oxlint, plugin **Vite** maison injectant le hash de commit, accessibilité **WCAG AAA**",
        "Développement **assisté par IA avec garde-fous** : règles d'agents centralisées et versionnées (AGENTS.md), relecture systématique",
        "Ce CV a été généré par Calendor.",
      ],
      stack: [
        "React 19",
        "TypeScript",
        "Vite",
        "@react-pdf/renderer",
        "Supabase",
        "Biome",
        "oxlint",
        "GitHub Pages",
        "Claude Code",
      ],
    },
    {
      page: 2,
      poste: "Resume",
      employeur: "Projet personnel (2025 - aujourd'hui)",
      contexte: ["CV en ligne développé en Angular."],
      missions: [
        "Site **Angular 19** avec rendu côté serveur (**SSR**)",
        "**Internationalisation** français / anglais (@angular/localize)",
        "Composants **PrimeNG**",
        "Tests unitaires **Jasmine / Karma**",
      ],
      stack: ["Angular 19", "TypeScript", "SSR", "PrimeNG", "RxJS", "Jasmine", "Karma", "Prettier"],
    },
  ],
}

/** L'unique export du fichier : tout le contenu français du CV (voir CvLocale). */
export const CV_LOCALE_FR: CvLocale = {
  cv: CV_FR,
  accroches: ACCROCHES_FR,
  titres: TITRES_FR,
}
