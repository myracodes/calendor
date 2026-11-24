import type { LifeEventsLibrary } from "../../../../lifeEvents/useLifeEvents"
import { Alert } from "../../../../shared/Alert/Alert"
import { Card } from "../../../../shared/Card/Card"
import type { useToast } from "../../../../shared/Toast/useToast"
import { isSupabaseConfigured } from "../../../../supabase/client"
import { AddLifeEventForm } from "../AddLifeEventForm/AddLifeEventForm"
import { LifeEventList } from "../LifeEventList/LifeEventList"

interface BirthdaysTabProps {
  library: LifeEventsLibrary
  showToast: ReturnType<typeof useToast>["showToast"]
}

/**
 * Onglet Anniversaires : les anniversaires et décès affichés sur les
 * calendriers (et sur l'accueil), à ajouter, modifier ou supprimer.
 */
export function BirthdaysTab({ library, showToast }: BirthdaysTabProps) {
  // Les anniversaires sont en base : sans Supabase, rien à afficher.
  if (!isSupabaseConfigured) {
    return (
      <Alert variantColor="danger" title="Base de données non configurée">
        Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir
        .env.example).
      </Alert>
    )
  }
  // L'échec du chargement est signalé par la page, sous la barre d'onglets.
  if (library.loadError !== null) return null

  return (
    <Card variantColor="candy">
      <h2>Anniversaires</h2>
      <AddLifeEventForm library={library} showToast={showToast} />
      {library.loading ? (
        <p className="hint">Chargement des anniversaires…</p>
      ) : (
        <LifeEventList library={library} showToast={showToast} />
      )}
    </Card>
  )
}
