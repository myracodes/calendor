import { applyPresetToSettings, PRESETS } from "../../presets"
import type { CalendarSettings, SettingsUpdater } from "../../types"
import "./TemplateTabs.css"

export const BLANK_TEMPLATE = "__blank__"

interface TemplateTabsProps {
  settings: CalendarSettings
  onUpdate: SettingsUpdater
  active: string
  onSelectActive: (active: string) => void
}

export function TemplateTabs({ settings, onUpdate, active, onSelectActive }: TemplateTabsProps) {
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
    if (preset.requiresMonthly) onUpdate("format", "monthly")
  }

  return (
    <div className="template-tabs" role="tablist" aria-label="Modèle de calendrier">
      <button
        type="button"
        role="tab"
        aria-selected={active === BLANK_TEMPLATE}
        className={active === BLANK_TEMPLATE ? "template-tab template-tab--active" : "template-tab"}
        onClick={selectBlank}
      >
        Calendrier vierge
      </button>
      {PRESETS.map(preset => (
        <button
          key={preset.name}
          type="button"
          role="tab"
          aria-selected={active === preset.name}
          className={active === preset.name ? "template-tab template-tab--active" : "template-tab"}
          onClick={() => selectPreset(preset.name)}
        >
          {preset.name}
        </button>
      ))}
    </div>
  )
}
