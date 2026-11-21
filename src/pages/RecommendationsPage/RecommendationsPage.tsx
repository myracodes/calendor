import {
  CATEGORY_WORDING,
  RECOMMENDATION_CATEGORIES,
} from "../../recommendations/categories"
import type { RecommendationCategory } from "../../recommendations/types"
import { useRecommendations } from "../../recommendations/useRecommendations"
import { Alert } from "../../shared/Alert/Alert"
import type { CardVariantColor } from "../../shared/Card/Card"
import { type Tab, Tabs } from "../../shared/Tabs/Tabs"
import { useToast } from "../../shared/Toast/useToast"
import { usePersistentState } from "../../shared/usePersistentState"
import { isSupabaseConfigured } from "../../supabase/client"
import { RecommendationList } from "./components/RecommendationList/RecommendationList"

const TABS: Tab<RecommendationCategory>[] = RECOMMENDATION_CATEGORIES.map(
  category => ({ id: category, label: CATEGORY_WORDING[category].tabLabel }),
)

const CARD_COLORS: Record<RecommendationCategory, CardVariantColor> = {
  film: "sun",
  musical: "candy",
  book: "sky",
  series: "sun",
}

export function RecommendationsPage() {
  // Les recos sont en base : sans Supabase, pas de verrou ni de session,
  // donc rien à afficher.
  if (!isSupabaseConfigured) {
    return (
      <Alert variantColor="danger" title="Base de données non configurée">
        Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir
        .env.example).
      </Alert>
    )
  }

  return <RecommendationTabs />
}

// Un onglet par catégorie, sur les mêmes recos chargées une seule fois.
function RecommendationTabs() {
  const [activeTab, setActiveTab] = usePersistentState<RecommendationCategory>(
    "recommendations.tab",
    "film",
  )
  const library = useRecommendations()
  const { toast, showToast } = useToast()

  return (
    <>
      <Tabs
        tabs={TABS}
        active={activeTab}
        onSelect={setActiveTab}
        ariaLabel="Type de reco"
      />

      {library.loading && <p className="hint">Chargement des recos…</p>}
      {library.loadError !== null && (
        <Alert variantColor="danger" title="Impossible de charger les recos">
          {library.loadError}
        </Alert>
      )}

      {/* Onglets masqués plutôt que démontés : une reco en cours de saisie
          survit ainsi à un passage par un autre onglet. */}
      {!library.loading &&
        library.loadError === null &&
        RECOMMENDATION_CATEGORIES.map(category => (
          <div key={category} hidden={activeTab !== category}>
            <RecommendationList
              category={category}
              variantColor={CARD_COLORS[category]}
              library={library}
              showToast={showToast}
            />
          </div>
        ))}
      {toast}
    </>
  )
}
