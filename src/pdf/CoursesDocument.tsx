import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { INK, INK_LIGHT, LINE, PAPER } from "../colors"
import type { SectionListe } from "../courses/types"
import { RainbowBar } from "./shared"

// Date d'édition de la liste, en toutes lettres ("16 juillet 2026").
const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER, // fond blanc de la palette partagée
    color: INK, // encre violet foncé de l'app
    fontFamily: "PatrickHand", // écriture manuscrite, cohérente avec les calendriers et le BuJo
    fontSize: 12, // assez grand pour rester lisible posé dans le caddie
    padding: 32, // marge tout autour de la page
  },
  // Titre "Liste de courses" en tête de page.
  titre: {
    fontFamily: "BadScript", // la police "titre" de l'app
    fontSize: 22, // bien visible en tête de page
  },
  // Date d'édition, juste sous le titre.
  date: {
    fontSize: 11, // plus discrète que le titre
    color: INK_LIGHT, // gris-violet atténué de la palette
  },
  // Bande arc-en-ciel décorative, comme sur les cartes de l'app.
  accent: {
    flexDirection: "row", // les segments colorés du dégradé se posent côte à côte
    height: 4, // fine bande décorative
    marginTop: 8, // respire sous la date
    marginBottom: 4, // et avant les colonnes
  },
  // Conteneur des deux colonnes de catégories.
  colonnes: {
    flexDirection: "row", // deux colonnes côte à côte
    gap: 28, // gouttière entre les colonnes
  },
  // Une colonne de catégories.
  colonne: {
    flexGrow: 1, // les deux colonnes se partagent la largeur…
    flexBasis: 0, // …à parts strictement égales, quel que soit leur contenu
  },
  // Un rayon : son titre + ses articles.
  categorie: {
    marginTop: 14, // espace entre deux rayons
  },
  // Nom du rayon.
  categorieNom: {
    fontFamily: "BadScript", // même police que le titre, pour la hiérarchie
    fontSize: 14, // entre le titre de page et les articles
    marginBottom: 6, // espace avant le premier article
    paddingBottom: 2, // décolle le texte du trait de séparation
    borderBottomWidth: 1, // trait de séparation sous le nom du rayon
    borderBottomColor: LINE, // même gris-lilas que les bordures de l'app
  },
  // Une ligne article : sa case à cocher + son libellé.
  article: {
    flexDirection: "row", // case et libellé sur la même ligne
    alignItems: "center", // case centrée verticalement par rapport au texte
    gap: 6, // espace entre la case et le libellé
    marginBottom: 3, // espace entre deux articles
  },
  // La case à cocher au stylo, en magasin.
  case: {
    width: 9, // petite case…
    height: 9, // …carrée
    borderWidth: 1, // trait fin
    borderColor: INK, // même encre que le texte
  },
  // Libellé de l'article.
  articleLabel: {
    flexShrink: 1, // un libellé long passe à la ligne au lieu de déborder de la colonne
  },
})

// Répartit les rayons sur deux colonnes de hauteurs proches, sans couper un
// rayon en deux. Poids d'un rayon ≈ son nombre de lignes : le titre (2) + un
// article par ligne. On remplit la colonne de gauche jusqu'à la moitié du total.
function splitInTwoColumns(
  sections: SectionListe[],
): [SectionListe[], SectionListe[]] {
  const poids = (section: SectionListe) => 2 + section.articles.length
  const total = sections.reduce((somme, section) => somme + poids(section), 0)
  let cumul = 0
  let coupure = 0
  while (coupure < sections.length && cumul < total / 2) {
    cumul += poids(sections[coupure])
    coupure++
  }
  return [sections.slice(0, coupure), sections.slice(coupure)]
}

/** Une colonne de rayons, chaque article précédé de sa case à cocher. */
function Colonne({ sections }: { sections: SectionListe[] }) {
  return (
    <View style={styles.colonne}>
      {sections.map(section => (
        <View key={section.nom} style={styles.categorie}>
          <Text style={styles.categorieNom}>{section.nom}</Text>
          {section.articles.map(article => (
            <View key={article} style={styles.article}>
              <View style={styles.case} />
              <Text style={styles.articleLabel}>{article}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

/** Document PDF "liste de courses" : les rayons dans l'ordre du magasin, sur deux colonnes. */
export function CoursesDocument({ sections }: { sections: SectionListe[] }) {
  const [gauche, droite] = splitInTwoColumns(sections)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.titre}>Liste de courses</Text>
        <Text style={styles.date}>{DATE_FORMAT.format(new Date())}</Text>
        <RainbowBar style={styles.accent} />
        <View style={styles.colonnes}>
          <Colonne sections={gauche} />
          <Colonne sections={droite} />
        </View>
      </Page>
    </Document>
  )
}
