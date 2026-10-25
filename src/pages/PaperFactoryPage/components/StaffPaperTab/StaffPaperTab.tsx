import { useState } from "react"
import {
  downloadPdf,
  PDF_ERROR_MESSAGE,
} from "../../../../pdf/shared/downloadPdf"
import { StaffPaperDocument } from "../../../../pdf/staffPaper/StaffPaperDocument"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import { Card } from "../../../../shared/Card/Card"
import { useToast } from "../../../../shared/Toast/useToast"
import { usePersistentState } from "../../../../shared/usePersistentState"
import { STAFF_KINDS } from "../../../../staffPaper/staffKinds"
import type {
  StaffKind,
  StaffPaperSettings,
} from "../../../../staffPaper/types"

const DEFAULT_SETTINGS: StaffPaperSettings = {
  kind: "standard",
}

const KIND_FILE_NAMES: Record<StaffKind, string> = {
  standard: "papier-a-musique.pdf",
  guitarTab: "tablature-guitare.pdf",
  ukuleleTab: "tablature-ukulele.pdf",
}

export function StaffPaperTab() {
  const [persistedSettings, setPersistedSettings] =
    usePersistentState<StaffPaperSettings>(
      "staffPaper.settings",
      DEFAULT_SETTINGS,
    )
  const [generating, setGenerating] = useState(false)
  const { toast, showToast } = useToast()

  // Les valeurs par défaut complètent une sauvegarde antérieure à l'ajout
  // d'un nouveau réglage.
  const settings: StaffPaperSettings = {
    ...DEFAULT_SETTINGS,
    ...persistedSettings,
  }

  function update<K extends keyof StaffPaperSettings>(
    key: K,
    value: StaffPaperSettings[K],
  ) {
    setPersistedSettings({ ...settings, [key]: value })
  }

  async function generatePdf() {
    setGenerating(true)
    try {
      await downloadPdf(
        <StaffPaperDocument settings={settings} />,
        KIND_FILE_NAMES[settings.kind],
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
      <Card variantColor="sky">
        <h2>Page</h2>
        <div className="row">
          <label>
            Type
            <select
              value={settings.kind}
              onChange={e => update("kind", e.target.value as StaffKind)}
            >
              {Object.entries(STAFF_KINDS).map(([kind, spec]) => (
                <option key={kind} value={kind}>
                  {spec.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <ActionButton busy={generating} onClick={generatePdf}>
        {generating ? "Génération…" : "Générer le PDF"}
      </ActionButton>
      {toast}
    </>
  )
}
