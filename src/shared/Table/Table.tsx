import type { ReactNode } from "react"
import "./Table.css"

interface TableProps {
  /** Nom du tableau pour les lecteurs d'écran (« Historique des pesées »), porté par sa zone de défilement. */
  label: string
  /** Le contenu natif du tableau : <thead> et <tbody>. */
  children: ReactNode
}

/**
 * Tableau de données : en-têtes de colonnes en gras, lignes séparées par un
 * filet. Plus large que sa card (petit écran, ligne en modification), il
 * défile horizontalement au lieu de l'élargir.
 *
 * La première colonne est un <th scope="row"> : elle nomme la ligne. Classes
 * à poser dans les cellules :
 * - `table-cell-number` (sur th et td) : chiffres alignés à droite ;
 * - `table-actions` (sur un conteneur dans la dernière cellule) : les
 *   boutons-icônes de la ligne, calés à droite.
 * Et sur un <tr> : `table-row-editing` pour une ligne en modification (un
 * champ par cellule), resserrée pour tenir dans la largeur du tableau.
 */
export function Table({ label, children }: TableProps) {
  return (
    // La zone de défilement prend le focus pour défiler au clavier, et le nom
    // du tableau pour être annoncée.
    <div className="table-scroll" role="region" aria-label={label} tabIndex={0}>
      <table className="table">{children}</table>
    </div>
  )
}
