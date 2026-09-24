/** Contenu et options de mise en page d'un courrier, tels que saisis dans le formulaire. */
export interface CourrierSettings {
  /** Coordonnées de l'expéditrice, une information par ligne (nom, adresse, mail, téléphone…). */
  expediteur: string
  /** Coordonnées de la destinataire, une information par ligne. */
  destinataire: string
  /** Lieu d'écriture ("Paris") — optionnel. */
  lieu: string
  /** Date d'écriture affichée dans l'en-tête (sinon seul le lieu apparaît). */
  inclureDate: boolean
  /** Date d'écriture au format ISO "aaaa-mm-jj", prise en compte si `inclureDate`. */
  date: string
  /** Objet du courrier, sans le préfixe "Objet :" (ajouté à la génération) — optionnel. */
  objet: string
  /** Corps du courrier, paragraphes séparés par des sauts de ligne. */
  corps: string
  /** Marges du haut et du bas réduites (1 cm au lieu de 2 cm). */
  margesVerticalesReduites: boolean
  /** Marges de gauche et de droite réduites (1 cm au lieu de 2 cm). */
  margesHorizontalesReduites: boolean
  /** Écarts réduits entre expéditrice, destinataire, lieu/date et objet. */
  ecartsReduits: boolean
  /** Corps du courrier justifié (sinon ferré à gauche). */
  texteJustifie: boolean
}
