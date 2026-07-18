import type { CvAccroche, CvContent, CvLocale } from "./types"

// Contenu du CV en ANGLAIS (version française : dataFr.ts). C'est le seul
// fichier à modifier pour faire évoluer cette version du CV.
// - `page` (1 ou 2) : déplacer un bloc d'une page à l'autre pour rééquilibrer.
// - Dans les textes, les segments entre ** sont rendus en gras violet.

/**
 * Les accroches disponibles en anglais : "dev" pour postuler à des postes de
 * développeuse (défaut), "management" pour des postes de cheffe de projet /
 * scrum master. Le choix se fait sur la page CV, à la génération.
 */
const ACCROCHES_EN: Record<CvAccroche, string> = {
  dev: "React, Angular, and TypeScript Software Developer with ~5 years of experience, focusing on software quality, optimized processes, and accessibility. My work is accelerated and enhanced by AI, with a pragmatic and responsible approach. I am accustomed to demanding environments (testing, documentation, cost optimization, cross-team collaboration) and to working in an Agile environment.",
  management:
    "Project Manager with a web development background: ~5 years of experience on web projects in Agile (Scrum) environments, following a degree in communication and digital strategy and several years as a project manager in a bank.\nThis dual profile allows me to bridge technical and business teams, produce realistic estimates, understand technical constraints, and ensure the quality of deliverables as well as processes.\nI use AI in a pragmatic and responsible way to speed up and strengthen project tracking, while keeping quality under control.",
}

/** Titre par défaut du CV selon l'accroche choisie (voir ACCROCHES_EN) ; reste modifiable sur la page CV. */
const TITRES_EN: Record<CvAccroche, string> = {
  dev: "Software Developer",
  management: "IT Project Manager",
}

// Le titre, l'accroche et la photo ne sont pas ici : choisis/injectés à la
// génération (voir CvPage.tsx), ils vivent dans TITRES_EN, ACCROCHES_EN et
// src/assets/images/cv-photo.jpg.
const CV_EN: CvContent = {
  nom: "Myriam Mira",
  sections: {
    experiences: "Professional experience",
    experiencesSuite: "Professional experience (cont.)",
    sideProjects: "Side projects",
  },
  // Coordonnées de REMPLACEMENT : les vraies vivent dans Supabase (table
  // cv_contact, ligne language = 'en', voir supabase/cv_contact.sql) et
  // remplacent ces valeurs à la génération. Ne jamais écrire les vraies
  // coordonnées ici : ce fichier est versionné et finit dans le bundle public.
  contact: [
    { texte: "email@example.com", url: "mailto:email@example.com" },
    { texte: "+33(0)6.00.00.00.00", url: "tel:+33600000000" },
    { texte: "github.com/example", url: "https://github.com/example" },
    { texte: "linkedin.com/in/example", url: "https://www.linkedin.com/in/example/" },
    { texte: "Fluent English / French" },
  ],
  infos: "Based somewhere\n\nBike | driving license | remote :)",

  sidebar: [
    {
      titre: "Education",
      page: 1,
      items: [
        {
          titre: "Advanced web and mobile development",
          texte: ["Wild Code School Paris (2021-2022)", "1-year apprenticeship"],
        },
        {
          titre: "Full-stack web development",
          texte: ["Bachelor's degree (RNCP Level 6)", "Ironhack Paris (2021) - English course"],
        },
        {
          titre: "HTML, CSS, Javascript",
          texte: ["Self-learning (2021)"],
        },
        {
          titre: "Communications, Management, and Digital Strategy",
          texte: ["Master's Degree: Sup de Pub (2018)"],
        },
        {
          titre: "Digital Professions: Web Design, Writing, and Development",
          texte: ["Bachelor's Degree: Cergy-Pontoise University (2016)"],
        },
      ],
    },
    {
      titre: "Skills",
      page: 1,
      items: [
        {
          titre: "Front-end:",
          texte: ["React / Angular", "Next.js", "JavaScript (TypeScript)", "Storybook / Chromatic"],
        },
        {
          titre: "UX/UI / CSS:",
          texte: ["Tailwind", "component libraries", "Design System", "UX/UI sensitivity", "accessibility (WCAG/ARIA)"],
        },
        { titre: "Back-end:", texte: ["Node.js / PHP / Java"] },
      ],
    },
    {
      titre: "Skills (cont.)",
      page: 2,
      items: [
        { titre: "Mock-ups/design:", texte: ["Figma / Photoshop"] },
        { titre: "Tests:", texte: ["Cypress / Jest / Jasmine"] },
        { titre: "Methodology:", texte: ["pair programming", "code reviews", "Scrum / Agile"] },
        {
          titre: "Tech watch:",
          texte: ["meetups", "conferences (React Paris, NewCrafts, Devoxx, Cloud Native Days, etc.)"],
        },
        { titre: "Share:", texte: ["speaker for Ladies of Code"] },
        { titre: "Certifications:", texte: ["Microsoft AZ-900 & PL-900"] },
        {
          titre: "Tech reads:",
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
            "Continuous improvement",
            "Attention to detail",
            "Curiosity",
            "Long-term thinking",
            "Systems thinking",
            "Communication",
          ],
        },
      ],
    },
    {
      titre: "Activities",
      page: 2,
      items: [
        {
          texte: [
            "Sports / singing & guitar playing / volunteering / reading / theater / sewing / languages / and more!",
          ],
        },
      ],
    },
  ],

  experiences: [
    {
      page: 1,
      poste: "Front-end web developer",
      employeur: "Cap Collectif (2024 - present)",
      equipe: "Team of 9 people: 5 dev / 1 DevOps / 1 QA / 1 PO / 1 UX/UI designer",
      contexte: ["Cap Collectif develops open-source collective intelligence tools, offered as SaaS."],
      missions: [
        "Designed and developed new features and front-end redesigns using **React / Next.js**",
        "Automated testing (**Cypress**)",
        "Fixed bugs in production",
        "Reviewed pull requests (code reviews)",
        "Enhanced SEO (Core Web Vitals, TTFB, etc)",
        "Updated the **Design System** (45 components): redesigns, new features, **accessibility**",
        "Implemented ADRs, code documentation, technical presentations",
        "Daily use of **AI** (**Claude Code** / Mistral / Copilot): debugging, refactoring, **back-end development**, faster and better developments",
        "Proactively reduced **technical debt**: 55% of legacy tests translated, regularly patched known vulnerabilities (each month), upgraded libraries, etc.",
        "Improved DX: **100% of flaky tests fixed**, 100% of “false diffs” fixed on Chromatic builds",
        "Reduced variable costs (40% savings on CI yearly)",
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
        "Agile methodology",
        "Claude Code",
        "AI",
      ],
    },
    {
      page: 1,
      poste: "Front-end web developer",
      employeur: "Avanade (consulting firm) (2022 - 2024)",
      projets: [
        {
          nom: "VEOLIA - Wat.erp project: migrate an ASP.NET application's front-end to Angular",
          equipe: "Team of 15 people (6 front / 4 back / 1 PO / 1 PM / 1 QA / 1 UX/UI designer / 1 DevOps)",
          contexte: ["Build/run of Wat.erp, the water contract management software for ~90% of the French territory."],
          missions: [
            "Build: delivered “pixel perfect” screens and implemented CRUD features (**Angular/TypeScript, REST API**)",
            "Implemented the **Design System** and reusable components (**Tailwind/Angular**)",
            "Run: bug fixes",
            "Championed implementation of standards",
          ],
        },
        {
          nom: "Avanade internal projects",
          missions: ["Design, development, and updates of internal **Design System** components"],
        },
      ],
      stack: [
        "Angular",
        "TypeScript",
        "REST",
        "Tailwind",
        "NgRx",
        "Agile methodology (Scrum)",
        "Azure DevOps",
        "SCSS",
        "PrimeNG",
        "Adobe XD",
        "Figma",
      ],
    },
    {
      page: 2,
      poste: "Full-stack web developer",
      employeur: "Visigo agency & GOOD Vibes project (2021 - 2022)",
      equipe: "Team of 3 people (1 CTPO / 1 full-stack developer / 1 UX/UI designer)",
      contexte: [
        "GOOD Vibes is a system for sending interactive videos via SMS, configurable through an admin dashboard.",
      ],
      missions: [
        "Completely revamped the marketing website in **React**",
        "Developed **front-end and back-end (React / Node.js)** features and components",
        "Fixed production bugs",
        "Drove continuous improvement: project management, code documentation, internal processes",
        "Designed and rolled out the **SEO** strategy",
        "Set up and deployed digital tools, and trained the team to use them",
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
      poste: "Communications and events project manager",
      employeur: "BNP Paribas (2015 - 2018)",
      missions: [
        "Organized up to 130 events a year + internal & external communication",
        "Webmastering internal and external websites and tools",
        "Acculturated staff on digital tools and trained them on internal digital platforms",
      ],
    },
  ],

  sideProjects: [
    {
      page: 2,
      poste: "Calendor",
      employeur: "Personal solo project (2026 - present)",
      contexte: [
        "Web app generating personalized modern-style organization documents: custom calendars, bullet journal pages, grocery lists, letters, batch cooking menus.",
      ],
      missions: [
        "**100% client-side PDF generation** (@react-pdf/renderer): multi-page calendars with recurring events and tasks, public holidays and life events, configurable bullet journal pages, grocery lists with presets",
        "**Supabase authentication** enabled through environment variables, on the way to shared multi-user lists (**RLS**)",
        "Calendar computations in **native UTC**, with no date library",
        "Quality: **strict TypeScript**, Biome + oxlint, custom **Vite** plugin injecting the commit hash, **WCAG AAA** accessibility",
        "**AI-assisted development with guardrails**: versioned and centralized agent rules (AGENTS.md), systematic review",
        "This resume was generated by Calendor",
      ],
      stack: ["React 19", "TypeScript", "Vite", "Supabase", "Biome", "oxlint", "GitHub Pages", "Claude Code"],
    },
    {
      page: 2,
      poste: "Resume",
      employeur: "Personal solo project (2025 - present)",
      contexte: ["Online resume built with Angular."],
      missions: [
        "**Angular 19** website with server-side rendering (**SSR**)",
        "French / English **internationalization** (@angular/localize)",
        "**PrimeNG** components",
        "**Jasmine / Karma** unit tests",
      ],
      stack: ["Angular 19", "TypeScript", "SSR", "PrimeNG", "RxJS", "Jasmine", "Karma", "Prettier"],
    },
  ],
}

/** L'unique export du fichier : tout le contenu anglais du CV (voir CvLocale). */
export const CV_LOCALE_EN: CvLocale = {
  cv: CV_EN,
  accroches: ACCROCHES_EN,
  titres: TITRES_EN,
}
