import { applyPresetToSettings, PRESETS } from "../../../../presets"
import type { CalendarSettings, SettingsUpdater } from "../../../../types"
import { Tabs } from "../../../../shared/Tabs/Tabs"

export const BLANK_TEMPLATE = "__blank__"

interface TemplateTabsProps {
  settings: CalendarSettings
  onUpdate: SettingsUpdater
  active: string
  onSelectActive: (active: string) => void
}

export function TemplateTabs({
  settings,
  onUpdate,
  active,
  onSelectActive,
}: TemplateTabsProps) {
  function selectBlank() {
    onSelectActive(BLANK_TEMPLATE)
    onUpdate("events", [])
    onUpdate("includeBirthdays", false)
    onUpdate("includeDeaths", false)
    onUpdate("includeOtherEvents", false)
    onUpdate("includeSchedules", false)
  }

  function selectPreset(name: string) {
    const preset = PRESETS.find(p => p.name === name)
    if (!preset) return
    onSelectActive(name)
    const next = applyPresetToSettings({ ...settings, events: [] }, preset)
    onUpdate("events", next.events)
    onUpdate("includeBirthdays", next.includeBirthdays)
    onUpdate("includeDeaths", next.includeDeaths)
    onUpdate("includeOtherEvents", next.includeOtherEvents)
    onUpdate("includeSchedules", next.includeSchedules)
    // "To do list" est bâtie sur des libellés/récurrences propres au format mensuel ;
    // le format annuel ne les affiche pas, donc on force le retour au mensuel.
    // Le format hebdomadaire n'existe que pour "Calendrier vierge", donc tout preset y met fin aussi.
    if (preset.requiresMonthly || settings.format === "weekly")
      onUpdate("format", "monthly")
  }

  function select(id: string) {
    if (id === BLANK_TEMPLATE) selectBlank()
    else selectPreset(id)
  }

  return (
    <Tabs
      tabs={[
        { id: BLANK_TEMPLATE, label: "Calendrier vierge" },
        ...PRESETS.map(preset => ({ id: preset.name, label: preset.name })),
      ]}
      active={active}
      onSelect={select}
      ariaLabel="Modèle de calendrier"
    />
  )
}
