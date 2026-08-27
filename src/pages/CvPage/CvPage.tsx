import { useState } from "react"
import cvPhoto from "../../assets/images/cv-photo.jpg"
import {
  CV_LOCALES,
  resolveExperiences,
  resolveSidebar,
  resolveSideProjects,
} from "../../cv/buildLocale"
import { fetchCvContact } from "../../cv/fetchCvContact"
import type { CvData, CvLanguage, CvPitch } from "../../cv/types"
import { CvDocument } from "../../pdf/cv/CvDocument"
import { downloadPdf } from "../../pdf/shared/downloadPdf"
import { usePersistentState } from "../../shared/usePersistentState"

export function CvPage() {
  const [language, setLanguage] = usePersistentState<CvLanguage>(
    "cv.language",
    "fr",
  )
  // Accroche choisie selon le type de poste visé (dev par défaut) : choisit
  // le texte d'accroche et le titre par défaut, et réordonne les missions
  // taguées (voir PitchTaggedText dans ../../cv/types.ts).
  const [pitch, setPitch] = usePersistentState<CvPitch>("cv.pitch", "dev")
  // Titre affiché en haut du CV : vide = titre par défaut de l'accroche choisie (voir defaultTitle).
  const [title, setTitle] = usePersistentState("cv.title", "")
  // Texte de l'accroche : vide = texte par défaut de l'accroche choisie (voir defaultPitch).
  const [pitchText, setPitchText] = usePersistentState("cv.pitchText", "")
  const [generating, setGenerating] = useState(false)
  // true après une génération qui n'a pas pu récupérer les vraies coordonnées
  // depuis Supabase (voir fetchCvContact) : le PDF contient les valeurs de
  // remplacement de content/profile.ts.
  const [contactMissing, setContactMissing] = useState(false)

  const locale = CV_LOCALES[language]
  const defaultTitle = locale.titles[pitch]
  const defaultPitch = locale.pitches[pitch]

  async function generatePdf() {
    setGenerating(true)
    try {
      const contact = await fetchCvContact(language)
      setContactMissing(contact === null)
      const cv: CvData = {
        ...locale.cv,
        ...contact,
        sidebar: resolveSidebar(pitch, language),
        experiences: resolveExperiences(pitch, language),
        sideProjects: resolveSideProjects(pitch, language),
        title: title.trim() === "" ? defaultTitle : title.trim(),
        pitch: pitchText.trim() === "" ? defaultPitch : pitchText.trim(),
        photo: cvPhoto,
      }
      await downloadPdf(
        <CvDocument cv={cv} />,
        `cv-myriam-mira-${language}-${pitch}.pdf`,
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
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
              <option value="hybrid">
                Cheffe de projet IT & développeuse web
              </option>
              <option value="pm">Cheffe de projet IT</option>
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
        <label>
          Texte de l'accroche (vide = texte par défaut)
          <textarea
            value={pitchText}
            placeholder={defaultPitch}
            onChange={e => setPitchText(e.target.value)}
          />
        </label>
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
