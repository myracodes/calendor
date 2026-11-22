// Lecture et écriture de l'objectif de poids dans Supabase (table
// `weight_goals`, voir supabase/weight_goals.sql).

import { requireSupabase } from "../supabase/client"

const COLUMNS = "target_kg"

type WeightGoalRow = {
  target_kg: number | null
}

function toError(error: { message: string }): Error {
  return new Error(`Erreur de la base de données : ${error.message}`)
}

/** L'objectif du compte connecté, en kilos ; null s'il n'en a pas. */
export async function fetchWeightGoal(): Promise<number | null> {
  const { data, error } = await requireSupabase()
    .from("weight_goals")
    .select(COLUMNS)
    .maybeSingle()
  if (error !== null) throw toError(error)
  return (data as WeightGoalRow | null)?.target_kg ?? null
}

/**
 * Enregistre l'objectif du compte connecté (null le retire). La ligne du
 * compte est créée au premier enregistrement, puis mise à jour : user_id,
 * rempli par la base, sert de clé au upsert.
 */
export async function saveWeightGoal(
  targetKg: number | null,
): Promise<number | null> {
  const { data, error } = await requireSupabase()
    .from("weight_goals")
    .upsert({ target_kg: targetKg }, { onConflict: "user_id" })
    .select(COLUMNS)
    .single()
  if (error !== null) throw toError(error)
  return (data as WeightGoalRow).target_kg
}
