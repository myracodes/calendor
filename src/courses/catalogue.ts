// Catalogue de courses (100 % végane), nourri à la main : les articles viennent
// des recettes du batch cooking (src/batchCooking/) complétés des basiques du
// quotidien. Logique volontairement dupliquée (pas d'import du batch cooking)
// pour que chaque liste s'ajuste indépendamment.
//
// Convention pour les libellés : singulier par défaut ("banane", "poivron"),
// pluriel quand le produit ne s'achète qu'en quantité et que le singulier
// sonnerait faux ("pâtes complètes", "lentilles corail", "algues wakame",
// "petits pois"). En cas de doute : écrire le libellé comme on le dirait à
// l'oral en dictant sa liste. Pas besoin de mémoriser la forme exacte :
// l'autocomplétion des presets (types générés plus bas) la propose.
//
// L'ordre des catégories = l'ordre des rayons dans le magasin : il est repris
// tel quel à l'écran et dans le PDF, pour une liste dans l'ordre du parcours.
//
// Ce fichier ne décide PAS de ce qui est coché par défaut : un article listé
// ici n'est qu'une case à cocher proposée. Les articles pré-cochés à
// l'ouverture de la page se déclarent dans preset.ts, et les boutons
// d'occasion (soirée, recettes…) dans ajoutsRapides.ts.

import type { CategorieCourses } from "./types"

// `as const` fige les libellés en types littéraux : c'est ce qui permet de
// générer plus bas les types CategorieId et SelectionParCategorie depuis les
// données elles-mêmes. `satisfies` vérifie quand même la structure attendue.
export const CATALOGUE = [
  {
    id: "fruits",
    nom: "Fruits",
    articles: [
      "banane",
      "pomme",
      "mangue",
      "ananas",
      "poire",
      "citron",
      "orange",
      "clémentine",
      "kiwi vert",
      "kiwi jaune",
      "fraise",
      "framboise",
      "myrtille",
      "cerise",
      "abricot",
      "pêche",
      "nectarine",
      "prune",
      "melon",
      "pastèque",
      "raisin",
      "figue",
    ],
  },
  {
    id: "legumes",
    nom: "Légumes",
    articles: [
      "salade verte",
      "tomate",
      "tomate cerise",
      "concombre",
      "courgette",
      "aubergine",
      "poivron",
      "avocat",
      "carotte",
      "oignon",
      "oignon nouveau",
      "ail",
      "échalote",
      "pomme de terre",
      "patate douce",
      "poireau",
      "champignon de Paris",
      "brocoli",
      "chou-fleur",
      "épinards",
      "endive",
      "radis",
      "fenouil",
      "asperge",
      "petits pois",
      "haricots verts",
      // "fève",
      "artichaut",
      // "navet",
      // "panais",
      "potimarron",
      "butternut",
      // "céleri branche",
      // "céleri-rave",
      "topinambour",
      // "chou rave",
      "chou vert",
      "chou rouge",
      "chou kale",
      "chou de Bruxelles",
      "basilic",
      "persil",
      "menthe",
    ],
  },
  {
    id: "frais",
    nom: "Frais",
    articles: [
      "tofu",
      "tofu soyeux",
      "yaourts",
      "crème de soja",
      "margarine",
      "houmous",
      "pâte feuilletée",
      "pâte à pizza",
      "râpé végane",
    ],
  },
  {
    id: "epicerie",
    nom: "Épicerie salée",
    articles: [
      "pain de mie",
      "pain burger",
      "riz complet",
      "riz rond (risotto)",
      "pâtes complètes",
      "semoule complète",
      "boulgour",
      "quinoa",
      "orge perlé",
      "orzo",
      "nouilles soba",
      "nouilles de riz",
      "farine",
      "sucre",
      "lentilles corail",
      "lentilles vertes",
      "lentilles blondes",
      "pois chiches",
      "haricots rouges",
      "haricots blancs",
      "protéines de soja texturées",
      "tomates séchées",
      "pulpe de tomate",
      "concentré de tomate",
      "olives",
      "olives noires",
      "pesto rouge",
      "pesto vert",
      "maïs (boîte)",
      "petits pois (boîte)",
      "haricots verts (bocal)",
      "asperge (bocal)",
      "maïs (bocal)",
      "cœur de palmier",
      "lait de coco",
      "crème de coco",
      "bouillon de légumes",
      "huile d'olive",
      "huile de tournesol",
      "huile de colza",
      "vinaigre balsamique",
      "vinaigre de cidre",
      "sauce soja",
      "moutarde",
      "mayonnaise végane",
      "crac-crac",
      "levure maltée",
      "sel",
      "poivre",
      "cumin",
      "coriandre",
    ],
  },
  {
    id: "monde",
    nom: "Produits du monde",
    articles: [
      "galettes tortillas",
      "galettes de riz",
      "gingembre mariné",
      "algues wakame",
      "algues nori",
      "crème coco",
    ],
  },
  {
    id: "petit-dejeuner",
    nom: "Petit déjeuner & sucré",
    articles: [
      "flocons d'avoine",
      "lait d'avoine",
      "lait de soja",
      "lait épeautre-noisette",
      "beurre de cacahuète",
      "confiture",
      "nutella végane",
      "barres naked",
      "café",
      "déca",
      "thé",
      "tisane",
      "chocolat noir",
      "graines de chia",
      "graines de courge",
      "graines de tournesol",
      "amande",
      "noix",
      "noisette",
      "noix de cajou",
      "abricot sec",
      "compote pommes",
    ],
  },
  {
    id: "surgeles",
    nom: "Surgelés",
    articles: [
      "épinards branches",
      "petits pois",
      "haricots verts",
      "edamame",
      "potatoes",
      "aiguillettes happyvore",
      "steaks happyvore",
      "chipos happyvore",
      "mochis",
      "sorbet mangue",
      "fruits surgelés",
    ],
  },
  {
    id: "boissons",
    nom: "Boissons",
    articles: ["eau", "sirop pêche", "grenadine", "cola"],
  },
  {
    id: "hygiene",
    nom: "Hygiène",
    articles: [
      "savon",
      "gel douche",
      "shampoing",
      "dentifrice Q",
      "dentifrice M",
      "têtes brosse à dents",
      "brosse à dents",
      "coton-tiges",
      "démaquillant",
      "déodorant",
      "tampons",
      "serviettes",
      "crème hydratante corps",
      "masque cheveux",
      "baume à lèvres",
    ],
  },
  {
    id: "menage",
    nom: "Ménage",
    articles: [
      "sopalin",
      "papier toilette",
      "mouchoirs",
      "lessive",
      "liquide vaisselle",
      "pastilles lave-vaisselle",
      "liquide de rinçage",
      "sels lave-vaisselle",
      "sacs poubelle 30 litres",
      "vinaigre blanc",
      "bicarbonate de soude",
      "percarbonate de soude",
    ],
  },
] as const satisfies readonly CategorieCourses[]

/** Id d'une catégorie ("fruits", "legumes"…), déduit du catalogue lui-même. */
export type CategorieId = (typeof CATALOGUE)[number]["id"]

// Les libellés d'articles de chaque catégorie, déduits du catalogue :
// ArticlesParCategorie["legumes"] = "salade verte" | "tomate" | …
type ArticlesParCategorie = {
  [C in (typeof CATALOGUE)[number] as C["id"]]: C["articles"][number]
}

/**
 * Une sélection d'articles groupée par id de catégorie — le format des presets
 * (preset.ts, ajoutsRapides.ts). Générée depuis le catalogue : une catégorie
 * inconnue ou un article absent de sa catégorie est une erreur de compilation
 * (soulignée dans l'IDE), plus seulement un plantage au chargement de la page.
 */
export type SelectionParCategorie = {
  [K in CategorieId]?: ArticlesParCategorie[K][]
}

// Garde-fou : un libellé doit être unique au sein de sa catégorie. Le même
// libellé peut en revanche exister dans deux rayons ("épinards" en Légumes et
// en Surgelés) : la sélection de la page Courses est indexée par la clé
// catégorie + article (voir articleKey), jamais par le libellé seul.
for (const categorie of CATALOGUE) {
  // Élargit les littéraux du `as const` en simples strings, pour indexOf.
  const articles: readonly string[] = categorie.articles
  const doublons = articles.filter(
    (article, i) => articles.indexOf(article) !== i,
  )
  if (doublons.length > 0) {
    throw new Error(
      `Catalogue de courses : libellés en double dans "${categorie.nom}" — ${doublons.join(", ")}`,
    )
  }
}

/** Clé de sélection d'un article : le couple rayon + libellé, unique dans tout le catalogue. */
export function articleKey(categorieId: string, article: string): string {
  return `${categorieId}:${article}`
}
