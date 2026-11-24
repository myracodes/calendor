import { applyPresetToSettings, PRESETS } from "../../../../presets"
import type { CalendarSettings, SettingsUpdater } from "../../../../types"
import { Tabs } from "../../../../shared/Tabs/Tabs"

export const BLANK_TEMPLATE = "__blank__"
/** Onglet de réglage des anniversaires et décès : pas un modèle, il ne touche pas aux réglages du calendrier. */
const BIRTHDAYS_TAB = "__birthdays__"

interface TemplateTabsProps {
  settings: CalendarSettings
  onUpdate: SettingsUpdater
  /** Modèle appliqué aux réglages (Calendrier vierge ou un preset). */
  activeTemplate: string
  onSelectTemplate: (template: string) => void
  /** Vrai quand l'onglet Anniversaires est ouvert à la place du modèle. */
  showBirthdays: boolean
  onShowBirthdaysChange: (show: boolean) => void
}

export function TemplateTabs({
  settings,
  onUpdate,
  activeTemplate,
  onSelectTemplate,
  showBirthdays,
  onShowBirthdaysChange,
}: TemplateTabsProps) {
  function selectBlank() {
    onSelectTemplate(BLANK_TEMPLATE)
    onUpdate("events", [])
    onUpdate("includeBirthdays", false)
    onUpdate("includeDeaths", false)
    onUpdate("includeOtherEvents", false)
    onUpdate("includeSchedules", false)
  }

  function selectPreset(name: string) {
    const preset = PRESETS.find(p => p.name === name)
    if (!preset) return
    onSelectTemplate(name)
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
    if (id === BIRTHDAYS_TAB) {
      onShowBirthdaysChange(true)
      return
    }
    onShowBirthdaysChange(false)
    // Retour au modèle quitté pour les anniversaires : ses réglages en cours sont gardés.
    if (id === activeTemplate) return
    if (id === BLANK_TEMPLATE) selectBlank()
    else selectPreset(id)
  }

  return (
    <Tabs
      tabs={[
        { id: BLANK_TEMPLATE, label: "Calendrier vierge" },
        ...PRESETS.map(preset => ({ id: preset.name, label: preset.name })),
        { id: BIRTHDAYS_TAB, label: "Anniversaires" },
      ]}
      active={showBirthdays ? BIRTHDAYS_TAB : activeTemplate}
      onSelect={select}
      ariaLabel="Modèle de calendrier"
    />
  )
}
