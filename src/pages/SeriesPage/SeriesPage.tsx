import { useState } from "react"
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

  // Nom tapé dans la recherche du suivi, à reprendre dans le formulaire de
  // création de série du paramétrage.
  const [newSeriesName, setNewSeriesName] = useState<string | null>(null)

  function selectTab(tab: SeriesTab) {
    setNewSeriesName(null)
    setActiveTab(tab)
  }

  function createSeries(name: string) {
    setNewSeriesName(name)
    setActiveTab("settings")
  }

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

  return (
    <>
      <Tabs
        tabs={TABS}
        active={activeTab}
        onSelect={selectTab}
        ariaLabel="Onglets des séries"
      />

      <div role="tabpanel">
        {activeTab === "watch" ? (
          <WatchTab onCreateSeries={createSeries} />
        ) : (
          <SettingsTab initialNewSeriesName={newSeriesName} />
        )}
      </div>
    </>
  )
}
