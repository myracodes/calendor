import { pdf } from "@react-pdf/renderer"
import { useState } from "react"
import cvPhoto from "../../assets/images/cv-photo.jpg"
import { CV_EN } from "../../cv/dataEn"
import { CV_FR } from "../../cv/dataFr"
import { fetchCvContact } from "../../cv/fetchCvContact"
import type { CvData, CvLanguage } from "../../cv/types"
import { CvDocument } from "../../pdf/CvDocument"

const DATA: Record<CvLanguage, CvData> = { fr: CV_FR, en: CV_EN }

export function CvPage() {
  const [language, setLanguage] = useState<CvLanguage>("fr")
  // Titre affiché en haut du CV : vide = titre par défaut du fichier de données.
  const [title, setTitle] = useState("")
  const [generating, setGenerating] = useState(false)
  // true après une génération qui n'a pas pu récupérer les vraies coordonnées
  // depuis Supabase (voir fetchCvContact) : le PDF contient les valeurs de
  // remplacement du fichier de données.
  const [contactMissing, setContactMissing] = useState(false)

  const data = DATA[language]

  async function generatePdf() {
    setGenerating(true)
    try {
      const contact = await fetchCvContact(language)
      setContactMissing(contact === null)
      const cv: CvData = {
        ...data,
        ...contact,
        titre: title.trim() === "" ? data.titre : title.trim(),
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
            Titre du CV (vide = "{data.titre}")
            <input type="text" value={title} placeholder={data.titre} onChange={e => setTitle(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="card card--sun">
        <h2>Contenu</h2>
        <p>
          Le contenu du CV vit dans <strong>src/cv/dataFr.ts</strong> et <strong>dataEn.ts</strong> : textes, sections
          de la colonne de gauche, expériences, side projects. Chaque bloc porte un champ <strong>page</strong> (1 ou 2)
          pour le déplacer d'une page à l'autre. Les coordonnées (téléphone, email…) vivent dans Supabase (table{" "}
          <strong>cv_contact</strong>, une ligne par langue) et sont récupérées à la génération. La photo vient de
          src/assets/images/cv-photo.jpg.
        </p>
      </section>

      {contactMissing && (
        <p className="hint">
          Les vraies coordonnées n'ont pas pu être récupérées (Supabase non configuré, session absente, ou langue
          absente de la table cv_contact) : le PDF contient des coordonnées de remplacement. Depuis le site déployé,
          connecte-toi puis régénère.
        </p>
      )}

      <button type="button" className="generate" disabled={generating} onClick={generatePdf}>
        {generating ? "Génération…" : `Générer le PDF (${language === "fr" ? "français" : "anglais"})`}
      </button>
    </>
  )
}
