/** Portion sélectionnée d'un texte ; start === end pour un simple curseur. */
export interface TextSelection {
  start: number
  end: number
}

/** Texte après modification, et position où replacer le curseur. */
export interface TextEdit {
  text: string
  caret: number
}

/** Remplace la sélection par `inserted` (ou l'insère au curseur), comme une frappe au clavier. */
export function insertText(
  text: string,
  selection: TextSelection,
  inserted: string,
): TextEdit {
  return {
    text: text.slice(0, selection.start) + inserted + text.slice(selection.end),
    caret: selection.start + inserted.length,
  }
}

/** Efface la sélection, ou à défaut le caractère avant le curseur, comme la touche ⌫. */
export function deleteBackward(
  text: string,
  selection: TextSelection,
): TextEdit {
  if (selection.start !== selection.end) return insertText(text, selection, "")
  if (selection.start === 0) return { text, caret: 0 }
  return insertText(
    text,
    { start: selection.start - 1, end: selection.start },
    "",
  )
}
