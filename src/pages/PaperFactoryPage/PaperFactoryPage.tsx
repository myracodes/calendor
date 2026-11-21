import { type Tab, Tabs } from "../../shared/Tabs/Tabs"
import { usePersistentState } from "../../shared/usePersistentState"
import { BujoTab } from "./components/BujoTab/BujoTab"
import { StaffPaperTab } from "./components/StaffPaperTab/StaffPaperTab"
import { WeeklyMealsTab } from "./components/WeeklyMealsTab/WeeklyMealsTab"

type PaperTab = "bujo" | "staffPaper" | "weeklyMeals"

const TABS: Tab<PaperTab>[] = [
  { id: "bujo", label: "BuJo" },
  { id: "staffPaper", label: "Papier à musique" },
  { id: "weeklyMeals", label: "Repas de la semaine" },
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
          persistés, survivent ainsi à un passage par un autre onglet. */}
      <div hidden={activeTab !== "bujo"}>
        <BujoTab />
      </div>
      <div hidden={activeTab !== "staffPaper"}>
        <StaffPaperTab />
      </div>
      <div hidden={activeTab !== "weeklyMeals"}>
        <WeeklyMealsTab />
      </div>
    </>
  )
}
