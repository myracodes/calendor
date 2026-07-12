import { pdf } from "@react-pdf/renderer"
import { useState } from "react"
import { IllustrationSection } from "../../components/IllustrationSection/IllustrationSection"
import { ParametrageSection } from "../../components/ParametrageSection/ParametrageSection"
import { PeriodSection } from "../../components/PeriodSection/PeriodSection"
import { TemplateTabs } from "../../components/TemplateTabs/TemplateTabs"
import { CalendarDocument } from "../../pdf/CalendarDocument"
import type { CalendarSettings } from "../../types"

const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth() + 1

function buildInitialSettings(): CalendarSettings {
  return {
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

      <TemplateTabs settings={settings} onUpdate={update} />

      <PeriodSection settings={settings} onUpdate={update} />
      <IllustrationSection settings={settings} onUpdate={update} />
      <ParametrageSection settings={settings} onUpdate={update} />

      <button type="button" className="generate" disabled={generating} onClick={generatePdf}>
        {generating ? "Génération…" : "Générer le PDF"}
      </button>
    </>
  )
}
