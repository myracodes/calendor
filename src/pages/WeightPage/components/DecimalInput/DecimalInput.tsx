import { MAX_DECIMAL_VALUE } from "../../../../weight/validation"

interface DecimalInputProps {
  value: string
  onChange: (value: string) => void
  /** Id du formulaire du champ quand il n'est pas à l'intérieur : cellule d'un tableau, qu'un <form> ne peut pas englober. */
  form?: string
  /** Nom du champ pour les lecteurs d'écran quand il n'a pas de <label> : cellule d'un tableau, nommée par sa colonne. */
  label?: string
}

/** Champ d'une valeur au dixième près : un poids en kg, ou un tour en cm. */
export function DecimalInput({
  value,
  onChange,
  form,
  label,
}: DecimalInputProps) {
  return (
    <input
      type="number"
      inputMode="decimal"
      min="0"
      max={MAX_DECIMAL_VALUE}
      step="0.1"
      form={form}
      aria-label={label}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}
