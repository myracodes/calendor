import { useBooks } from "../../books/useBooks"
import { Alert } from "../../shared/Alert/Alert"
import { useToast } from "../../shared/Toast/useToast"
import { isSupabaseConfigured } from "../../supabase/client"
import { BookList } from "./components/BookList/BookList"

export function BooksPage() {
  // Les livres sont en base : sans Supabase, pas de verrou ni de session,
  // donc rien à afficher.
  if (!isSupabaseConfigured) {
    return (
      <Alert variantColor="danger" title="Base de données non configurée">
        Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir
        .env.example).
      </Alert>
    )
  }

  return <BookCards />
}

// Une card par format, sur les mêmes livres et séries chargés une seule fois.
function BookCards() {
  const library = useBooks()
  const { toast, showToast } = useToast()

  if (library.loading) return <p className="hint">Chargement des livres…</p>
  if (library.loadError !== null) {
    return (
      <Alert variantColor="danger" title="Impossible de charger les livres">
        {library.loadError}
      </Alert>
    )
  }

  return (
    <>
      <BookList
        format="print"
        variantColor="sun"
        library={library}
        showToast={showToast}
      />
      <BookList
        format="audio"
        variantColor="sky"
        library={library}
        showToast={showToast}
      />
      {toast}
    </>
  )
}
