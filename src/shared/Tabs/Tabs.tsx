import "./Tabs.css"

export interface Tab<Id extends string = string> {
  id: Id
  label: string
}

interface TabsProps<Id extends string> {
  tabs: Tab<Id>[]
  active: Id
  onSelect: (id: Id) => void
  /** Nom de la barre d'onglets pour les lecteurs d'écran. */
  ariaLabel: string
}

/** Barre d'onglets partagée : un seul onglet actif à la fois. */
export function Tabs<Id extends string>({
  tabs,
  active,
  onSelect,
  ariaLabel,
}: TabsProps<Id>) {
  return (
    <div className="tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={active === tab.id ? "tab tab--active" : "tab"}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
