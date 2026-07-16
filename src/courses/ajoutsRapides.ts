// Les "ajouts rapides" : des boutons de la page Courses qui cochent d'un clic
// tous les articles d'une occasion (soirée, recettes…). Chaque article est
// coché dans son vrai rayon, donc le PDF reste trié dans l'ordre du magasin.
// Format d'une sélection : id d'une catégorie du catalogue → articles.

import type { SelectionParCategorie } from "./catalogue"
import { validerSelection } from "./selection"

export interface AjoutRapide {
  /** identifiant stable (clés React) */
  id: string
  /** libellé du bouton */
  nom: string
  selection: SelectionParCategorie
}

export const AJOUTS_RAPIDES: AjoutRapide[] = [
  {
    id: "soiree",
    nom: "Soirée",
    selection: {
      legumes: ["concombre", "tomate cerise", "avocat"],
      frais: ["houmous"],
      epicerie: ["pois chiches", "olives", "crac-crac"],
      boissons: ["cola"],
    },
  },
  {
    id: "pizza",
    nom: "Pizza",
    selection: {
      legumes: ["poivron", "oignon", "champignon de Paris"],
      frais: ["pâte à pizza", "râpé végane"],
      epicerie: ["pulpe de tomate", "olives noires"],
    },
  },
  {
    id: "pique-nique",
    nom: "Pique-nique",
    selection: {
      fruits: ["raisin", "melon", "kiwi vert"],
      legumes: ["concombre", "tomate cerise", "avocat", "radis"],
      frais: ["houmous"],
      epicerie: ["pain de mie"],
    },
  },
  {
    id: "ramen",
    nom: "Ramen",
    selection: {
      legumes: ["oignon"],
      frais: ["tofu"],
      epicerie: ["nouilles soba"],
      monde: ["gingembre mariné", "algues wakame"],
    },
  },
]

for (const ajout of AJOUTS_RAPIDES) {
  validerSelection(`Ajout rapide "${ajout.nom}"`, ajout.selection)
}
