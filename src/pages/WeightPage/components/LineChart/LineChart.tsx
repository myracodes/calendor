import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useState,
} from "react"
import type { ChartPoint } from "../../../../weight/chartPoints"
import { dayNumber } from "../../../../weight/days"
import {
  formatDifference,
  formatFullDay,
  formatWithUnit,
} from "../../../../weight/format"
import { timeTicks } from "../../../../weight/timeTicks"
import { valueAxis } from "../../../../weight/valueAxis"
import { spreadEndLabels } from "./endLabels"
import { useElementWidth } from "./useElementWidth"
import "./LineChart.css"

/**
 * Couleur d'une courbe : un token du thème (voir LineChart.css), accent pour
 * une courbe seule, les autres pour plusieurs. Toujours la même pour une même
 * donnée, quelles que soient les autres courbes affichées.
 */
export type ChartTone = "accent" | "plum" | "orange" | "crimson" | "pink"

export interface ChartSeries {
  id: string
  /** Nom de la courbe : légende, nom en bout de courbe, infobulle. */
  label: string
  tone: ChartTone
  /** Les points, le plus ancien en premier (au moins un). */
  points: ChartPoint[]
  /**
   * La toute première valeur, même hors de la période affichée : l'infobulle
   * donne entre parenthèses l'écart avec elle (« -2,9 kg »). Absente = pas d'écart.
   */
  firstValue?: ChartPoint
}

const CHART_HEIGHT = 260

/** Marges autour de la zone de tracé, en px : à gauche les valeurs (« 100,5 kg »), en bas les dates. */
const MARGIN_TOP = 16
const MARGIN_BOTTOM = 28
const MARGIN_LEFT = 60

/** À droite : la moitié du dernier libellé de date, ou le nom de chaque courbe (« Hanche ») quand il y en a plusieurs. */
const MARGIN_RIGHT = 16
const MARGIN_RIGHT_WITH_END_LABELS = 64

/** Écarts minimaux entre deux graduations, en px, pour que leurs libellés ne se chevauchent pas. */
const MIN_VALUE_TICK_GAP = 36
const MIN_TIME_TICK_GAP = 72

/** Points dessinés seulement s'ils restent espacés de 10px en moyenne : au-delà (des années de pesées), la courbe seule. */
const MIN_DOT_SPACING = 10
const DOT_RADIUS = 4
const ACTIVE_DOT_RADIUS = 5

/** Ligne de base des dates sous l'axe : leur texte (0.75rem) se centre dans la marge du bas. */
const TIME_LABEL_OFFSET = 20

/** Écart entre le dernier point d'une courbe et son nom. */
const END_LABEL_GAP = 8

/** Écart vertical minimal entre deux noms de courbes : la hauteur de leur texte (0.75rem), plus un peu d'air. */
const END_LABEL_MIN_GAP = 14

interface LineChartProps {
  /** Les courbes (au moins une). */
  series: ChartSeries[]
  /**
   * Une légende, et le nom de chaque courbe à son bout. Par défaut dès deux
   * courbes ; à forcer quand le titre ne dit pas ce que montre une courbe
   * seule (« Mesures »).
   */
  showSeriesNames?: boolean
  /** Premier et dernier jours de l'axe des dates (ISO). */
  start: string
  end: string
  /** Unité des valeurs (« kg », « cm ») : graduations et infobulle. */
  unit: string
  /** Valeur tracée en pointillés sur toute la largeur (l'objectif de poids) ; null pour aucune. */
  reference?: number | null
  /** Les courbes en une phrase, pour les lecteurs d'écran. */
  description: string
}

/**
 * Courbes d'une ou plusieurs valeurs dans le temps, dessinées en SVG à la
 * largeur de la card (mesurée au montage) : grille des valeurs et des dates,
 * valeur de référence en pointillés. Au survol, ou au clavier avec les
 * flèches, un repère vertical se cale sur le jour le plus proche et une
 * infobulle donne la valeur de chaque courbe ce jour-là, et son écart avec
 * la première valeur de la courbe.
 */
export function LineChart({
  series,
  showSeriesNames = series.length > 1,
  start,
  end,
  unit,
  reference = null,
  description,
}: LineChartProps) {
  const [frameRef, width] = useElementWidth<HTMLDivElement>()
  // Jour pointé (survol, tape, flèches du clavier) ; null = pas d'infobulle.
  const [activeDay, setActiveDay] = useState<string | null>(null)

  const plotLeft = MARGIN_LEFT
  const plotRight = Math.max(
    width - (showSeriesNames ? MARGIN_RIGHT_WITH_END_LABELS : MARGIN_RIGHT),
    plotLeft + 1,
  )
  const plotTop = MARGIN_TOP
  const plotBottom = CHART_HEIGHT - MARGIN_BOTTOM
  const plotWidth = plotRight - plotLeft

  const values = series.flatMap(line => line.points.map(point => point.value))
  const axis = valueAxis(
    reference === null ? values : [...values, reference],
    Math.floor((plotBottom - plotTop) / MIN_VALUE_TICK_GAP) + 1,
  )
  const ticks = timeTicks(
    start,
    end,
    Math.max(Math.floor(plotWidth / MIN_TIME_TICK_GAP), 1),
  )

  const startDay = dayNumber(start)
  const daySpan = Math.max(dayNumber(end) - startDay, 1)
  const xOf = (day: string) =>
    plotLeft + ((dayNumber(day) - startDay) / daySpan) * plotWidth
  const yOf = (value: number) =>
    plotTop +
    ((axis.max - value) / (axis.max - axis.min)) * (plotBottom - plotTop)

  const formatValue = (value: number) => formatWithUnit(value, unit)
  const longestSeries = Math.max(...series.map(line => line.points.length))
  const showDots = longestSeries * MIN_DOT_SPACING <= plotWidth

  // Les jours où au moins une courbe a un point : ceux où le repère se cale.
  const days = [
    ...new Set(series.flatMap(line => line.points.map(point => point.day))),
  ].sort()
  // Un jour pointé avant un changement de période peut ne plus être affiché.
  const shownDay =
    activeDay !== null && days.includes(activeDay) ? activeDay : null

  const endLabels = showSeriesNames
    ? spreadEndLabels(
        series.map(line => {
          const last = line.points[line.points.length - 1]
          return {
            id: line.id,
            label: line.label,
            x: xOf(last.day) + END_LABEL_GAP,
            y: yOf(last.value),
          }
        }),
        END_LABEL_MIN_GAP,
        plotBottom,
      )
    : []

  function nearestDay(x: number): string {
    let nearest = days[0]
    for (const day of days) {
      if (Math.abs(xOf(day) - x) < Math.abs(xOf(nearest) - x)) nearest = day
    }
    return nearest
  }

  function point(e: PointerEvent<SVGRectElement>) {
    const bounds = e.currentTarget.getBoundingClientRect()
    setActiveDay(nearestDay(plotLeft + e.clientX - bounds.left))
  }

  // Au doigt, l'infobulle reste affichée après la tape : seule la souris qui
  // quitte le graphique la ferme.
  function leave(e: PointerEvent<SVGRectElement>) {
    if (e.pointerType === "mouse") setActiveDay(null)
  }

  // Flèches gauche et droite : jour précédent ou suivant (en partant du
  // dernier) ; Échap ferme l'infobulle.
  function moveWithKeyboard(e: KeyboardEvent<HTMLDivElement>) {
    const index = shownDay === null ? days.length : days.indexOf(shownDay)
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      setActiveDay(days[Math.max(index - 1, 0)])
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      setActiveDay(days[Math.min(index + 1, days.length - 1)])
    } else if (e.key === "Escape") {
      setActiveDay(null)
    }
  }

  // Exception à la règle "pas de CSS inline" (voir AGENTS.md) : seule la
  // position du repère, qui dépend du jour pointé, passe par une variable CSS
  // pour placer l'infobulle. Le cast est nécessaire, CSSProperties ne connaît
  // pas les variables CSS.
  const tooltipStyle =
    shownDay === null
      ? undefined
      : ({ "--crosshair-x": `${xOf(shownDay)}px` } as CSSProperties)

  return (
    <div className="line-chart">
      {/* Le cadre prend le focus pour parcourir les jours au clavier. */}
      <div
        ref={frameRef}
        className="line-chart-frame"
        tabIndex={0}
        onKeyDown={moveWithKeyboard}
        onBlur={() => setActiveDay(null)}
      >
        {width > 0 && (
          <svg
            className="line-chart-svg"
            width={width}
            height={CHART_HEIGHT}
            role="img"
            aria-label={description}
          >
            {axis.ticks.map(tick => (
              <g key={tick}>
                <line
                  className="line-chart-grid-line"
                  x1={plotLeft}
                  x2={plotRight}
                  y1={yOf(tick)}
                  y2={yOf(tick)}
                />
                <text
                  className="line-chart-axis-label line-chart-axis-label--value"
                  x={plotLeft - 8}
                  y={yOf(tick)}
                >
                  {formatValue(tick)}
                </text>
              </g>
            ))}

            {ticks.map(tick => (
              <g key={tick.day}>
                <line
                  className="line-chart-grid-line"
                  x1={xOf(tick.day)}
                  x2={xOf(tick.day)}
                  y1={plotTop}
                  y2={plotBottom}
                />
                <text
                  className="line-chart-axis-label line-chart-axis-label--time"
                  x={xOf(tick.day)}
                  y={plotBottom + TIME_LABEL_OFFSET}
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {reference !== null && (
              <line
                className="line-chart-reference"
                x1={plotLeft}
                x2={plotRight}
                y1={yOf(reference)}
                y2={yOf(reference)}
              />
            )}

            {shownDay !== null && (
              <line
                className="line-chart-crosshair"
                x1={xOf(shownDay)}
                x2={xOf(shownDay)}
                y1={plotTop}
                y2={plotBottom}
              />
            )}

            {series.map(line => (
              <g
                key={line.id}
                className={`line-chart-series line-chart-series--${line.tone}`}
              >
                {line.points.length > 1 && (
                  <polyline
                    className="line-chart-line"
                    points={line.points
                      .map(({ day, value }) => `${xOf(day)},${yOf(value)}`)
                      .join(" ")}
                  />
                )}
                {line.points.map(({ day, value }) =>
                  showDots || day === shownDay || line.points.length === 1 ? (
                    <circle
                      key={day}
                      className="line-chart-dot"
                      cx={xOf(day)}
                      cy={yOf(value)}
                      r={day === shownDay ? ACTIVE_DOT_RADIUS : DOT_RADIUS}
                    />
                  ) : null,
                )}
              </g>
            ))}

            {endLabels.map(label => (
              <text
                key={label.id}
                className="line-chart-end-label"
                x={label.x}
                y={label.y}
              >
                {label.label}
              </text>
            ))}

            {/* Zone de survol : toute la zone de tracé, pour viser un jour
                plutôt qu'une ligne de 2px. */}
            <rect
              className="line-chart-hit-area"
              x={plotLeft}
              y={plotTop}
              width={plotWidth}
              height={plotBottom - plotTop}
              onPointerDown={point}
              onPointerMove={point}
              onPointerLeave={leave}
            />
          </svg>
        )}

        {shownDay !== null && (
          <div
            className={`line-chart-tooltip${xOf(shownDay) > width / 2 ? " line-chart-tooltip--left" : ""}`}
            style={tooltipStyle}
          >
            <p className="line-chart-tooltip-day">{formatFullDay(shownDay)}</p>
            <ul className="line-chart-tooltip-values">
              {series.map(line => {
                const value = line.points.find(
                  linePoint => linePoint.day === shownDay,
                )?.value
                if (value === undefined) return null
                return (
                  <li key={line.id} className="line-chart-tooltip-value">
                    <span
                      className={`line-chart-key line-chart-series--${line.tone}`}
                    />
                    <strong>{formatValue(value)}</strong>
                    {line.firstValue !== undefined &&
                      line.firstValue.day !== shownDay && (
                        <span>
                          (
                          {formatDifference(
                            value - line.firstValue.value,
                            unit,
                          )}
                          )
                        </span>
                      )}
                    <span>{line.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {showSeriesNames && (
        <ul className="line-chart-legend">
          {series.map(line => (
            <li key={line.id} className="line-chart-legend-item">
              <span
                className={`line-chart-key line-chart-series--${line.tone}`}
              />
              {line.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
