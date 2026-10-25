import { Alert } from "../../shared/Alert/Alert"
import { isSupabaseConfigured } from "../../supabase/client"
import { SeriesList } from "./components/SeriesList/SeriesList"

export function SeriesPage() {
  // Les séries sont en base : sans Supabase, pas de verrou ni de session,
  // donc rien à afficher.
  if (!isSupabaseConfigured) {
    return (
      <>
        <Alert variantColor="danger" title="Base de données non configurée">
          Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir
          .env.example).
        </Alert>
      </>
    )
  }

  return <SeriesList />
}
