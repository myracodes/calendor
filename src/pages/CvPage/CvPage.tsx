import { useEffect, useMemo, useState } from "react"
import cvPhoto from "../../assets/images/cv-photo.jpg"
import {
  CV_LOCALES,
  resolveExperiences,
  resolveSidebar,
  resolveSideProjects,
} from "../../cv/buildLocale"
import { fetchCvContact } from "../../cv/fetchCvContact"
import type { CvContact, CvData, CvLanguage, CvPitch } from "../../cv/types"
import { CvDocument } from "../../pdf/cv/CvDocument"
import { downloadPdf } from "../../pdf/shared/downloadPdf"
import { ActionButton } from "../../shared/ActionButton/ActionButton"
import { Alert } from "../../shared/Alert/Alert"
import { Card } from "../../shared/Card/Card"
import { PdfPreview } from "../../shared/PdfPreview/PdfPreview"
import { usePersistentState } from "../../shared/usePersistentState"
import "./CvPage.css"

// En dev, le CV généré peut ne pas contenir les vraies données (Supabase non
// configuré ou session absente, voir fetchCvContact) : marquer le fichier et
// l'interface pour éviter de partager un PDF de test par erreur.
const isDevEnvironment = import.meta.env.DEV

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
  // Ids des lignes d'infos pratiques (cv.personalInfo) décochées manuellement.
  const [hiddenInfoLines, setHiddenInfoLines] = usePersistentState<string[]>(
    "cv.hiddenInfoLines",
    [],
  )
  // Masque la section "Activités" de la sidebar, décochée manuellement.
  const [hideActivities, setHideActivities] = usePersistentState(
    "cv.hideActivities",
    false,
  )
  const [generating, setGenerating] = useState(false)
  // Vraies coordonnées depuis Supabase (voir fetchCvContact), rechargées à
  // chaque changement de langue : undefined pendant le chargement, null si
  // indisponibles — le PDF contient alors les valeurs de remplacement de
  // content/profile.ts.
  const [contact, setContact] = useState<CvContact | null | undefined>(
    undefined,
  )

  useEffect(() => {
    setContact(undefined)
    // Une réponse arrivée après un changement de langue ne doit pas écraser la nouvelle.
    let outdated = false
    fetchCvContact(language).then(fetchedContact => {
      if (!outdated) setContact(fetchedContact)
    })
    return () => {
      outdated = true
    }
  }, [language])

  const locale = CV_LOCALES[language]
  const defaultTitle = locale.titles[pitch]
  const defaultPitch = locale.pitches[pitch]

  function toggleHiddenInfoLine(id: string, hidden: boolean) {
    setHiddenInfoLines(
      hidden
        ? [...hiddenInfoLines, id]
        : hiddenInfoLines.filter(hiddenId => hiddenId !== id),
    )
  }

  // Le même document sert à l'aperçu et au téléchargement. Mémoïsé : l'aperçu
  // ne se régénère que si un paramètre change (ou au rechargement à chaud
  // d'un fichier de src/cv/content/, qui relance les useMemo).
  const cvDocument = useMemo(() => {
    if (contact === undefined) return null
    const cv: CvData = {
      ...locale.cv,
      ...contact,
      personalInfo: (contact?.personalInfo ?? locale.cv.personalInfo).filter(
        line => !hiddenInfoLines.includes(line.id),
      ),
      sidebar: resolveSidebar(
        pitch,
        language,
        hideActivities ? ["activities"] : [],
      ),
      experiences: resolveExperiences(pitch, language),
      sideProjects: resolveSideProjects(pitch, language),
      title: title.trim() === "" ? defaultTitle : title.trim(),
      pitch: pitchText.trim() === "" ? defaultPitch : pitchText.trim(),
      photo: cvPhoto,
    }
    return <CvDocument cv={cv} />
  }, [
    contact,
    locale,
    hiddenInfoLines,
    pitch,
    language,
    hideActivities,
    title,
    defaultTitle,
    pitchText,
    defaultPitch,
  ])

  async function generatePdf() {
    if (cvDocument === null) return
    setGenerating(true)
    try {
      await downloadPdf(
        cvDocument,
        `cv-myriam-mira-${language}-${pitch}${
          isDevEnvironment ? "-TEST-DO-NOT-SHARE" : ""
        }.pdf`,
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="cv-page">
      <div>
        <Card variantColor="sky">
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
          <div className="row">
            {locale.cv.personalInfo.map(line => (
              <label key={line.id} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={!hiddenInfoLines.includes(line.id)}
                  onChange={e =>
                    toggleHiddenInfoLine(line.id, !e.target.checked)
                  }
                />
                {line.text}
              </label>
            ))}
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={!hideActivities}
                onChange={e => setHideActivities(!e.target.checked)}
              />
              Section "Activités"
            </label>
          </div>
        </Card>

        {contact === null && (
          <p className="hint">
            Les vraies coordonnées n'ont pas pu être récupérées (Supabase non
            configuré, session absente, ou langue absente de la table
            cv_contact). Depuis le site déployé, connecte-toi puis recharge la
            page.
          </p>
        )}

        {isDevEnvironment && (
          <Alert variantColor="danger" title="Mode développement">
            Le PDF généré ne contiendra pas les vraies données.
          </Alert>
        )}

        <ActionButton
          busy={generating || cvDocument === null}
          onClick={generatePdf}
        >
          {generating
            ? "Génération…"
            : `Générer le PDF (${language === "fr" ? "français" : "anglais"})`}
        </ActionButton>
      </div>

      <PdfPreview pdfDocument={cvDocument} title="Aperçu du CV" />
    </div>
  )
}
