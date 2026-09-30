import type { EpisodeRef, Series } from "../../../../series/types"
import "./EpisodeCorrection.css"

interface EpisodeCorrectionProps {
  series: Series
  disabled: boolean
  /** Nouveau dernier épisode vu ; null = série pas commencée. */
  onChange: (lastWatched: EpisodeRef | null) => void
}

const NOT_STARTED = "none"

// Choix direct du dernier épisode vu, pour corriger une erreur de plus d'un épisode.
export function EpisodeCorrection({
  series,
  disabled,
  onChange,
}: EpisodeCorrectionProps) {
  const { seasons, lastWatched } = series
  const seasonEpisodeCount =
    lastWatched === null
      ? 0
      : (seasons[lastWatched.season - 1]?.episodeCount ?? 0)

  function changeSeason(value: string) {
    // Changer de saison repart de son 1er épisode.
    onChange(
      value === NOT_STARTED ? null : { season: Number(value), episode: 1 },
    )
  }

  function changeEpisode(value: string) {
    if (lastWatched === null) return
    onChange({ season: lastWatched.season, episode: Number(value) })
  }

  return (
    <details className="episode-correction">
      <summary>Modifier l'épisode vu</summary>
      <div className="row">
        <label>
          Saison
          <select
            value={lastWatched === null ? NOT_STARTED : lastWatched.season}
            disabled={disabled}
            onChange={e => changeSeason(e.target.value)}
          >
            <option value={NOT_STARTED}>Pas commencée</option>
            {seasons.map((_, i) => (
              <option key={i} value={i + 1}>
                Saison {i + 1}
              </option>
            ))}
          </select>
        </label>
        {lastWatched !== null && (
          <label>
            Dernier épisode vu
            <select
              value={lastWatched.episode}
              disabled={disabled}
              onChange={e => changeEpisode(e.target.value)}
            >
              {Array.from({ length: seasonEpisodeCount }, (_, i) => (
                <option key={i} value={i + 1}>
                  Épisode {i + 1}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </details>
  )
}
