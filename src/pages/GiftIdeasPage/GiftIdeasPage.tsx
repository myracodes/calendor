import { useGiftIdeas } from "../../giftIdeas/useGiftIdeas"
import { Alert } from "../../shared/Alert/Alert"
import type { CardVariantColor } from "../../shared/Card/Card"
import { useToast } from "../../shared/Toast/useToast"
import { isSupabaseConfigured } from "../../supabase/client"
import { AddRecipientCard } from "./components/AddRecipientCard/AddRecipientCard"
import { RecipientCard } from "./components/RecipientCard/RecipientCard"

// Couleurs des cards des personnes, reprises en boucle dans l'ordre alphabétique.
const CARD_COLORS: CardVariantColor[] = ["sun", "candy", "sky"]

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

  return <GiftIdeasCards />
}

// L'ajout d'une personne, puis une card par personne, sur les mêmes données
// chargées une seule fois.
function GiftIdeasCards() {
  const library = useGiftIdeas()
  const { toast, showToast } = useToast()

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
    <>
      <AddRecipientCard library={library} showToast={showToast} />
      {library.recipients.map((recipient, index) => (
        <RecipientCard
          key={recipient.id}
          recipient={recipient}
          ideas={library.ideas.filter(
            idea => idea.recipientId === recipient.id,
          )}
          variantColor={CARD_COLORS[index % CARD_COLORS.length]}
          library={library}
          showToast={showToast}
        />
      ))}
      {toast}
    </>
  )
}
