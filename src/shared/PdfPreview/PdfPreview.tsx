import { type DocumentProps, pdf } from "@react-pdf/renderer"
import { type ReactElement, useEffect, useState } from "react"
import "./PdfPreview.css"

// Délai entre le dernier changement et la régénération : évite de refaire le
// PDF (quelques centaines de ms) à chaque lettre tapée dans un champ.
const REGENERATION_DELAY_MS = 400

interface PdfPreviewProps {
  /** Document à afficher, ou null tant que ses données ne sont pas prêtes. Le mémoïser : chaque nouvelle référence relance une génération. */
  pdfDocument: ReactElement<DocumentProps> | null
  /** Titre de l'iframe, pour les lecteurs d'écran (ex. "Aperçu du CV"). */
  title: string
}

/**
 * Aperçu d'un document react-pdf : le même PDF que celui téléchargé, généré
 * côté client puis affiché dans le visualiseur PDF du navigateur. Masqué sur
 * petit écran, où ces visualiseurs s'affichent mal en iframe.
 */
export function PdfPreview({ pdfDocument, title }: PdfPreviewProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (pdfDocument === null) return
    // Une génération plus récente rend celle-ci obsolète : ne pas afficher son résultat.
    let outdated = false
    const timer = setTimeout(async () => {
      try {
        const blob = await pdf(pdfDocument).toBlob()
        if (outdated) return
        setUrl(URL.createObjectURL(blob))
        setFailed(false)
      } catch (error) {
        console.error(error)
        if (!outdated) setFailed(true)
      }
    }, REGENERATION_DELAY_MS)
    return () => {
      outdated = true
      clearTimeout(timer)
    }
  }, [pdfDocument])

  // Libère le blob précédent dès qu'il est remplacé par le suivant.
  useEffect(() => {
    if (url === null) return
    return () => URL.revokeObjectURL(url)
  }, [url])

  return (
    <aside className="pdf-preview">
      {failed && (
        <p className="hint">
          L'aperçu n'a pas pu être régénéré (voir la console) : il montre la
          dernière version valide.
        </p>
      )}
      {url === null ? (
        <p className="hint">Génération de l'aperçu…</p>
      ) : (
        // #view=FitH : la page occupe toute la largeur dans le visualiseur de Chrome/Firefox.
        <iframe
          className="pdf-preview-frame"
          src={`${url}#view=FitH`}
          title={title}
        />
      )}
    </aside>
  )
}
