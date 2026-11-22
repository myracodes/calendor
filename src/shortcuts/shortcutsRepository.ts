// Lecture du raccourci du compte connecté dans Supabase (table `shortcuts`,
// voir supabase/shortcuts.sql).

import { supabase } from "../supabase/client"

type ShortcutRow = {
  key_sequence: string[]
}

/**
 * La séquence de touches du compte connecté ; null s'il n'en a pas, ou sans
 * Supabase (dev sans .env.local) : il n'a alors pas accès aux pages cachées.
 */
export async function fetchKeySequence(): Promise<string[] | null> {
  if (supabase === null) return null
  const { data, error } = await supabase
    .from("shortcuts")
    .select("key_sequence")
    .maybeSingle()
  if (error !== null) {
    throw new Error(`Erreur de la base de données : ${error.message}`)
  }
  return (data as ShortcutRow | null)?.key_sequence ?? null
}
