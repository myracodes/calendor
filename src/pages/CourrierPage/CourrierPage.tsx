import { useState } from "react"
import type { CourrierSettings } from "../../courrier/types"
import { CourrierDocument } from "../../pdf/courrier/CourrierDocument"
import { downloadPdf } from "../../pdf/shared/downloadPdf"
import { Card } from "../../shared/Card/Card"
import "./CourrierPage.css"

/** Date du jour au format ISO "aaaa-mm-jj", dans le fuseau local. */
function todayIso(): string {
  const now = new Date()
  const mois = String(now.getMonth() + 1).padStart(2, "0")
  const jour = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${mois}-${jour}`
}

function buildInitialSettings(): CourrierSettings {
  return {
    expediteur: "",
    destinataire: "",
    lieu: "",
    inclureDate: true,
    date: todayIso(),
    objet: "",
    corps: "",
    margesVerticalesReduites: false,
    margesHorizontalesReduites: false,
    ecartsReduits: false,
    texteJustifie: true,
  }
}

export function CourrierPage() {
  const [settings, setSettings] =
    useState<CourrierSettings>(buildInitialSettings)
  const [generating, setGenerating] = useState(false)

  function update<K extends keyof CourrierSettings>(
    key: K,
    value: CourrierSettings[K],
  ) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function generatePdf() {
    setGenerating(true)
    try {
      const slug = settings.objet.trim().toLowerCase().replace(/\s+/g, "-")
      await downloadPdf(
        <CourrierDocument settings={settings} />,
        slug === "" ? "courrier.pdf" : `courrier-${slug}.pdf`,
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <p className="tagline">Mon générateur de courriers</p>

      <Card variantColor="sun">
        <h2>Expéditrice</h2>
        <label className="courrier-field">
          Coordonnées (une information par ligne)
          <textarea
            value={settings.expediteur}
            placeholder={
              "Myriam\n221 B Baker Street\nLondon\nemail@gmail.com\n07 07 07 07 07"
            }
            onChange={e => update("expediteur", e.target.value)}
          />
        </label>

        <h2>Destinataire</h2>
        <label className="courrier-field">
          Coordonnées (une information par ligne)
          <textarea
            value={settings.destinataire}
            placeholder={
              "Service client\n10 avenue des Réclamations\n75008 Paris"
            }
            onChange={e => update("destinataire", e.target.value)}
          />
        </label>
      </Card>

      <Card variantColor="sky">
        <h2>En-tête</h2>
        <div className="row">
          <label>
            Lieu (optionnel)
            <input
              type="text"
              value={settings.lieu}
              placeholder="Paris"
              onChange={e => update("lieu", e.target.value)}
            />
          </label>
        </div>
        <div className="row row-centered">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.inclureDate}
              onChange={e => update("inclureDate", e.target.checked)}
            />
            Ajouter la date
          </label>
          {/* Pas de libellé visible : c'est la case "Inclure la date" qui l'annonce. */}
          {settings.inclureDate && (
            <input
              type="date"
              aria-label="Date du courrier"
              value={settings.date}
              onChange={e => update("date", e.target.value)}
            />
          )}
        </div>
        <label className="courrier-field courrier-objet">
          Objet (optionnel, ne pas ajouter le préfixe "Objet :", déjà inclus
          dans le PDF)
          <input
            type="text"
            value={settings.objet}
            placeholder="Relance pour un remboursement"
            onChange={e => update("objet", e.target.value)}
          />
        </label>
      </Card>

      <Card>
        <h2>Corps du courrier</h2>
        <label className="courrier-field">
          Texte du courrier
          <textarea
            className="courrier-corps"
            value={settings.corps}
            placeholder={
              "Madame, Monsieur,\n\nJe me permets de vous relancer au sujet de…\n\nCordialement"
            }
            onChange={e => update("corps", e.target.value)}
          />
        </label>
        {settings.corps.trim() === "" && (
          <p className="hint">
            Rédige le corps du courrier pour générer le PDF.
          </p>
        )}
      </Card>

      <Card variantColor="sky">
        <h2>Mise en page</h2>
        <div className="row">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.margesVerticalesReduites}
              onChange={e =>
                update("margesVerticalesReduites", e.target.checked)
              }
            />
            Réduire les marges verticales
          </label>
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.margesHorizontalesReduites}
              onChange={e =>
                update("margesHorizontalesReduites", e.target.checked)
              }
            />
            Réduire les marges horizontales
          </label>
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.ecartsReduits}
              onChange={e => update("ecartsReduits", e.target.checked)}
            />
            Réduire les écarts
          </label>
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.texteJustifie}
              onChange={e => update("texteJustifie", e.target.checked)}
            />
            Justifier le texte
          </label>
        </div>
      </Card>

      <button
        type="button"
        className="generate"
        disabled={generating || settings.corps.trim() === ""}
        onClick={generatePdf}
      >
        {generating ? "Génération…" : "Générer le PDF"}
      </button>
    </>
  )
}
