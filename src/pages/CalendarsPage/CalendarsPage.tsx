import { pdf } from "@react-pdf/renderer"
import { useState } from "react"
import { IllustrationSection } from "../../components/IllustrationSection/IllustrationSection"
import { ParametrageSection } from "../../components/ParametrageSection/ParametrageSection"
import { PeriodSection } from "../../components/PeriodSection/PeriodSection"
import { BLANK_TEMPLATE, TemplateTabs } from "../../components/TemplateTabs/TemplateTabs"
import { CalendarDocument } from "../../pdf/CalendarDocument"
import { PRESETS } from "../../presets"
import type { CalendarSettings } from "../../types"

const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth() + 1

function buildInitialSettings(): CalendarSettings {
  return {
    format: "monthly",
    year: CURRENT_YEAR,
    startMonth: CURRENT_MONTH,
    monthCount: 12,
    illustration: null,
    includeBirthdays: false,
    includeDeaths: false,
    includeOtherEvents: false,
    includeSchedules: false,
    events: [],
  }
}

export function CalendarsPage() {
  const [settings, setSettings] = useState<CalendarSettings>(buildInitialSettings)
  const [generating, setGenerating] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState<string>(BLANK_TEMPLATE)
  const activePreset = PRESETS.find(preset => preset.name === activeTemplate)
  const lockToMonthly = activePreset?.requiresMonthly ?? false
  const hideEventsCheckboxes = activePreset?.hideEventsCheckboxes ?? false

  function update<K extends keyof CalendarSettings>(key: K, value: CalendarSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function generatePdf() {
    setGenerating(true)
    try {
      const blob = await pdf(<CalendarDocument settings={settings} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `calendrier-${settings.year}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <p className="tagline">Mon générateur de calendriers personnalisés</p>

      <TemplateTabs settings={settings} onUpdate={update} active={activeTemplate} onSelectActive={setActiveTemplate} />

      <PeriodSection settings={settings} onUpdate={update} lockToMonthly={lockToMonthly} />
      <IllustrationSection settings={settings} onUpdate={update} />
      <ParametrageSection settings={settings} onUpdate={update} hideEventsCheckboxes={hideEventsCheckboxes} />

      <button type="button" className="generate" disabled={generating} onClick={generatePdf}>
        {generating ? "Génération…" : "Générer le PDF"}
      </button>
    </>
  )
}
