import { Image, Link, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { CvData, SidebarSection } from "../cv/types"
import { CvRichText } from "./CvRichText"
import { CvSectionTitle } from "./CvSectionTitle"
import { CV_AMBER, CV_FONT_DISPLAY, CV_VIOLET, CV_WHITE } from "./cvTheme"

const PHOTO_SIZE = 84 // diamètre de la photo/du rond d'initiales, en points

const styles = StyleSheet.create({
  nom: {
    fontFamily: CV_FONT_DISPLAY, // manuscrite des grands titres
    fontSize: 22, // le nom est l'élément le plus gros de la colonne (la manuscrite paraît plus petite)
    color: CV_WHITE, // blanc sur le fond violet
    textAlign: "center", // centré dans la colonne, sous la photo
    marginBottom: 10, // espace avant la photo/le bloc contact
  },
  photo: {
    width: PHOTO_SIZE, // photo carrée…
    height: PHOTO_SIZE, // …de même hauteur…
    borderRadius: PHOTO_SIZE / 2, // …arrondie en cercle
    alignSelf: "center", // centrée dans la colonne
    marginBottom: 10, // espace avant le bloc contact
  },
  initialesFond: {
    backgroundColor: "#f1edfa", // violet très pâle en fond du rond, en attendant la vraie photo
  },
  initiales: {
    fontSize: 30, // grosses initiales pour remplir le rond
    fontWeight: "bold", // même graisse que le nom
    color: CV_VIOLET, // violet principal du CV
    lineHeight: PHOTO_SIZE / 30, // centre verticalement le texte dans le rond (hauteur de ligne = diamètre)
    textAlign: "center", // centre horizontalement les initiales
  },
  contactLigne: {
    fontSize: 8.5, // petites lignes de contact, comme dans le CV d'origine
    color: CV_WHITE, // blanc sur le fond violet
    textAlign: "center", // centrées dans la colonne
    marginBottom: 3, // léger espace entre les lignes
  },
  contactLien: {
    color: CV_AMBER, // les liens sont ambre sur le fond violet, comme dans le CV d'origine
    textDecoration: "underline", // soulignés pour signaler qu'ils sont cliquables
  },
  infos: {
    fontSize: 7.5, // ligne d'informations pratiques, la plus discrète du bloc
    color: CV_WHITE, // blanc sur le fond violet
    textAlign: "center", // centrée dans la colonne
    marginTop: 4, // espace après les lignes de contact
    marginBottom: 14, // espace avant la première section
  },
  section: {
    marginBottom: 14, // espace entre deux sections de la colonne
  },
  item: {
    marginBottom: 7, // espace entre deux items d'une section
  },
  itemTitre: {
    fontSize: 9, // même taille que le texte : seule la couleur et la graisse le distinguent
    fontWeight: "bold", // titre d'item en gras (aide aussi la lisibilité de l'ambre sur violet)
    color: CV_AMBER, // ambre sur le fond violet, comme dans le CV d'origine
    marginBottom: 1, // léger espace avant le texte de l'item
  },
  itemTexte: {
    fontSize: 9, // corps de texte de la colonne
    color: CV_WHITE, // blanc sur le fond violet
    lineHeight: 1.35, // interligne aéré pour les petits corps de texte
  },
})

/** Rond d'initiales affiché tant qu'aucune photo n'est fournie (data.ts, champ `photo`). */
function Initiales({ nom }: { nom: string }) {
  const initiales = nom
    .split(" ")
    .map(mot => mot[0])
    .join("")
  return (
    <View style={[styles.photo, styles.initialesFond]}>
      <Text style={styles.initiales}>{initiales}</Text>
    </View>
  )
}

/** Bloc d'identité en tête de la colonne de gauche : photo, nom, contact, infos pratiques. */
export function CvIdentity({ cv }: { cv: CvData }) {
  return (
    <View>
      <Text style={styles.nom}>{cv.nom}</Text>
      {cv.photo === null ? <Initiales nom={cv.nom} /> : <Image style={styles.photo} src={cv.photo} />}
      {cv.contact.map(ligne =>
        ligne.url === undefined ? (
          <Text key={ligne.texte} style={styles.contactLigne}>
            {ligne.texte}
          </Text>
        ) : (
          <Link key={ligne.texte} src={ligne.url} style={[styles.contactLigne, styles.contactLien]}>
            {ligne.texte}
          </Link>
        ),
      )}
      <Text style={styles.infos}>{cv.infos}</Text>
    </View>
  )
}

/** Colonne de gauche du CV : sections (Formation, Compétences…) d'une page donnée. */
export function CvSidebarSections({ sections }: { sections: SidebarSection[] }) {
  return (
    <View>
      {sections.map(section => (
        <View key={section.titre} style={styles.section}>
          <CvSectionTitle inverse>{section.titre}</CvSectionTitle>
          {section.items.map(item => (
            <View key={item.texte} style={styles.item}>
              {item.titre !== undefined && <Text style={styles.itemTitre}>{item.titre}</Text>}
              <CvRichText inverse texte={item.texte} style={styles.itemTexte} />
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
