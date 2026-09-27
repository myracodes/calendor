import { describeSeasons } from "../../../../series/format"
import { filterSeries } from "../../../../series/search"
import type { Series } from "../../../../series/types"
import { ActionButton } from "../../../../shared/ActionButton/ActionButton"
import { Card } from "../../../../shared/Card/Card"
import "./SeriesPicker.css"

interface SeriesPickerProps {
  series: Series[]
  selectedId: string | null
  search: string
  onSearchChange: (search: string) => void
  onSelect: (series: Series) => void
  onCreate: () => void
}

/** Choix de la série à paramétrer : recherche, liste des séries et création. */
export function SeriesPicker({
  series,
  selectedId,
  search,
  onSearchChange,
  onSelect,
  onCreate,
}: SeriesPickerProps) {
  const matches = filterSeries(series, search)

  return (
    <Card variantColor="candy">
      <h2>Mes séries</h2>

      <label>
        Rechercher une série
        <input
          type="search"
          value={search}
          placeholder="Solo Leveling…"
          onChange={e => onSearchChange(e.target.value)}
        />
      </label>

      {series.length === 0 ? (
        <p className="hint">Aucune série pour l'instant : crée la première.</p>
      ) : matches.length === 0 ? (
        <p className="hint">Aucune série ne correspond à « {search} ».</p>
      ) : (
        <ul className="series-picker-list">
          {matches.map(item => (
            <li key={item.id}>
              <button
                type="button"
                className={
                  item.id === selectedId
                    ? "series-picker-option series-picker-option--selected"
                    : "series-picker-option"
                }
                aria-pressed={item.id === selectedId}
                onClick={() => onSelect(item)}
              >
                <span className="series-picker-name">{item.name}</span>
                <span className="series-picker-summary">
                  {describeSeasons(item.seasons)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <ActionButton onClick={onCreate}>Créer une série</ActionButton>
    </Card>
  )
}
