import { useState } from "react"
import { useGiftIdeas } from "../../giftIdeas/useGiftIdeas"
import { Alert } from "../../shared/Alert/Alert"
import { Card } from "../../shared/Card/Card"
import { useToast } from "../../shared/Toast/useToast"
import { isSupabaseConfigured } from "../../supabase/client"
import { AddRecipientForm } from "./components/AddRecipientForm/AddRecipientForm"
import { RecipientList } from "./components/RecipientList/RecipientList"

export function GiftIdeasPage() {
  // Les idées sont en base : sans Supabase, pas de verrou ni de session,
  // donc rien à afficher.
  if (!isSupabaseConfigured) {
    return (
      <Alert variantColor="danger" title="Base de données non configurée">
        Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir
        .env.example).
      </Alert>
    )
  }

  return <GiftIdeasCard />
}

// L'ajout d'une personne, puis un accordéon par personne avec ses idées.
function GiftIdeasCard() {
  const library = useGiftIdeas()
  const { toast, showToast } = useToast()
  const [addedRecipientId, setAddedRecipientId] = useState<string | null>(null)

  if (library.loading) {
    return <p className="hint">Chargement des idées cadeaux…</p>
  }
  if (library.loadError !== null) {
    return (
      <Alert variantColor="danger" title="Impossible de charger les idées">
        {library.loadError}
      </Alert>
    )
  }

  return (
    <Card variantColor="candy">
      <h2>Idées cadeaux</h2>
      <AddRecipientForm
        library={library}
        showToast={showToast}
        onAdded={setAddedRecipientId}
      />
      <RecipientList
        library={library}
        addedRecipientId={addedRecipientId}
        showToast={showToast}
      />
      {toast}
    </Card>
  )
}
