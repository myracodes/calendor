import { supabase } from "../supabase/client"
import type { ContactLine, CvContact, CvLanguage } from "./types"

/**
 * Les vraies coordonnées du CV depuis Supabase (table cv_contact, une ligne
 * par langue), ou null si elles sont indisponibles : Supabase non configuré,
 * personne de connectée (la RLS ne renvoie alors aucune ligne), ou langue
 * absente de la table. Dans ce cas, le CV est généré avec les coordonnées de
 * remplacement du fichier de données de la langue.
 */
export async function fetchCvContact(language: CvLanguage): Promise<CvContact | null> {
  if (supabase === null) return null
  const { data, error } = await supabase
    .from("cv_contact")
    .select("contact, infos")
    .eq("language", language)
    .maybeSingle()
  if (error !== null || data === null) return null
  return {
    // Colonne jsonb : Supabase la renvoie non typée, la forme est garantie par
    // l'insertion (voir le modèle dans supabase/cv_contact.sql).
    contact: data.contact as ContactLine[],
    infos: data.infos as string,
  }
}
