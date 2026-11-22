import { usePersistentState } from "../../../../shared/usePersistentState"
import {
  DEFAULT_PERIOD_ID,
  findPeriod,
  type WeightPeriod,
} from "../../../../weight/periods"

/**
 * La période choisie pour une courbe, retenue sur l'appareil sous
 * `storageKey` : chaque courbe garde la sienne.
 */
export function usePeriod(
  storageKey: string,
): [WeightPeriod, (periodId: string) => void] {
  // Texte libre plutôt que WeightPeriodId : la valeur enregistrée peut dater
  // d'un ancien identifiant, que findPeriod remplace par la période par défaut.
  const [periodId, setPeriodId] = usePersistentState<string>(
    storageKey,
    DEFAULT_PERIOD_ID,
  )
  return [findPeriod(periodId), setPeriodId]
}
