import { useRef } from "react"
import type { CalendarSettings, SettingsUpdater } from "../../types"
import "./IllustrationSection.css"

interface IllustrationSectionProps {
  settings: CalendarSettings
  onUpdate: SettingsUpdater
}

export function IllustrationSection({ settings, onUpdate }: IllustrationSectionProps) {
  const illustrationInputRef = useRef<HTMLInputElement>(null)

  function onIllustrationChange(file: File | undefined) {
    if (!file) {
      onUpdate("illustration", null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => onUpdate("illustration", reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <section className="card card--candy">
      <h2>Image de fond</h2>
      <div className="illustration-section">
        <label className="file-btn">
          Importer (JPEG ou PNG)
          <input
            ref={illustrationInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={e => onIllustrationChange(e.target.files?.[0])}
          />
        </label>
        {settings.illustration && (
          <div className="illustration-preview-wrap">
            <img className="illustration-preview" src={settings.illustration} alt="Aperçu de l'illustration" />
            <button
              type="button"
              className="btn-remove"
              onClick={() => {
                if (illustrationInputRef.current) illustrationInputRef.current.value = ""
                onIllustrationChange(undefined)
              }}
            >
              Retirer l'image
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
