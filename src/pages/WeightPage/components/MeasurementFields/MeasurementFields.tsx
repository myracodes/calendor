import { MEASUREMENTS } from "../../../../weight/measurements"
import type { WeightEntryDraft } from "../../../../weight/types"
import { DecimalInput } from "../DecimalInput/DecimalInput"

interface MeasurementFieldsProps {
  measurements: WeightEntryDraft["measurements"]
  onChange: (measurements: WeightEntryDraft["measurements"]) => void
}

/** Les tours facultatifs d'une nouvelle pesée, en cm (unité évidente, pas répétée). Sans conteneur : à poser dans une ligne (.row), après le poids et la date. */
export function MeasurementFields({
  measurements,
  onChange,
}: MeasurementFieldsProps) {
  return (
    <>
      {MEASUREMENTS.map(measurement => (
        <label key={measurement.id}>
          {measurement.label}
          <DecimalInput
            value={measurements[measurement.id]}
            onChange={value =>
              onChange({ ...measurements, [measurement.id]: value })
            }
          />
        </label>
      ))}
    </>
  )
}
