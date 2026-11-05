import { currentYear, FIRST_READ_YEAR } from "../../../../books/readYear"
import { readYearError } from "../../../../books/validation"

export interface Reading {
  readYear: number
  inProgress: boolean
}

interface ReadingFieldsProps {
  /** « Lu en », « Écouté en ». */
  yearLabel: string
  reading: Reading
  onChange: (reading: Reading) => void
}

/** Année de lecture et case « En cours », sur une ligne, avec l'erreur d'année en dessous. */
export function ReadingFields({
  yearLabel,
  reading,
  onChange,
}: ReadingFieldsProps) {
  const yearError = readYearError(reading.readYear)

  return (
    <>
      <div className="row row-field-aligned">
        <label>
          {yearLabel}
          <input
            type="number"
            min={FIRST_READ_YEAR}
            max={currentYear()}
            step={1}
            // Champ vidé = 0, refusé par readYearError tant qu'il n'est pas rempli.
            value={reading.readYear === 0 ? "" : reading.readYear}
            onChange={e =>
              onChange({
                ...reading,
                readYear: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />
        </label>

        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={reading.inProgress}
            onChange={e =>
              onChange({ ...reading, inProgress: e.target.checked })
            }
          />
          En cours
        </label>
      </div>

      {yearError !== null && <p className="hint">{yearError}</p>}
    </>
  )
}
