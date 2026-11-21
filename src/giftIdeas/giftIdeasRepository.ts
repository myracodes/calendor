// Lecture et écriture des idées cadeaux dans Supabase (table `gift_ideas`,
// voir supabase/gift_ideas.sql).

import { requireSupabase } from "../supabase/client"
import type { GiftIdea, GiftIdeaDraft } from "./types"

const COLUMNS = "id, recipient_id, title, created_at"

type GiftIdeaRow = {
  id: string
  recipient_id: string
  title: string
  created_at: string
}

/** Code PostgreSQL d'une violation de contrainte unique (ici : idée déjà dans la liste de la personne). */
const UNIQUE_VIOLATION = "23505"

function toIdea(row: GiftIdeaRow): GiftIdea {
  return {
    id: row.id,
    recipientId: row.recipient_id,
    title: row.title,
    createdAt: row.created_at,
  }
}

function toError(error: { code: string; message: string }): Error {
  if (error.code === UNIQUE_VIOLATION) {
    return new Error("Cette idée est déjà dans sa liste.")
  }
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/** Toutes les idées du compte connecté, toutes personnes confondues (l'ordre d'affichage est fait par sortNewestFirst). */
export async function fetchGiftIdeas(): Promise<GiftIdea[]> {
  const { data, error } = await requireSupabase()
    .from("gift_ideas")
    .select(COLUMNS)
  if (error !== null) throw toError(error)
  return (data as GiftIdeaRow[]).map(toIdea)
}

/** Crée l'idée si elle est nouvelle (id null), sinon la met à jour. */
export async function saveGiftIdea(draft: GiftIdeaDraft): Promise<GiftIdea> {
  const values = { recipient_id: draft.recipientId, title: draft.title.trim() }
  const table = requireSupabase().from("gift_ideas")
  const { data, error } =
    draft.id === null
      ? await table.insert(values).select(COLUMNS).single()
      : await table.update(values).eq("id", draft.id).select(COLUMNS).single()
  if (error !== null) throw toError(error)
  return toIdea(data as GiftIdeaRow)
}

/**
 * Recrée des idées supprimées telles qu'elles étaient (même id, même date
 * d'ajout), pour « Annuler » : une idée seule, ou toutes celles d'une personne
 * remise après sa suppression.
 */
export async function restoreGiftIdeas(ideas: GiftIdea[]): Promise<GiftIdea[]> {
  if (ideas.length === 0) return []
  const { data, error } = await requireSupabase()
    .from("gift_ideas")
    .insert(
      ideas.map(idea => ({
        id: idea.id,
        recipient_id: idea.recipientId,
        title: idea.title,
        created_at: idea.createdAt,
      })),
    )
    .select(COLUMNS)
  if (error !== null) throw toError(error)
  return (data as GiftIdeaRow[]).map(toIdea)
}

export async function deleteGiftIdea(id: string): Promise<void> {
  const { error } = await requireSupabase()
    .from("gift_ideas")
    .delete()
    .eq("id", id)
  if (error !== null) throw toError(error)
}
