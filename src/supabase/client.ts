// Client Supabase de l'app (authentification, et bientôt données partagées).
//
// L'URL et la clé "anon" viennent du dashboard Supabase (Settings → API).
// Ce ne sont PAS des secrets : elles finissent dans le bundle et sont conçues
// pour ça — la sécurité repose sur l'authentification et les règles RLS côté
// Supabase, jamais sur la discrétion de ces valeurs. En dev, les renseigner
// dans .env.local (gitignoré) ; en déploiement, dans les variables du repo
// GitHub (voir .github/workflows/deploy.yml).

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * false tant que le projet Supabase n'est pas configuré (variables absentes) :
 * l'app fonctionne alors comme avant, SANS verrou. Le verrou s'active tout seul
 * dès que les variables sont présentes — ça permet de fusionner ce code sans
 * casser le site le temps de créer le projet Supabase.
 */
export const isSupabaseConfigured = Boolean(url) && Boolean(anonKey)

/** Le client Supabase, ou null tant que le projet n'est pas configuré. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null

/** Le client, pour le code qui ne s'exécute que derrière le verrou (écran de connexion…). */
export function requireSupabase(): SupabaseClient {
  if (supabase === null) {
    throw new Error(
      "Supabase n'est pas configuré : renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir .env.example)",
    )
  }
  return supabase
}
