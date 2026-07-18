import { supabase } from "../supabase/client"
import type { CvContact, CvLanguage } from "./types"

/**
 * Forme d'une ligne de la colonne jsonb `contact` en base. Les clés (`texte`,
 * comme la colonne `infos`) sont restées en français : la table et ses données
 * prédatent l'anglicisation du code, et une migration n'apporterait rien —
 * le mapping vers les types anglais se fait ici, à la frontière.
 */
type ContactRowLine = { texte: string; url?: string }

/**
 * Les vraies coordonnées du CV depuis Supabase (table cv_contact, une ligne
 * par langue), ou null si elles sont indisponibles : Supabase non configuré,
 * personne de connectée (la RLS ne renvoie alors aucune ligne), ou langue
 * absente de la table. Dans ce cas, le CV est généré avec les coordonnées de
 * remplacement de content/profile.ts.
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
    contact: (data.contact as ContactRowLine[]).map(line => ({ text: line.texte, url: line.url })),
    personalInfo: data.infos as string,
  }
}
