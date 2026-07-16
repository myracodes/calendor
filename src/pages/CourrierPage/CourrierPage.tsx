import { pdf } from "@react-pdf/renderer"
import { useState } from "react"
import type { CourrierSettings } from "../../courrier/types"
import { CourrierDocument } from "../../pdf/CourrierDocument"
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
    date: todayIso(),
    objet: "",
    corps: "",
  }
}

export function CourrierPage() {
  const [settings, setSettings] = useState<CourrierSettings>(buildInitialSettings)
  const [generating, setGenerating] = useState(false)

  function update<K extends keyof CourrierSettings>(key: K, value: CourrierSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function generatePdf() {
    setGenerating(true)
    try {
      const blob = await pdf(<CourrierDocument settings={settings} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      const slug = settings.objet.trim().toLowerCase().replace(/\s+/g, "-")
      link.href = url
      link.download = slug === "" ? "courrier.pdf" : `courrier-${slug}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <p className="tagline">Mon générateur de courriers</p>

      <section className="card card--sun">
        <h2>Expéditrice</h2>
        <label className="courrier-field">
          Coordonnées (une information par ligne)
          <textarea
            value={settings.expediteur}
            placeholder={"Myriam\n221 B Baker Street\nLondon\nemail@gmail.com\n07 07 07 07 07"}
            onChange={e => update("expediteur", e.target.value)}
          />
        </label>
      </section>

      <section className="card card--candy">
        <h2>Destinataire</h2>
        <label className="courrier-field">
          Coordonnées (une information par ligne)
          <textarea
            value={settings.destinataire}
            placeholder={"Service client\n10 avenue des Réclamations\n75008 Paris"}
            onChange={e => update("destinataire", e.target.value)}
          />
        </label>
      </section>

      <section className="card card--sky">
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
          <label>
            Date (optionnelle)
            <input type="date" value={settings.date} onChange={e => update("date", e.target.value)} />
          </label>
        </div>
        <label className="courrier-field courrier-objet">
          Objet (optionnel, ne pas ajouter le préfixe "Objet :", déjà inclus dans le PDF)
          <input
            type="text"
            value={settings.objet}
            placeholder="Relance pour un remboursement"
            onChange={e => update("objet", e.target.value)}
          />
        </label>
      </section>

      <section className="card">
        <h2>Corps du courrier</h2>
        <label className="courrier-field">
          Texte du courrier
          <textarea
            className="courrier-corps"
            value={settings.corps}
            placeholder={"Madame, Monsieur,\n\nJe me permets de vous relancer au sujet de…\n\nCordialement"}
            onChange={e => update("corps", e.target.value)}
          />
        </label>
        {settings.corps.trim() === "" && <p className="hint">Rédige le corps du courrier pour générer le PDF.</p>}
      </section>

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
