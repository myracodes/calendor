import { Fragment, useState } from "react"
import { formatEpisode } from "../../../../series/format"
import { nextEpisode } from "../../../../series/progress"
import { filterSeries } from "../../../../series/search"
import { groupSeriesByStatus } from "../../../../series/status"
import type { EpisodeRef, Series, SeriesDraft } from "../../../../series/types"
import { useSeries } from "../../../../series/useSeries"
import { Accordion } from "../../../../shared/Accordion/Accordion"
import { Alert } from "../../../../shared/Alert/Alert"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import { Card } from "../../../../shared/Card/Card"
import { useToast } from "../../../../shared/Toast/useToast"
import { SeriesEditor } from "../SeriesEditor/SeriesEditor"
import { SeriesItem } from "../SeriesItem/SeriesItem"
import "./SeriesList.css"

function toDraft(series: Series): SeriesDraft {
  return {
    id: series.id,
    name: series.name,
    seasons: series.seasons,
    lastWatched: series.lastWatched,
    finished: series.finished,
  }
}

function describeLastWatched(lastWatched: EpisodeRef | null): string {
  return lastWatched === null
    ? "pas commencée"
    : `dernier vu ${formatEpisode(lastWatched)}`
}

// Où j'en suis de chaque série, marquer l'épisode suivant, et créer ou modifier une série.
export function SeriesList() {
  const {
    series,
    loading,
    loadError,
    save,
    remove,
    markNextWatched,
    setLastWatched,
  } = useSeries()
  const [search, setSearch] = useState("")
  // Série dont la progression est en cours d'enregistrement, pour ne désactiver que ses boutons.
  const [pendingId, setPendingId] = useState<string | null>(null)
  // Série ouverte dans l'éditeur (une seule à la fois) ; id null = création.
  const [draft, setDraft] = useState<SeriesDraft | null>(null)
  const { toast, showToast } = useToast()
  const matches = filterSeries(series, search)
  const isSearching = search.trim() !== ""
  const noMatch = isSearching && matches.length === 0
  const statusGroups = groupSeriesByStatus(matches)

  function showSaveError(caught: unknown) {
    showToast(
      "error",
      `Modification non enregistrée : ${(caught as Error).message}`,
    )
  }

  // Enregistre la progression d'une série ; l'erreur éventuelle part en toast.
  async function saveProgress(item: Series, action: () => Promise<void>) {
    setPendingId(item.id)
    try {
      await action()
    } catch (caught) {
      showSaveError(caught)
    } finally {
      setPendingId(null)
    }
  }

  async function undoMarkNext(item: Series) {
    // item = la série avant le clic : on remet son dernier vu d'alors.
    await saveProgress(item, () => setLastWatched(item, item.lastWatched))
    showToast(
      "info",
      `« ${item.name} » : retour à ${describeLastWatched(item.lastWatched)}.`,
    )
  }

  async function markNext(item: Series) {
    const next = nextEpisode(item)
    if (next === null) return
    setPendingId(item.id)
    try {
      await markNextWatched(item)
    } catch (caught) {
      showSaveError(caught)
      return
    } finally {
      setPendingId(null)
    }
    const caughtUp = nextEpisode({ ...item, lastWatched: next }) === null
    showToast(
      "success",
      `« ${item.name} » : ${formatEpisode(next)} vu${caughtUp ? " — à jour !" : "."}`,
      { label: "Annuler", onClick: () => undoMarkNext(item) },
    )
  }

  // Rejette en cas d'échec, pour que le formulaire de saison reste ouvert.
  async function addSeason(item: Series, episodeCount: number) {
    try {
      await save({
        ...toDraft(item),
        seasons: [...item.seasons, { episodeCount }],
      })
    } catch (caught) {
      showSaveError(caught)
      throw caught
    }
    showToast(
      "success",
      `Saison ${item.seasons.length + 1} ajoutée à « ${item.name} ».`,
    )
  }

  function hasUnsavedChanges(): boolean {
    if (draft === null) return false
    const saved = series.find(item => item.id === draft.id)
    // Nouvelle série : rien de précieux tant qu'aucune saison n'est saisie.
    if (saved === undefined) return draft.seasons.length > 0
    return JSON.stringify(draft) !== JSON.stringify(toDraft(saved))
  }

  // Protège les modifications en cours avant de fermer l'éditeur ou d'en ouvrir un autre.
  function canLeaveDraft(): boolean {
    return (
      !hasUnsavedChanges() ||
      window.confirm("Abandonner les modifications en cours ?")
    )
  }

  function edit(item: Series) {
    if (item.id === draft?.id || !canLeaveDraft()) return
    setDraft(toDraft(item))
  }

  function create() {
    if (!canLeaveDraft()) return
    // La recherche sert de nom de départ : on crée souvent ce qu'on n'a pas trouvé.
    setDraft({
      id: null,
      name: search.trim(),
      seasons: [],
      lastWatched: null,
      finished: false,
    })
  }

  function cancelDraft() {
    if (canLeaveDraft()) setDraft(null)
  }

  async function saveDraft() {
    if (draft === null) return
    const saved = await save(draft)
    setDraft(null)
    showToast(
      "success",
      draft.id === null
        ? `« ${saved.name} » ajoutée à tes séries.`
        : `« ${saved.name} » enregistrée.`,
    )
  }

  async function removeDraft() {
    if (draft === null || draft.id === null) return
    await remove(draft.id)
    showToast("success", `« ${draft.name} » supprimée.`)
    setDraft(null)
  }

  function renderEditor(current: SeriesDraft) {
    return (
      <SeriesEditor
        draft={current}
        onChange={setDraft}
        onSave={saveDraft}
        onDelete={removeDraft}
        onCancel={cancelDraft}
      />
    )
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
    <Card variantColor="sky">
      <h2>Mes séries</h2>

      <label>
        Rechercher une série
        <input
          type="search"
          value={search}
          placeholder="Solo Leveling…"
          onChange={e => setSearch(e.target.value)}
        />
      </label>

      {draft !== null && draft.id === null ? (
        renderEditor(draft)
      ) : (
        <ActionButton onClick={create}>
          {noMatch ? `Créer « ${search.trim()} »` : "Créer une série"}
        </ActionButton>
      )}

      {noMatch ? (
        <p className="hint">Aucune série ne correspond à « {search} ».</p>
      ) : series.length === 0 ? (
        <p className="hint">Aucune série pour l'instant : crée la première.</p>
      ) : (
        <div className="series-list-groups">
          {statusGroups.map((group, index) => (
            // Pendant une recherche, tout est ouvert ; la clé remonte l'accordéon quand ça change.
            <Fragment key={`${group.status}-${isSearching}`}>
              {index > 0 && <hr />}
              <Accordion
                title={`${group.label} (${group.series.length})`}
                // Hors recherche, seul le 1er groupe s'ouvre : « En cours » s'il y en a.
                defaultOpen={isSearching || index === 0}
              >
                <ul className="series-list">
                  {group.series.map(item => (
                    <li key={item.id} className="series-list-entry">
                      {draft !== null && draft.id === item.id ? (
                        renderEditor(draft)
                      ) : (
                        <SeriesItem
                          series={item}
                          pending={pendingId === item.id}
                          onMarkNext={() => markNext(item)}
                          onAddSeason={episodeCount =>
                            addSeason(item, episodeCount)
                          }
                          onEdit={() => edit(item)}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </Accordion>
            </Fragment>
          ))}
        </div>
      )}
      {toast}
    </Card>
  )
}
