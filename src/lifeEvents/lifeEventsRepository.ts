// Lecture et écriture des anniversaires et décès dans Supabase (table
// `life_events`, voir supabase/life_events.sql).

import type { Month } from "../constants/months"
import { requireSupabase } from "../supabase/client"
import type { LifeEventDraft, LifeEventEntry, LifeEventKind } from "./types"
import { parseLifeEventDraft } from "./validation"
import { lifeEventTitle } from "./wording"

const COLUMNS = "id, kind, name, month, day, year, death_year, created_at"

type LifeEventRow = {
  id: string
  kind: LifeEventKind
  name: string
  month: Month
  day: number
  year: number | null
  death_year: number | null
  created_at: string
}

/** Code PostgreSQL d'une violation de contrainte unique (ici : nom déjà pris pour ce type). */
const UNIQUE_VIOLATION = "23505"

function toEntry(row: LifeEventRow): LifeEventEntry {
  return {
    id: row.id,
    kind: row.kind,
    name: row.name,
    month: row.month,
    day: row.day,
    year: row.year ?? undefined,
    deathYear: row.death_year ?? undefined,
    createdAt: row.created_at,
  }
}

function toError(
  error: { code: string; message: string },
  event?: { kind: LifeEventKind; name: string },
): Error {
  if (error.code === UNIQUE_VIOLATION && event !== undefined) {
    return new Error(`${lifeEventTitle(event)} : déjà enregistré.`)
  }
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/** Tous les anniversaires et décès du compte connecté (l'ordre d'affichage est fait par sortByDate). */
export async function fetchLifeEvents(): Promise<LifeEventEntry[]> {
  const { data, error } = await requireSupabase()
    .from("life_events")
    .select(COLUMNS)
  if (error !== null) throw toError(error)
  return (data as LifeEventRow[]).map(toEntry)
}

/** Crée l'entrée si elle est nouvelle (id null), sinon la met à jour. */
export async function saveLifeEvent(
  draft: LifeEventDraft,
): Promise<LifeEventEntry> {
  const values = parseLifeEventDraft(draft)
  // Le bouton d'enregistrement reste grisé tant que la saisie n'est pas valide.
  if (values === null) throw new Error("Saisie incomplète.")
  const columns = {
    kind: values.kind,
    name: values.name,
    month: values.month,
    day: values.day,
    year: values.year,
    death_year: values.deathYear,
  }
  const table = requireSupabase().from("life_events")
  const { data, error } =
    draft.id === null
      ? await table.insert(columns).select(COLUMNS).single()
      : await table.update(columns).eq("id", draft.id).select(COLUMNS).single()
  if (error !== null) throw toError(error, values)
  return toEntry(data as LifeEventRow)
}

/** Recrée une entrée supprimée telle qu'elle était (même id, même date d'ajout), pour « Annuler ». */
export async function restoreLifeEvent(
  entry: LifeEventEntry,
): Promise<LifeEventEntry> {
  const { data, error } = await requireSupabase()
    .from("life_events")
    .insert({
      id: entry.id,
      kind: entry.kind,
      name: entry.name,
      month: entry.month,
      day: entry.day,
      year: entry.year ?? null,
      death_year: entry.deathYear ?? null,
      created_at: entry.createdAt,
    })
    .select(COLUMNS)
    .single()
  if (error !== null) throw toError(error, entry)
  return toEntry(data as LifeEventRow)
}

export async function deleteLifeEvent(id: string): Promise<void> {
  const { error } = await requireSupabase()
    .from("life_events")
    .delete()
    .eq("id", id)
  if (error !== null) throw toError(error)
}
