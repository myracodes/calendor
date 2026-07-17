import { pdf } from "@react-pdf/renderer"
import { type SubmitEvent, useState } from "react"
import { type AjoutRapide, AJOUTS_RAPIDES } from "../../courses/ajoutsRapides"
import { articleKey, CATALOGUE } from "../../courses/catalogue"
import { PRESET_KEYS } from "../../courses/preset"
import { selectionKeys } from "../../courses/selection"
import type { ArticleLibre, SectionListe } from "../../courses/types"
import { CoursesDocument } from "../../pdf/CoursesDocument"
import "./CoursesPage.css"

// Couleurs d'accent des cartes de catégories, en rotation.
const ACCENTS = ["card--sun", "card--candy", "card--sky"]

export function CoursesPage() {
  // La sélection est indexée par clé catégorie + article (articleKey) — le même
  // libellé peut exister dans deux rayons — initialisée avec le preset hebdomadaire.
  const [selection, setSelection] = useState<ReadonlySet<string>>(() => new Set(PRESET_KEYS))
  const [libres, setLibres] = useState<ArticleLibre[]>([])
  const [saisie, setSaisie] = useState("")
  const [generating, setGenerating] = useState(false)

  function toggle(key: string) {
    setSelection(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  function ajouterLibre(e: SubmitEvent) {
    e.preventDefault()
    const label = saisie.trim()
    if (label === "") return
    setLibres(prev => [...prev, { id: crypto.randomUUID(), label }])
    setSaisie("")
  }

  function retirerLibre(id: string) {
    setLibres(prev => prev.filter(item => item.id !== id))
  }

  // Coche d'un coup tous les articles d'un ajout rapide, chacun dans son rayon.
  function appliquerAjoutRapide(ajout: AjoutRapide) {
    setSelection(prev => new Set([...prev, ...selectionKeys(ajout.selection)]))
  }

  // Remet la liste à zéro (articles cochés et achats ponctuels), pour repartir
  // d'une liste vierge — le preset hebdomadaire revient en rechargeant la page.
  function viderListe() {
    setSelection(new Set())
    setLibres([])
  }

  const estVide = selection.size === 0 && libres.length === 0

  // La liste s'affiche dans l'ordre du catalogue (= l'ordre des rayons du magasin).
  const listeCatalogue = CATALOGUE.flatMap(categorie =>
    categorie.articles
      .filter(article => selection.has(articleKey(categorie.id, article)))
      .map(article => ({ key: articleKey(categorie.id, article), label: article })),
  )

  async function generatePdf() {
    setGenerating(true)
    try {
      const sections: SectionListe[] = CATALOGUE.map(categorie => ({
        nom: categorie.nom,
        articles: categorie.articles.filter(article => selection.has(articleKey(categorie.id, article))),
      })).filter(section => section.articles.length > 0)
      if (libres.length > 0) {
        sections.push({ nom: "Divers", articles: libres.map(item => item.label) })
      }
      const blob = await pdf(<CoursesDocument sections={sections} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "liste-de-courses.pdf"
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <p className="tagline">Ma liste de courses, dans l'ordre des rayons</p>

      <section className="card">
        <h2>Ma liste</h2>
        {estVide ? (
          <p className="hint">La liste est vide : coche des articles ci-dessous ou ajoute un achat ponctuel.</p>
        ) : (
          <ul className="courses-liste">
            {listeCatalogue.map(item => (
              <li key={item.key} className="courses-chip">
                {item.label}
                <button type="button" aria-label={`Retirer ${item.label}`} onClick={() => toggle(item.key)}>
                  ×
                </button>
              </li>
            ))}
            {libres.map(item => (
              <li key={item.id} className="courses-chip courses-chip--libre">
                {item.label}
                <button type="button" aria-label={`Retirer ${item.label}`} onClick={() => retirerLibre(item.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <form className="courses-ajout" onSubmit={ajouterLibre}>
          <label className="courses-ajout-champ">
            Achat ponctuel (hors catalogue)
            <input type="text" value={saisie} placeholder="ampoule E27" onChange={e => setSaisie(e.target.value)} />
          </label>
          <button type="submit">Ajouter</button>
        </form>
        <button type="button" className="btn-remove courses-vider" onClick={viderListe} disabled={estVide}>
          Vider la liste
        </button>
      </section>

      <section className="card card--sky">
        <h2>Ajout rapide</h2>
        <div className="courses-ajouts-rapides">
          {AJOUTS_RAPIDES.map(ajout => (
            <button key={ajout.id} type="button" onClick={() => appliquerAjoutRapide(ajout)}>
              + {ajout.nom}
            </button>
          ))}
        </div>
      </section>

      {CATALOGUE.map((categorie, i) => (
        <section key={categorie.id} className={`card ${ACCENTS[i % ACCENTS.length]}`}>
          <h2>{categorie.nom}</h2>
          <div className="courses-grid">
            {categorie.articles.map(article => (
              <label key={article} className="courses-article">
                <input
                  type="checkbox"
                  checked={selection.has(articleKey(categorie.id, article))}
                  onChange={() => toggle(articleKey(categorie.id, article))}
                />
                {article}
              </label>
            ))}
          </div>
        </section>
      ))}

      <button type="button" className="generate" disabled={generating || estVide} onClick={generatePdf}>
        {generating ? "Génération…" : "Générer le PDF"}
      </button>
    </>
  )
}
