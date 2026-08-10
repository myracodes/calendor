import { type DocumentProps, pdf } from "@react-pdf/renderer"
import type { ReactElement } from "react"

/**
 * Génère côté client le PDF du document react-pdf donné, puis déclenche son
 * téléchargement par le navigateur sous le nom de fichier fourni.
 * Utilisée par toutes les pages "Générer le PDF" de l'app.
 */
export async function downloadPdf(
  pdfDocument: ReactElement<DocumentProps>,
  fileName: string,
): Promise<void> {
  const blob = await pdf(pdfDocument).toBlob()
  // Lien temporaire vers le blob, cliqué programmatiquement : le seul moyen,
  // côté navigateur, de déclencher un téléchargement en imposant le nom de fichier.
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
