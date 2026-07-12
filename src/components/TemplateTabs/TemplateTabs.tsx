import { useState } from "react"
import { applyPresetToSettings, PRESETS } from "../../presets"
import type { CalendarSettings, SettingsUpdater } from "../../types"
import "./TemplateTabs.css"

const BLANK = "__blank__"

interface TemplateTabsProps {
  settings: CalendarSettings
  onUpdate: SettingsUpdater
}

export function TemplateTabs({ settings, onUpdate }: TemplateTabsProps) {
  const [active, setActive] = useState<string>(BLANK)

  function selectBlank() {
    setActive(BLANK)
    onUpdate("events", [])
    onUpdate("includeBirthdays", false)
    onUpdate("includeDeaths", false)
    onUpdate("includeOtherEvents", false)
    onUpdate("includeSchedules", false)
  }

  function selectPreset(name: string) {
    const preset = PRESETS.find(p => p.name === name)
    if (!preset) return
    setActive(name)
    const next = applyPresetToSettings({ ...settings, events: [] }, preset)
    onUpdate("events", next.events)
    onUpdate("includeBirthdays", next.includeBirthdays)
    onUpdate("includeDeaths", next.includeDeaths)
    onUpdate("includeOtherEvents", next.includeOtherEvents)
    onUpdate("includeSchedules", next.includeSchedules)
  }

  return (
    <div className="template-tabs" role="tablist" aria-label="Modèle de calendrier">
      <button
        type="button"
        role="tab"
        aria-selected={active === BLANK}
        className={active === BLANK ? "template-tab template-tab--active" : "template-tab"}
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
