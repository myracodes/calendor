import { MONTH } from "../constants/months"
import type { LifeEvent } from "./lifeEvents.type"
/**
 * Anniversaires affichés sur le calendrier.
 *
 * Une ligne par personne : nom, mois, jour et année
 * (optionnelle). Le nombre d'années écoulées
 * est calculé automatiquement à partir de l'année de la page.
 */

// { name: "Birthday", day: 30, month: MONTH.JUILLET, year: 1992 },
// Personne décédée (affiche "1927-2003" au lieu de l'âge ; year de died optionnel) :
// { name: "Birthday", day: 30, month: MONTH.JUILLET, year: 1927, died: { year: 2003 } },
export const BIRTHDAYS: LifeEvent[] = [
  // Janvier
  { name: "Jaqueline", day: 18, month: MONTH.JANVIER, year: 1969 },
  // Février
  { name: "Kimberline", day: 3, month: MONTH.FÉVRIER },
  { name: "Marie T", day: 14, month: MONTH.FÉVRIER },
  { name: "Alède d'amour", day: 21, month: MONTH.FÉVRIER, year: 1996 },
  { name: "Mamie", day: 27, month: MONTH.FÉVRIER, year: 1931 },
  // Mars
  { name: "Tess", day: 2, month: MONTH.MARS },
  { name: "Elle Cordova", day: 8, month: MONTH.MARS },
  { name: "Sam6", day: 12, month: MONTH.MARS },
  { name: "Thomas Brun", day: 15, month: MONTH.MARS },
  { name: "Maman", day: 29, month: MONTH.MARS, year: 1963 },
  { name: "Ouragan-Lion", day: 30, month: MONTH.MARS, year: 2018 },
  // Avril
  { name: "Bintou", day: 3, month: MONTH.AVRIL },
  {
    name: "Bastien",
    day: 27,
    month: MONTH.AVRIL,
    year: 1997,
    died: { year: 2024 },
  },
  { name: "Alice K'", day: 30, month: MONTH.AVRIL },
  // Mai
  { name: "Hannah", day: 3, month: MONTH.MAI, year: 1993 },
  { name: "Jean-Olivier", day: 18, month: MONTH.MAI },
  { name: "Dabyoo", day: 28, month: MONTH.MAI, year: 1999 },
  // Juin
  { name: "Q&M", day: 6, month: MONTH.JUIN, year: 2022 },
  { name: "Julia", day: 15, month: MONTH.JUIN, year: 1992 },
  { name: "Mamoulata", day: 15, month: MONTH.JUIN, year: 1992 },
  { name: "Léopard", day: 29, month: MONTH.JUIN },
  // Juillet
  { name: "Maxime", day: 1, month: MONTH.JUILLET },
  { name: "Hakim & Ali", day: 2, month: MONTH.JUILLET, year: 1975 },
  { name: "Chacha", day: 7, month: MONTH.JUILLET },
  {
    name: "Papi",
    day: 17,
    month: MONTH.JUILLET,
    year: 1924,
    died: { year: 2003 },
  },
  { name: "Shishou", day: 17, month: MONTH.JUILLET, year: 2003 },
  { name: "Limounette", day: 17, month: MONTH.JUILLET, year: 1992 },
  { name: "Miko", day: 25, month: MONTH.JUILLET, year: 1992 },
  { name: "My", day: 30, month: MONTH.JUILLET, year: 1992 },
  { name: "Jumeaux", day: 30, month: MONTH.JUILLET },
  // Août
  { name: "Titi", day: 3, month: MONTH.AOÛT, year: 1996 },
  { name: "Jake", day: 10, month: MONTH.AOÛT },
  { name: "Magui", day: 10, month: MONTH.AOÛT },
  { name: "Robin", day: 13, month: MONTH.AOÛT },
  { name: "Agnès", day: 15, month: MONTH.AOÛT, year: 1963 },
  { name: "Juliette K", day: 25, month: MONTH.AOÛT },
  { name: "Louise Dubray", day: 27, month: MONTH.AOÛT },
  // Septembre
  { name: "Mathieu LBD", day: 12, month: MONTH.SEPTEMBRE },
  { name: "Issam", day: 18, month: MONTH.SEPTEMBRE, year: 2007 },
  { name: "Lindounesh", day: 21, month: MONTH.SEPTEMBRE, year: 1997 },
  { name: "Lauriane T", day: 22, month: MONTH.SEPTEMBRE },
  { name: "Esther Le Gall", day: 26, month: MONTH.SEPTEMBRE, year: 1992 },
  { name: "Anka", day: 27, month: MONTH.SEPTEMBRE, year: 1993 },
  // Octobre
  { name: "Typhaine", day: 1, month: MONTH.OCTOBRE },
  { name: "QQ", day: 10, month: MONTH.OCTOBRE, year: 1992 },
  { name: "Antonin", day: 28, month: MONTH.OCTOBRE, year: 2002 },
  // Novembre
  { name: "Lilou", day: 3, month: MONTH.NOVEMBRE, year: 1997 },
  { name: "Manoune", day: 4, month: MONTH.NOVEMBRE, year: 1991 },
  { name: "Hachiko", day: 6, month: MONTH.NOVEMBRE, year: 1993 },
  { name: "Dodé", day: 9, month: MONTH.NOVEMBRE, year: 1990 },
  { name: "Ana", day: 22, month: MONTH.NOVEMBRE },
  { name: "Markus", day: 28, month: MONTH.NOVEMBRE },
  // Décembre
  { name: "Laurence", day: 4, month: MONTH.DÉCEMBRE },
  { name: "Souplyne", day: 12, month: MONTH.DÉCEMBRE },
  { name: "Léa Biu", day: 25, month: MONTH.DÉCEMBRE },
  { name: "Leïla", day: 30, month: MONTH.DÉCEMBRE, year: 1964 },
]
