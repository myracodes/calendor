// Lecture et écriture des recos culturelles dans Supabase (table
// `recommendations`, voir supabase/recommendations.sql).

import { requireSupabase } from "../supabase/client"
import type {
  Recommendation,
  RecommendationCategory,
  RecommendationDraft,
} from "./types"

const COLUMNS = "id, category, title, recommended_by, created_at"

type RecommendationRow = {
  id: string
  category: RecommendationCategory
  title: string
  recommended_by: string
  created_at: string
}

/** Code PostgreSQL d'une violation de contrainte unique (ici : titre déjà dans l'onglet). */
const UNIQUE_VIOLATION = "23505"

function toRecommendation(row: RecommendationRow): Recommendation {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    recommendedBy: row.recommended_by,
    createdAt: row.created_at,
  }
}

function toError(error: { code: string; message: string }): Error {
  if (error.code === UNIQUE_VIOLATION) {
    return new Error("Ce titre est déjà dans la liste.")
  }
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/** Toutes les recos du compte connecté, la plus récente en premier. */
export async function fetchRecommendations(): Promise<Recommendation[]> {
  const { data, error } = await requireSupabase()
    .from("recommendations")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
  if (error !== null) throw toError(error)
  return (data as RecommendationRow[]).map(toRecommendation)
}

/** Crée la reco si elle est nouvelle (id null), sinon la met à jour. */
export async function saveRecommendation(
  draft: RecommendationDraft,
): Promise<Recommendation> {
  const values = {
    category: draft.category,
    title: draft.title.trim(),
    recommended_by: draft.recommendedBy.trim(),
  }
  const table = requireSupabase().from("recommendations")
  const { data, error } =
    draft.id === null
      ? await table.insert(values).select(COLUMNS).single()
      : await table.update(values).eq("id", draft.id).select(COLUMNS).single()
  if (error !== null) throw toError(error)
  return toRecommendation(data as RecommendationRow)
}

/** Recrée une reco supprimée telle qu'elle était (même id, même date d'ajout), pour « Annuler ». */
export async function restoreRecommendation(
  item: Recommendation,
): Promise<Recommendation> {
  const { data, error } = await requireSupabase()
    .from("recommendations")
    .insert({
      id: item.id,
      category: item.category,
      title: item.title,
      recommended_by: item.recommendedBy,
      created_at: item.createdAt,
    })
    .select(COLUMNS)
    .single()
  if (error !== null) throw toError(error)
  return toRecommendation(data as RecommendationRow)
}

export async function deleteRecommendation(id: string): Promise<void> {
  const { error } = await requireSupabase()
    .from("recommendations")
    .delete()
    .eq("id", id)
  if (error !== null) throw toError(error)
}
