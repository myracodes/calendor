import { useState } from "react"
import cvPhoto from "../../assets/images/cv-photo.jpg"
import { CV_LOCALES } from "../../cv/buildLocale"
import { fetchCvContact } from "../../cv/fetchCvContact"
import type { CvData, CvLanguage, CvPitch } from "../../cv/types"
import { CvDocument } from "../../pdf/CvDocument"
import { downloadPdf } from "../../pdf/downloadPdf"

export function CvPage() {
  const [language, setLanguage] = useState<CvLanguage>("fr")
  // Accroche choisie selon le type de poste visé (dev par défaut).
  const [pitch, setPitch] = useState<CvPitch>("dev")
  // Titre affiché en haut du CV : vide = titre par défaut de l'accroche choisie (voir defaultTitle).
  const [title, setTitle] = useState("")
  const [generating, setGenerating] = useState(false)
  // true après une génération qui n'a pas pu récupérer les vraies coordonnées
  // depuis Supabase (voir fetchCvContact) : le PDF contient les valeurs de
  // remplacement de content/profile.ts.
  const [contactMissing, setContactMissing] = useState(false)

  const locale = CV_LOCALES[language]
  const defaultTitle = locale.titles[pitch]

  async function generatePdf() {
    setGenerating(true)
    try {
      const contact = await fetchCvContact(language)
      setContactMissing(contact === null)
      const cv: CvData = {
        ...locale.cv,
        ...contact,
        title: title.trim() === "" ? defaultTitle : title.trim(),
        pitch: locale.pitches[pitch],
        photo: cvPhoto,
      }
      await downloadPdf(
        <CvDocument cv={cv} />,
        `cv-myriam-mira-${language}.pdf`,
      )
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
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as CvLanguage)}
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </label>
          <label>
            Accroche
            <select
              value={pitch}
              onChange={e => setPitch(e.target.value as CvPitch)}
            >
              <option value="dev">Développeuse (défaut)</option>
              <option value="management">
                Cheffe de projet / Scrum master
              </option>
            </select>
          </label>
          <label>
            Titre du CV (vide = "{defaultTitle}")
            <input
              type="text"
              value={title}
              placeholder={defaultTitle}
              onChange={e => setTitle(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="card card--sun">
        <h2>Contenu</h2>
        <p>
          Le contenu du CV vit dans <strong>src/cv/content/</strong> (un fichier
          par section). Chaque bloc contient un champ <strong>page</strong> (1
          ou 2) pour le déplacer d'une page à l'autre. Les coordonnées
          personnelles sont stockées dans Supabase (table{" "}
          <strong>cv_contact</strong>, une ligne par langue) et sont récupérées
          à la génération du PDF.
        </p>
      </section>

      {contactMissing && (
        <p className="hint">
          Les vraies coordonnées n'ont pas pu être récupérées (Supabase non
          configuré, session absente, ou langue absente de la table cv_contact).
          Depuis le site déployé, connecte-toi puis régénère.
        </p>
      )}

      <button
        type="button"
        className="generate"
        disabled={generating}
        onClick={generatePdf}
      >
        {generating
          ? "Génération…"
          : `Générer le PDF (${language === "fr" ? "français" : "anglais"})`}
      </button>
    </>
  )
}
