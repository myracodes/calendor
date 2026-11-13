import { StyleSheet } from "@react-pdf/renderer"
import type { CalendarLanguage } from "../../calendar/languages"

// Polices des écritures absentes de Patrick Hand et Bad Script, pour les textes traduits
// (mois, jours, "Notes"). Chacune est utilisée seule, sans repli sur Patrick Hand : quand
// react-pdf réordonne une ligne de droite à gauche, il mélange les glyphes des deux polices
// et l'arabe devient illisible.
const SCRIPT_FONTS = StyleSheet.create({
  ar: { fontFamily: "Amiri" },
  zh: { fontFamily: "ZCOOLKuaiLe" },
})

/**
 * Style à ajouter après celui d'un texte traduit : remplace sa police pour l'arabe et
 * le chinois, ne change rien pour les langues en alphabet latin.
 */
export function languageFont(language: CalendarLanguage) {
  return language === "ar" || language === "zh" ? [SCRIPT_FONTS[language]] : []
}
