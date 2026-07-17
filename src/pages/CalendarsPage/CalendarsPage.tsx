import { useState } from "react"
import { CalendarDocument } from "../../pdf/CalendarDocument"
import { downloadPdf } from "../../pdf/downloadPdf"
import { PRESETS } from "../../presets"
import { IllustrationSection } from "../../shared/IllustrationSection/IllustrationSection"
import type { CalendarSettings } from "../../types"
import { ParametrageSection } from "./components/ParametrageSection/ParametrageSection"
import { PeriodSection } from "./components/PeriodSection/PeriodSection"
import { BLANK_TEMPLATE, TemplateTabs } from "./components/TemplateTabs/TemplateTabs"

const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth() + 1

function buildInitialSettings(): CalendarSettings {
  return {
    format: "monthly",
    year: CURRENT_YEAR,
    startMonth: CURRENT_MONTH,
    monthCount: 12,
    weekCount: 1,
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
  // le format hebdomadaire (grille pointillée vierge) n'a de sens que pour "Calendrier vierge"
  const allowWeekly = activeTemplate === BLANK_TEMPLATE

  function update<K extends keyof CalendarSettings>(key: K, value: CalendarSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function generatePdf() {
    setGenerating(true)
    try {
      await downloadPdf(
        <CalendarDocument settings={settings} />,
        settings.format === "weekly" ? "calendrier-hebdomadaire.pdf" : `calendrier-${settings.year}.pdf`,
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <p className="tagline">Mon générateur de calendriers personnalisés</p>

      <TemplateTabs settings={settings} onUpdate={update} active={activeTemplate} onSelectActive={setActiveTemplate} />

      <PeriodSection settings={settings} onUpdate={update} lockToMonthly={lockToMonthly} allowWeekly={allowWeekly} />
      <IllustrationSection illustration={settings.illustration} onUpdate={value => update("illustration", value)} />
      <ParametrageSection settings={settings} onUpdate={update} hideEventsCheckboxes={hideEventsCheckboxes} />

      <button type="button" className="generate" disabled={generating} onClick={generatePdf}>
        {generating ? "Génération…" : "Générer le PDF"}
      </button>
    </>
  )
}
