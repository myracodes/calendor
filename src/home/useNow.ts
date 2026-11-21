import { useEffect, useState } from "react"

/** Assez fréquent pour que l'heure affichée (à la minute) change à temps. */
const TICK_MS = 1000

/** L'heure courante, mise à jour en continu : la page suit l'heure, et change de jour à minuit. */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TICK_MS)
    return () => clearInterval(timer)
  }, [])

  return now
}
