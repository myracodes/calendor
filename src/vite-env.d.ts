/// <reference types="vite/client" />

// Typage des variables d'environnement du projet (préfixées VITE_ pour être
// exposées au front par Vite). Valeurs : .env.local en dev (voir .env.example),
// variables du repo GitHub pour le build de déploiement.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
