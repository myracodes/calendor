// Lecture des pages réservées accessibles au compte connecté dans Supabase
// (table `page_access`, voir supabase/page_access.sql).

import { supabase } from "../supabase/client"
import { isRestrictedPage, type RestrictedPage } from "./restrictedPages"

type PageAccessRow = {
  page: string
}

/**
 * Les pages réservées que le compte connecté peut ouvrir ; aucune sans
 * Supabase (dev sans .env.local), faute de compte à qui les attribuer.
 */
export async function fetchAccessiblePages(): Promise<Set<RestrictedPage>> {
  if (supabase === null) return new Set()
  const { data, error } = await supabase.from("page_access").select("page")
  if (error !== null) {
    throw new Error(`Erreur de la base de données : ${error.message}`)
  }
  const pages = (data as PageAccessRow[]).map(row => row.page)
  return new Set(pages.filter(isRestrictedPage))
}
