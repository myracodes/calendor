import { useState } from "react"
import type { Series, SeriesDraft } from "../../../../series/types"
import { useSeries } from "../../../../series/useSeries"
import { Alert } from "../../../../shared/Alert/Alert"
import { SeriesEditor } from "../SeriesEditor/SeriesEditor"
import { SeriesPicker } from "../SeriesPicker/SeriesPicker"

function toDraft(series: Series): SeriesDraft {
  return { id: series.id, name: series.name, seasons: series.seasons }
}

// Onglet de paramétrage : choisir, créer et modifier les séries et leurs saisons.
export function SettingsTab() {
  const { series, loading, loadError, save, remove } = useSeries()
  const [search, setSearch] = useState("")
  const [draft, setDraft] = useState<SeriesDraft | null>(null)

  // Protège les modifications en cours avant d'ouvrir une autre série.
  function canLeaveDraft(): boolean {
    return (
      !hasUnsavedChanges() ||
      window.confirm("Abandonner les modifications en cours ?")
    )
  }

  function hasUnsavedChanges(): boolean {
    if (draft === null) return false
    const saved = series.find(item => item.id === draft.id)
    // Nouvelle série : rien de précieux tant qu'aucune saison n'est saisie.
    if (saved === undefined) return draft.seasons.length > 0
    return JSON.stringify(draft) !== JSON.stringify(toDraft(saved))
  }

  function select(item: Series) {
    if (item.id === draft?.id || !canLeaveDraft()) return
    setDraft(toDraft(item))
  }

  function create() {
    if (!canLeaveDraft()) return
    // La recherche sert de nom de départ : on crée souvent ce qu'on n'a pas trouvé.
    setDraft({ id: null, name: search.trim(), seasons: [] })
  }

  async function saveDraft() {
    if (draft === null) return
    setDraft(toDraft(await save(draft)))
  }

  async function removeDraft() {
    if (draft === null || draft.id === null) return
    await remove(draft.id)
    setDraft(null)
  }

  if (loading) return <p className="hint">Chargement des séries…</p>
  if (loadError !== null) {
    return (
      <Alert variantColor="danger" title="Impossible de charger les séries">
        {loadError}
      </Alert>
    )
  }

  return (
    <>
      <SeriesPicker
        series={series}
        selectedId={draft?.id ?? null}
        search={search}
        onSearchChange={setSearch}
        onSelect={select}
        onCreate={create}
      />
      {draft !== null && (
        <SeriesEditor
          draft={draft}
          onChange={setDraft}
          onSave={saveDraft}
          onDelete={removeDraft}
          onCancel={() => setDraft(null)}
        />
      )}
    </>
  )
}
