import { useState } from "react"
import { pdfFileName } from "../../calendar/languages"
import { useLifeEvents } from "../../lifeEvents/useLifeEvents"
import { CalendarDocument } from "../../pdf/calendar/CalendarDocument"
import { downloadPdf, PDF_ERROR_MESSAGE } from "../../pdf/shared/downloadPdf"
import { PRESETS } from "../../presets"
import { ActionButton } from "../../shared/ActionButton/ActionButton"
import { Alert } from "../../shared/Alert/Alert"
import { IllustrationSection } from "../../shared/IllustrationSection/IllustrationSection"
import { useToast } from "../../shared/Toast/useToast"
import type { CalendarSettings } from "../../types"
import { BirthdaysTab } from "./components/BirthdaysTab/BirthdaysTab"
import { ParametrageSection } from "./components/ParametrageSection/ParametrageSection"
import { PeriodSection } from "./components/PeriodSection/PeriodSection"
import {
  BLANK_TEMPLATE,
  TemplateTabs,
} from "./components/TemplateTabs/TemplateTabs"

const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth() + 1

function buildInitialSettings(): CalendarSettings {
  return {
    format: "monthly",
    language: "fr",
    year: CURRENT_YEAR,
    startMonth: CURRENT_MONTH,
    monthCount: 12,
    weekCount: 1,
    illustration: null,
    showBackground: true,
    includeBirthdays: false,
    includeDeaths: false,
    includeOtherEvents: false,
    includeSchedules: false,
    events: [],
  }
}

export function CalendarsPage() {
  const [settings, setSettings] =
    useState<CalendarSettings>(buildInitialSettings)
  const [generating, setGenerating] = useState(false)
  const { toast, showToast } = useToast()
  const [activeTemplate, setActiveTemplate] = useState<string>(BLANK_TEMPLATE)
  const [showBirthdays, setShowBirthdays] = useState(false)
  // Chargés pour les deux onglets : réglés dans Anniversaires, imprimés sur le PDF.
  const lifeEvents = useLifeEvents()
  const activePreset = PRESETS.find(preset => preset.name === activeTemplate)
  const lockToMonthly = activePreset?.requiresMonthly ?? false
  const hideEventsCheckboxes = activePreset?.hideEventsCheckboxes ?? false
  // le format hebdomadaire (grille pointillée vierge) n'a de sens que pour "Calendrier vierge"
  const allowWeekly = activeTemplate === BLANK_TEMPLATE

  function update<K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K],
  ) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function generatePdf() {
    setGenerating(true)
    try {
      await downloadPdf(
        <CalendarDocument
          settings={settings}
          lifeEvents={lifeEvents.entries}
        />,
        pdfFileName(settings.language, settings.format, settings.year),
      )
    } catch (error) {
      console.error(error)
      showToast("error", PDF_ERROR_MESSAGE)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <TemplateTabs
        settings={settings}
        onUpdate={update}
        activeTemplate={activeTemplate}
        onSelectTemplate={setActiveTemplate}
        showBirthdays={showBirthdays}
        onShowBirthdaysChange={setShowBirthdays}
      />

      {/* Sous la barre d'onglets : sans eux, le PDF sortirait sans anniversaires ni décès. */}
      {lifeEvents.loadError !== null && (
        <Alert
          variantColor="danger"
          title="Impossible de charger les anniversaires"
        >
          {lifeEvents.loadError}
        </Alert>
      )}

      {/* Onglets masqués plutôt que démontés : les réglages du calendrier et
          la saisie en cours d'un anniversaire survivent au passage de l'un à l'autre. */}
      <div hidden={showBirthdays}>
        <PeriodSection
          settings={settings}
          onUpdate={update}
          lockToMonthly={lockToMonthly}
          allowWeekly={allowWeekly}
        />
        <IllustrationSection
          illustration={settings.illustration}
          onUpdate={value => update("illustration", value)}
          showBackground={settings.showBackground}
          onShowBackgroundChange={value => update("showBackground", value)}
        />
        <ParametrageSection
          settings={settings}
          onUpdate={update}
          hideEventsCheckboxes={hideEventsCheckboxes}
        />

        {/* Attend les anniversaires pour ne pas générer un PDF sans eux. */}
        <ActionButton
          busy={generating || lifeEvents.loading}
          onClick={generatePdf}
        >
          {generating ? "Génération…" : "Générer le PDF"}
        </ActionButton>
      </div>
      <div hidden={!showBirthdays}>
        <BirthdaysTab library={lifeEvents} showToast={showToast} />
      </div>
      {toast}
    </>
  )
}
