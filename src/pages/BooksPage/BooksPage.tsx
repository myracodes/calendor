import { Alert } from "../../shared/Alert/Alert"
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

  return <BookList />
}
