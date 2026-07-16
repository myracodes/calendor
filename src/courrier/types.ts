/** Contenu d'un courrier, tel que saisi dans le formulaire. */
export interface CourrierSettings {
  /** Coordonnées de l'expéditrice, une information par ligne (nom, adresse, mail, téléphone…). */
  expediteur: string
  /** Coordonnées de la destinataire, une information par ligne. */
  destinataire: string
  /** Lieu d'écriture ("Paris") — optionnel. */
  lieu: string
  /** Date d'écriture au format ISO "aaaa-mm-jj" — optionnelle (champ vidé = pas de date). */
  date: string
  /** Objet du courrier, sans le préfixe "Objet :" (ajouté à la génération) — optionnel. */
  objet: string
  /** Corps du courrier, paragraphes séparés par des sauts de ligne. */
  corps: string
}
