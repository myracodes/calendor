// Lecture et écriture des pesées dans Supabase (table `weight_entries`, voir
// supabase/weight_entries.sql).

import { todayIso } from "../dates"
import { requireSupabase } from "../supabase/client"
import { formatFullDay } from "./format"
import { mapMeasurements } from "./measurements"
import type { MeasurementId, WeightEntry, WeightEntryDraft } from "./types"
import { parseDecimal } from "./validation"

const COLUMNS =
  "id, weight_kg, measured_on, waist_cm, belly_cm, hip_cm, thigh_cm, created_at"

/** Colonne d'une mesure dans la table : son identifiant suivi de l'unité (`waist_cm`…). */
type MeasurementColumn = `${MeasurementId}_cm`

type WeightEntryRow = {
  id: string
  weight_kg: number
  measured_on: string
  created_at: string
} & Record<MeasurementColumn, number | null>

/** Code PostgreSQL d'une violation de contrainte unique (ici : déjà une pesée ce jour-là). */
const UNIQUE_VIOLATION = "23505"

function toEntry(row: WeightEntryRow): WeightEntry {
  return {
    id: row.id,
    weightKg: row.weight_kg,
    measuredOn: row.measured_on,
    measurements: mapMeasurements(id => row[`${id}_cm`]),
    createdAt: row.created_at,
  }
}

/** Les colonnes des mesures d'une ligne, à partir de leurs valeurs en cm. */
function toMeasurementColumns(
  measurements: Record<MeasurementId, number | null>,
): Record<MeasurementColumn, number | null> {
  return {
    waist_cm: measurements.waist,
    belly_cm: measurements.belly,
    hip_cm: measurements.hip,
    thigh_cm: measurements.thigh,
  }
}

/**
 * Déjà une pesée ce jour-là. Le message dit lequel ; c'est au formulaire
 * d'ajouter quoi faire (l'ajout renvoie vers l'historique, que la
 * modification n'a pas à citer).
 */
export class DuplicateDayError extends Error {}

/** @param measuredOn jour de la pesée enregistrée, cité si elle tombe un jour déjà pris */
function toError(
  error: { code: string; message: string },
  measuredOn?: string,
): Error {
  if (error.code === UNIQUE_VIOLATION && measuredOn !== undefined) {
    return new DuplicateDayError(
      `Il y a déjà une pesée le ${formatFullDay(measuredOn)}.`,
    )
  }
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/** Toutes les pesées du compte connecté (l'ordre d'affichage est fait par sortByDay). */
export async function fetchWeightEntries(): Promise<WeightEntry[]> {
  const { data, error } = await requireSupabase()
    .from("weight_entries")
    .select(COLUMNS)
  if (error !== null) throw toError(error)
  return (data as WeightEntryRow[]).map(toEntry)
}

/**
 * Crée la pesée si elle est nouvelle (id null), sinon la met à jour ; sans
 * jour, elle est datée d'aujourd'hui, et une mesure laissée vide est
 * enregistrée comme non mesurée.
 */
export async function saveWeightEntry(
  draft: WeightEntryDraft,
): Promise<WeightEntry> {
  const weightKg = parseDecimal(draft.weight)
  if (weightKg === null) throw new Error("Ce poids n'est pas valide.")
  const measuredOn = draft.measuredOn === "" ? todayIso() : draft.measuredOn
  const values = {
    weight_kg: weightKg,
    measured_on: measuredOn,
    ...toMeasurementColumns(
      mapMeasurements(id => parseDecimal(draft.measurements[id])),
    ),
  }
  const table = requireSupabase().from("weight_entries")
  const { data, error } =
    draft.id === null
      ? await table.insert(values).select(COLUMNS).single()
      : await table.update(values).eq("id", draft.id).select(COLUMNS).single()
  if (error !== null) throw toError(error, measuredOn)
  return toEntry(data as WeightEntryRow)
}

/** Recrée une pesée supprimée telle qu'elle était (même id, mêmes mesures, même date d'ajout), pour « Annuler ». */
export async function restoreWeightEntry(
  entry: WeightEntry,
): Promise<WeightEntry> {
  const { data, error } = await requireSupabase()
    .from("weight_entries")
    .insert({
      id: entry.id,
      weight_kg: entry.weightKg,
      measured_on: entry.measuredOn,
      ...toMeasurementColumns(entry.measurements),
      created_at: entry.createdAt,
    })
    .select(COLUMNS)
    .single()
  if (error !== null) throw toError(error, entry.measuredOn)
  return toEntry(data as WeightEntryRow)
}

export async function deleteWeightEntry(id: string): Promise<void> {
  const { error } = await requireSupabase()
    .from("weight_entries")
    .delete()
    .eq("id", id)
  if (error !== null) throw toError(error)
}
