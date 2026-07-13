import { pdf } from "@react-pdf/renderer"
import { useState } from "react"
import type { BujoColumn, BujoSettings, DottedWidth } from "../../bujo/types"
import { IllustrationSection } from "../../components/IllustrationSection/IllustrationSection"
import { BujoDocument } from "../../pdf/BujoDocument"
import "./BujoFactoryPage.css"

const WIDTH_OPTIONS: { value: DottedWidth; label: string }[] = [
  { value: "small", label: "Petit (une lettre)" },
  { value: "medium", label: "Moyen (quelques mots)" },
  { value: "large", label: "Grand (le reste de la page)" },
]

function makeColumn(): BujoColumn {
  return { id: crypto.randomUUID(), label: "", kind: "dotted", width: "medium" }
}

function buildInitialSettings(): BujoSettings {
  return {
    title: "",
    orientation: "portrait",
    pageCount: 1,
    illustration: null,
    // Exemple de départ : un suivi de tâches, à adapter librement.
    columns: [
      { id: crypto.randomUUID(), label: "Date", kind: "dotted", width: "medium" },
      { id: crypto.randomUUID(), label: "Tâche", kind: "dotted", width: "large" },
      { id: crypto.randomUUID(), label: "Fait", kind: "checkbox", width: "medium" },
    ],
  }
}

export function BujoFactoryPage() {
  const [settings, setSettings] = useState<BujoSettings>(buildInitialSettings)
  const [generating, setGenerating] = useState(false)

  function update<K extends keyof BujoSettings>(key: K, value: BujoSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  function updateColumn(id: string, patch: Partial<Omit<BujoColumn, "id">>) {
    setSettings(prev => ({
      ...prev,
      columns: prev.columns.map(column => (column.id === id ? { ...column, ...patch } : column)),
    }))
  }

  function addColumn() {
    setSettings(prev => ({ ...prev, columns: [...prev.columns, makeColumn()] }))
  }

  function removeColumn(id: string) {
    setSettings(prev => ({ ...prev, columns: prev.columns.filter(column => column.id !== id) }))
  }

  async function generatePdf() {
    setGenerating(true)
    try {
      const blob = await pdf(<BujoDocument settings={settings} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      const slug = settings.title.trim().toLowerCase().replace(/\s+/g, "-")
      link.href = url
      link.download = slug === "" ? "bujo.pdf" : `bujo-${slug}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <p className="tagline">Ma fabrique de pages façon bullet journal</p>

      <section className="card card--sun">
        <h2>Page</h2>
        <div className="row">
          <label>
            Titre de la page
            <input
              type="text"
              value={settings.title}
              placeholder="Suivi des habitudes"
              onChange={e => update("title", e.target.value)}
            />
          </label>
          <label>
            Orientation
            <select
              value={settings.orientation}
              onChange={e => update("orientation", e.target.value as BujoSettings["orientation"])}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Paysage</option>
            </select>
          </label>
          <label>
            Nombre de pages
            <input
              type="number"
              min={1}
              max={50}
              value={settings.pageCount}
              onChange={e => update("pageCount", Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            />
          </label>
        </div>
      </section>

      <section className="card card--candy">
        <h2>Colonnes</h2>
        <ul className="bujo-column-list">
          {settings.columns.map(column => (
            <li key={column.id} className="bujo-column">
              <label className="bujo-column-label">
                Intitulé
                <input
                  type="text"
                  value={column.label}
                  onChange={e => updateColumn(column.id, { label: e.target.value })}
                />
              </label>
              <label>
                Contenu
                <select
                  value={column.kind}
                  onChange={e => updateColumn(column.id, { kind: e.target.value as BujoColumn["kind"] })}
                >
                  <option value="dotted">Pointillés</option>
                  <option value="checkbox">Case à cocher</option>
                </select>
              </label>
              {column.kind === "dotted" && (
                <label>
                  Largeur
                  <select
                    value={column.width}
                    onChange={e => updateColumn(column.id, { width: e.target.value as DottedWidth })}
                  >
                    {WIDTH_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button type="button" className="btn-remove" onClick={() => removeColumn(column.id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={addColumn}>
          Ajouter une colonne
        </button>
        {settings.columns.length === 0 && <p className="hint">Ajoute au moins une colonne pour générer la page.</p>}
      </section>

      <IllustrationSection illustration={settings.illustration} onUpdate={value => update("illustration", value)} />

      <button
        type="button"
        className="generate"
        disabled={generating || settings.columns.length === 0}
        onClick={generatePdf}
      >
        {generating ? "Génération…" : "Générer le PDF"}
      </button>
    </>
  )
}
