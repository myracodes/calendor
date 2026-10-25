import { type Tab, Tabs } from "../../shared/Tabs/Tabs"
import { usePersistentState } from "../../shared/usePersistentState"
import { BujoTab } from "./components/BujoTab/BujoTab"
import { StaffPaperTab } from "./components/StaffPaperTab/StaffPaperTab"

type PaperTab = "bujo" | "staffPaper"

const TABS: Tab<PaperTab>[] = [
  { id: "bujo", label: "BuJo" },
  { id: "staffPaper", label: "Papier à musique" },
]

export function PaperFactoryPage() {
  const [activeTab, setActiveTab] = usePersistentState<PaperTab>(
    "paperFactory.tab",
    "bujo",
  )

  return (
    <>
      <Tabs
        tabs={TABS}
        active={activeTab}
        onSelect={setActiveTab}
        ariaLabel="Type de papier"
      />

      {/* Onglets masqués plutôt que démontés : les réglages du BuJo, non
          persistés, survivent ainsi à un passage par l'autre onglet. */}
      <div hidden={activeTab !== "bujo"}>
        <BujoTab />
      </div>
      <div hidden={activeTab !== "staffPaper"}>
        <StaffPaperTab />
      </div>
    </>
  )
}
