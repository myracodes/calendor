// Outils communs à tous les presets de courses (hebdomadaire, ajouts rapides) :
// validation contre le catalogue et mise à plat en clés de sélection.

import { articleKey, CATALOGUE, type SelectionParCategorie } from "./catalogue"
import type { CategorieCourses } from "./types"

// Map élargie en <string, …> : la validation compare des clés venant
// d'Object.entries (des strings), pas des littéraux du catalogue.
const categoriesParId = new Map<string, CategorieCourses>(
  CATALOGUE.map(categorie => [categorie.id, categorie]),
)

/**
 * Garde-fou : chaque entrée d'une sélection doit référencer une catégorie et un
 * article existants du catalogue, sinon elle n'apparaîtrait dans aucune case à
 * cocher et serait impossible à re-cocher une fois retirée de la liste.
 * Le type SelectionParCategorie attrape déjà ces erreurs à la compilation ;
 * cette vérification reste utile car `vite dev` ne bloque pas sur les erreurs
 * de type — ici, on plante immédiatement avec un message qui nomme le fautif.
 * @param contexte préfixe des messages d'erreur ("Preset hebdomadaire", "Ajout rapide Soirée"…)
 */
export function validerSelection(
  contexte: string,
  selection: SelectionParCategorie,
): void {
  for (const [categorieId, articles] of Object.entries(selection)) {
    const categorie = categoriesParId.get(categorieId)
    if (categorie === undefined) {
      throw new Error(`${contexte} : catégorie inconnue — ${categorieId}`)
    }
    const inconnus = (articles ?? []).filter(
      article => !categorie.articles.includes(article),
    )
    if (inconnus.length > 0) {
      throw new Error(
        `${contexte} : articles absents de "${categorie.nom}" — ${inconnus.join(", ")}`,
      )
    }
  }
}

/** Met une sélection à plat, en clés prêtes pour la page Courses. */
export function selectionKeys(selection: SelectionParCategorie): string[] {
  return Object.entries(selection).flatMap(([categorieId, articles]) =>
    (articles ?? []).map(article => articleKey(categorieId, article)),
  )
}
