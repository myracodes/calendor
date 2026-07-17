import type { CvData } from "./types"

// Contenu du CV en ANGLAIS (version française : dataFr.ts). C'est le seul
// fichier à modifier pour faire évoluer cette version du CV.
// - `page` (1 ou 2) : déplacer un bloc d'une page à l'autre pour rééquilibrer.
// - Dans les textes, les segments entre ** sont rendus en gras violet.

export const CV_EN: CvData = {
  nom: "Myriam Mira",
  titre: "Software Developer",
  sections: {
    experiences: "Professional experience",
    experiencesSuite: "Professional experience (cont.)",
    sideProjects: "Side projects",
  },
  accroche:
    "React, Angular, and TypeScript Software Developer with ~5 years of experience, focusing on software quality, optimized processes, and accessibility. My work is accelerated and enhanced by AI, with a pragmatic and responsible approach. I am accustomed to demanding environments (testing, documentation, cost optimization, cross-team collaboration) and to working in an Agile environment.",
  // Injectée à la génération depuis src/assets/images/cv-photo.jpg (voir CvPage.tsx).
  photo: null,
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
  infos: "Based somewhere\n\n Bike | driving license | remote :)",

  sidebar: [
    {
      titre: "Education",
      page: 1,
      items: [
        {
          titre: "Advanced web and mobile development",
          texte: "Wild Code School Paris (2021-2022)\n1-year apprenticeship",
        },
        {
          titre: "Full-stack web development",
          texte: "Bachelor's degree (RNCP Level 6)\nIronhack Paris (2021) - English course",
        },
        {
          titre: "HTML, CSS, Javascript",
          texte: "Self-learning (2021)",
        },
        {
          titre: "Communications, Management, and Digital Strategy",
          texte: "Master's Degree: Sup de Pub (2018)",
        },
        {
          titre: "Digital Professions: Web Design, Writing, and Development",
          texte: "Bachelor's Degree: Cergy-Pontoise University (2016)",
        },
      ],
    },
    {
      titre: "Skills",
      page: 1,
      items: [
        {
          titre: "Front-end:",
          texte: "React / Angular / Next.js / JavaScript (TypeScript) / Storybook / Chromatic",
        },
        {
          titre: "UX/UI / CSS:",
          texte: "Tailwind / component libraries / Design System / UX/UI sensitivity / accessibility (WCAG/ARIA)",
        },
        { titre: "Back-end:", texte: "Node.js / PHP / Java" },
      ],
    },
    {
      titre: "Skills (cont.)",
      page: 2,
      items: [
        { titre: "Mock-ups/design:", texte: "Figma / Photoshop" },
        { titre: "Tests:", texte: "Cypress / Jest / Jasmine" },
        { titre: "Methodology:", texte: "pair programming / code reviews / Scrum / Agile" },
        {
          titre: "Tech watch:",
          texte: "meetups / conferences (React Paris, NewCrafts, Devoxx, Cloud Native Days, etc.)",
        },
        { titre: "Share:", texte: "speaker for Ladies of Code" },
        { titre: "Certifications:", texte: "Microsoft AZ-900 & PL-900" },
        {
          titre: "Tech reads:",
          texte: "The Pragmatic Programmer, Software Craft, Clean Code, etc.",
        },
      ],
    },
    {
      titre: "Soft skills",
      page: 2,
      items: [
        {
          texte:
            "Continuous improvement\nAttention to detail\nCuriosity\nLong-term thinking\nSystems thinking\nCommunication",
        },
      ],
    },
    {
      titre: "Activities",
      page: 2,
      items: [
        {
          texte:
            "Sports / singing & guitar playing / volunteering / reading / theater / sewing / languages / and more!",
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
      equipe: "Team of 15 people (6 front / 4 back / 1 PO / 1 PM / 1 QA / 1 UX/UI designer / 1 DevOps)",
      contexte: [
        "**VEOLIA - Wat.erp project: migrate an ASP.NET application's front-end to Angular**",
        "Build/run of Wat.erp, the water contract management software for ~90% of the French territory.",
      ],
      missions: [
        "Build: delivered “pixel perfect” screens and implemented CRUD features (**Angular/TypeScript, REST API**)",
        "Implemented the **Design System** and reusable components (**Tailwind/Angular**)",
        "Run: bug fixes",
        "Championed implementation of standards",
        "**Avanade internal projects**: worked on the internal Design System (design, development, and updates)",
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
        "Webmastered internal and external websites and tools, trained staff on digital tools",
      ],
    },
  ],

  sideProjects: [
    {
      page: 2,
      poste: "Calendor — printable life-organization toolbox",
      employeur: "Personal solo project (2026 - present)",
      contexte: [
        "Web app generating paper-style organization documents: custom calendars, bullet journal pages, grocery lists, letters, batch cooking menus.",
      ],
      missions: [
        "**100% client-side PDF generation** (@react-pdf/renderer): multi-page calendars with recurring events, public holidays and illustrations, configurable bullet journal (columns, dotted areas, checkboxes), grocery lists with presets",
        "**Supabase authentication** enabled through environment variables, on the way to shared multi-user lists (**RLS**)",
        "Calendar computations in **native UTC**, with no date library",
        "Quality: **strict TypeScript**, Biome + oxlint, custom **Vite** plugin injecting the commit hash, **WCAG AAA** accessibility",
        "**AI-assisted development with guardrails**: versioned and centralized agent rules (AGENTS.md), systematic review",
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
      poste: "Resume generator — this document",
      employeur: "Calendor feature (2026)",
      missions: [
        "This resume is generated by Calendor: **typed** content in a single data file, layout built from reusable **React components**, theme (purple/amber, Quicksand) isolated in tokens",
        "Blocks are assigned to pages by changing a single field (**page: 1 | 2**): content evolves without touching the layout",
      ],
    },
  ],
}
