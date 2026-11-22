import { Alert } from "../../shared/Alert/Alert"
import { useToast } from "../../shared/Toast/useToast"
import { isSupabaseConfigured } from "../../supabase/client"
import { useWeightTracking } from "../../weight/useWeightTracking"
import { MeasurementsChartCard } from "./components/MeasurementsChartCard/MeasurementsChartCard"
import { WeightHistoryCard } from "./components/WeightHistoryCard/WeightHistoryCard"
import { WeightTrackingCard } from "./components/WeightTrackingCard/WeightTrackingCard"

// Les données sont protégées par la session et les règles RLS de leurs tables, comme le reste.
export function WeightPage() {
  // Les pesées sont en base : sans Supabase, pas de verrou ni de session,
  // donc rien à afficher.
  if (!isSupabaseConfigured) {
    return (
      <Alert variantColor="danger" title="Base de données non configurée">
        Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir
        .env.example).
      </Alert>
    )
  }

  return <WeightCards />
}

// Le suivi (ajout d'une pesée, courbe du poids et objectif), les courbes des
// mesures, puis l'historique : chargés une fois pour toutes les cards, qui
// partagent aussi le toast.
function WeightCards() {
  const tracking = useWeightTracking()
  const { toast, showToast } = useToast()

  if (tracking.loading) {
    return <p className="hint">Chargement des pesées…</p>
  }
  if (tracking.loadError !== null) {
    return (
      <Alert variantColor="danger" title="Impossible de charger les données">
        {tracking.loadError}
      </Alert>
    )
  }

  return (
    <>
      <WeightTrackingCard tracking={tracking} showToast={showToast} />
      <MeasurementsChartCard entries={tracking.entries} />
      <WeightHistoryCard tracking={tracking} showToast={showToast} />
      {toast}
    </>
  )
}
