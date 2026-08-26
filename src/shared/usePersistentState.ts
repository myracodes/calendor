import { useState } from "react"

// Persiste la valeur dans localStorage à chaque changement, pour la
// retrouver après un refresh (voire une fermeture du navigateur).
export function usePersistentState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    if (stored === null) return defaultValue
    try {
      return JSON.parse(stored) as T
    } catch {
      return defaultValue
    }
  })

  function setPersistedState(value: T) {
    setState(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [state, setPersistedState]
}
