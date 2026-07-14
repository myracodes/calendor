import { MONTH } from "../constants/months"
import type { LifeEvent } from "./lifeEvents.type"

/**
 * Fêtes et autres dates affichées sur le calendrier (nom seul, sans année).
 */
export const OTHER_EVENTS: LifeEvent[] = [
  { name: "💘 Saint-Valentin", day: 14, month: MONTH.FÉVRIER },
  //   { name: "Pâques", day: 31, month: MONTH.MARS },
  //   { name: "Fête des mères", day: 12, month: MONTH.MAI },
  //   { name: "Fête des pères", day: 16, month: MONTH.JUIN },
  { name: "🎃 Halloween", day: 31, month: MONTH.OCTOBRE },
]
