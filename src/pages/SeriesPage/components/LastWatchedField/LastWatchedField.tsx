import type { EpisodeRef, Season } from "../../../../series/types"

interface LastWatchedFieldProps {
  seasons: Season[]
  lastWatched: EpisodeRef | null
  /** Nouveau dernier épisode vu ; null = série pas commencée. */
  onChange: (lastWatched: EpisodeRef | null) => void
}

const NOT_STARTED = "none"

// Choix direct du dernier épisode vu, pour corriger une erreur de plus d'un
// épisode ou reprendre une série déjà commencée ailleurs.
export function LastWatchedField({
  seasons,
  lastWatched,
  onChange,
}: LastWatchedFieldProps) {
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
    <div className="row">
      <label>
        Dernier vu — saison
        <select
          value={lastWatched === null ? NOT_STARTED : lastWatched.season}
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
          Épisode
          <select
            value={lastWatched.episode}
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
  )
}
