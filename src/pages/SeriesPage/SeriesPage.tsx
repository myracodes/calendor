import { Alert } from "../../shared/Alert/Alert"
import { type Tab, Tabs } from "../../shared/Tabs/Tabs"
import { usePersistentState } from "../../shared/usePersistentState"
import { isSupabaseConfigured } from "../../supabase/client"
import { SettingsTab } from "./components/SettingsTab/SettingsTab"
import { WatchTab } from "./components/WatchTab/WatchTab"

type SeriesTab = "watch" | "settings"

const TABS: Tab<SeriesTab>[] = [
  { id: "watch", label: "Suivi" },
  { id: "settings", label: "Paramétrage" },
]

export function SeriesPage() {
  // Persisté : on revient sur l'onglet laissé, en général "Suivi".
  const [activeTab, setActiveTab] = usePersistentState<SeriesTab>(
    "series.activeTab",
    "watch",
  )

  const tagline = <p className="tagline">Suivi des séries que je regarde</p>

  // Les séries sont en base : sans Supabase, pas de verrou ni de session,
  // donc rien à afficher.
  if (!isSupabaseConfigured) {
    return (
      <>
        {tagline}
        <Alert variantColor="danger" title="Base de données non configurée">
          Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir
          .env.example).
        </Alert>
      </>
    )
  }

  return (
    <>
      {tagline}

      <Tabs
        tabs={TABS}
        active={activeTab}
        onSelect={setActiveTab}
        ariaLabel="Onglets des séries"
      />

      <div role="tabpanel">
        {activeTab === "watch" ? <WatchTab /> : <SettingsTab />}
      </div>
    </>
  )
}
