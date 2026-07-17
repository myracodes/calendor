import { pdf } from "@react-pdf/renderer"
import { useState } from "react"
import cvPhoto from "../../assets/images/cv-photo.jpg"
import { ACCROCHES_EN, CV_EN, TITRES_EN } from "../../cv/dataEn"
import { ACCROCHES_FR, CV_FR, TITRES_FR } from "../../cv/dataFr"
import { fetchCvContact } from "../../cv/fetchCvContact"
import type { CvAccroche, CvData, CvLanguage } from "../../cv/types"
import { CvDocument } from "../../pdf/CvDocument"

const DATA: Record<CvLanguage, CvData> = { fr: CV_FR, en: CV_EN }
const ACCROCHES: Record<CvLanguage, Record<CvAccroche, string>> = { fr: ACCROCHES_FR, en: ACCROCHES_EN }
const TITRES: Record<CvLanguage, Record<CvAccroche, string>> = { fr: TITRES_FR, en: TITRES_EN }

export function CvPage() {
  const [language, setLanguage] = useState<CvLanguage>("fr")
  // Accroche choisie selon le type de poste visé (dev par défaut).
  const [accroche, setAccroche] = useState<CvAccroche>("dev")
  // Titre affiché en haut du CV : vide = titre par défaut de l'accroche choisie (voir defaultTitle).
  const [title, setTitle] = useState("")
  const [generating, setGenerating] = useState(false)
  // true après une génération qui n'a pas pu récupérer les vraies coordonnées
  // depuis Supabase (voir fetchCvContact) : le PDF contient les valeurs de
  // remplacement du fichier de données.
  const [contactMissing, setContactMissing] = useState(false)

  const data = DATA[language]
  const defaultTitle = TITRES[language][accroche]

  async function generatePdf() {
    setGenerating(true)
    try {
      const contact = await fetchCvContact(language)
      setContactMissing(contact === null)
      const cv: CvData = {
        ...data,
        ...contact,
        titre: title.trim() === "" ? defaultTitle : title.trim(),
        accroche: ACCROCHES[language][accroche],
        photo: cvPhoto,
      }
      const blob = await pdf(<CvDocument cv={cv} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `cv-myriam-mira-${language}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <p className="tagline">Mon générateur de CV au format PDF</p>

      <section className="card card--sky">
        <h2>Paramétrage</h2>
        <div className="row">
          <label>
            Langue
            <select value={language} onChange={e => setLanguage(e.target.value as CvLanguage)}>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </label>
          <label>
            Accroche
            <select value={accroche} onChange={e => setAccroche(e.target.value as CvAccroche)}>
              <option value="dev">Développeuse (défaut)</option>
              <option value="management">Cheffe de projet / Scrum master</option>
            </select>
          </label>
          <label>
            Titre du CV (vide = "{defaultTitle}")
            <input type="text" value={title} placeholder={defaultTitle} onChange={e => setTitle(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="card card--sun">
        <h2>Contenu</h2>
        <p>
          Le contenu du CV vit dans <strong>src/cv/dataFr.ts</strong> et <strong>dataEn.ts</strong> : textes, sections
          de la colonne de gauche, expériences, side projects. Chaque bloc porte un champ <strong>page</strong> (1 ou 2)
          pour le déplacer d'une page à l'autre. Les coordonnées (téléphone, email…) vivent dans Supabase (table{" "}
          <strong>cv_contact</strong>, une ligne par langue) et sont récupérées à la génération.
        </p>
      </section>

      {contactMissing && (
        <p className="hint">
          Les vraies coordonnées n'ont pas pu être récupérées (Supabase non configuré, session absente, ou langue
          absente de la table cv_contact). Depuis le site déployé, connecte-toi puis régénère.
        </p>
      )}

      <button type="button" className="generate" disabled={generating} onClick={generatePdf}>
        {generating ? "Génération…" : `Générer le PDF (${language === "fr" ? "français" : "anglais"})`}
      </button>
    </>
  )
}
