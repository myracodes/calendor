// Lecture et écriture des personnes de la page Idées cadeaux dans Supabase
// (table `gift_recipients`, voir supabase/gift_recipients.sql).

import { requireSupabase } from "../supabase/client"
import type { GiftRecipient, GiftRecipientDraft } from "./types"

const COLUMNS = "id, name, created_at"

type GiftRecipientRow = {
  id: string
  name: string
  created_at: string
}

/** Code PostgreSQL d'une violation de contrainte unique (ici : nom déjà pris). */
const UNIQUE_VIOLATION = "23505"

function toRecipient(row: GiftRecipientRow): GiftRecipient {
  return { id: row.id, name: row.name, createdAt: row.created_at }
}

function toError(error: { code: string; message: string }): Error {
  if (error.code === UNIQUE_VIOLATION) {
    return new Error("Cette personne a déjà sa liste.")
  }
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/** Toutes les personnes du compte connecté (l'ordre d'affichage est fait par sortByName). */
export async function fetchGiftRecipients(): Promise<GiftRecipient[]> {
  const { data, error } = await requireSupabase()
    .from("gift_recipients")
    .select(COLUMNS)
  if (error !== null) throw toError(error)
  return (data as GiftRecipientRow[]).map(toRecipient)
}

/** Crée la personne si elle est nouvelle (id null), sinon la met à jour. */
export async function saveGiftRecipient(
  draft: GiftRecipientDraft,
): Promise<GiftRecipient> {
  const values = { name: draft.name.trim() }
  const table = requireSupabase().from("gift_recipients")
  const { data, error } =
    draft.id === null
      ? await table.insert(values).select(COLUMNS).single()
      : await table.update(values).eq("id", draft.id).select(COLUMNS).single()
  if (error !== null) throw toError(error)
  return toRecipient(data as GiftRecipientRow)
}

/** Recrée une personne supprimée telle qu'elle était (même id, même date d'ajout), pour « Annuler ». */
export async function restoreGiftRecipient(
  recipient: GiftRecipient,
): Promise<GiftRecipient> {
  const { data, error } = await requireSupabase()
    .from("gift_recipients")
    .insert({
      id: recipient.id,
      name: recipient.name,
      created_at: recipient.createdAt,
    })
    .select(COLUMNS)
    .single()
  if (error !== null) throw toError(error)
  return toRecipient(data as GiftRecipientRow)
}

/** Supprime la personne, et avec elle ses idées (supprimées en cascade par la base). */
export async function deleteGiftRecipient(id: string): Promise<void> {
  const { error } = await requireSupabase()
    .from("gift_recipients")
    .delete()
    .eq("id", id)
  if (error !== null) throw toError(error)
}
