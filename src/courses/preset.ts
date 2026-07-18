// Le preset hebdomadaire : la liste "par défaut" de la page Courses.
//
// Tout article déclaré dans PRESET_HEBDO arrive DÉJÀ COCHÉ dans "Ma liste" à
// l'ouverture de la page (et reste retirable d'un clic, comme n'importe quel
// article). C'est donc ici — et seulement ici — qu'on décide de ce qui est
// acheté (presque) chaque semaine :
// - un article apparaît par défaut alors qu'on l'achète rarement ? Le retirer
//   de PRESET_HEBDO ; il reste cochable à la main dans sa carte de rayon.
// - pré-cocher un nouvel article : l'ajouter sous l'id de sa catégorie (champ
//   `id` dans catalogue.ts), avec son libellé exactement comme dans le catalogue.
// - si l'article référencé n'existe pas dans le catalogue, le garde-fou
//   ci-dessous fait planter la page au chargement, en nommant le fautif.
//
// Pour les articles d'occasion (soirée, recettes…), voir ajoutsRapides.ts :
// même format, mais cochés via un bouton plutôt qu'à l'ouverture.

import type { SelectionParCategorie } from "./catalogue"
import { selectionKeys, validerSelection } from "./selection"

export const PRESET_HEBDO: SelectionParCategorie = {
  fruits: ["banane", "kiwi vert", "mangue"],
  legumes: [
    "salade verte",
    "tomate cerise",
    "carotte",
    "aubergine",
    "courgette",
    "oignon",
  ],
  frais: ["tofu", "yaourts"],
  epicerie: ["pain de mie"],
  "petit-dejeuner": ["lait d'avoine"],
  boissons: ["eau"],
}

validerSelection("Preset hebdomadaire", PRESET_HEBDO)

/** Le preset à plat, sous forme de clés de sélection prêtes pour la page Courses. */
export const PRESET_KEYS: string[] = selectionKeys(PRESET_HEBDO)
