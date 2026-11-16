import type { FunctionKeyAction, KeyboardKey, KeyboardPage } from "./types"

/** Une touche par caractère de la chaîne, dans l'ordre. */
function characterKeys(row: string): KeyboardKey[] {
  return Array.from(row, character => ({ type: "character", character }))
}

function functionKey(action: FunctionKeyAction): KeyboardKey {
  return { type: "function", action }
}

// Commune aux deux pages, pour retrouver ces touches au même endroit.
const BOTTOM_ROW: KeyboardKey[] = [
  functionKey("switchPage"),
  functionKey("space"),
  functionKey("backspace"),
  functionKey("enter"),
]

/** Rangées de touches de chaque page du clavier, de haut en bas. */
export const KEYBOARD_PAGES: Record<KeyboardPage, KeyboardKey[][]> = {
  // Lettres dans l'ordre AZERTY ; chiffres et accents tapés directement,
  // sans Maj ni touche morte. Maj et Verr. maj passent lettres et accents
  // en majuscules (É, À, Ç…).
  letters: [
    characterKeys("1234567890"),
    characterKeys("azertyuiop"),
    [functionKey("capsLock"), ...characterKeys("qsdfghjklm")],
    [functionKey("shift"), ...characterKeys("wxcvbn',.")],
    characterKeys("àâæçéèêëîïôœùûüÿ"),
    BOTTOM_ROW,
  ],
  // Caractères spéciaux d'un clavier AZERTY Windows, une rangée par
  // modificateur, chacune dans l'ordre des touches (de gauche à droite, rangée
  // du haut d'abord), sans les chiffres, lettres et accents de la page
  // principale.
  symbols: [
    // Sans modificateur : ² & " ' ( - _ ) = de la rangée des chiffres, puis ^ $ * < , ; : !
    characterKeys("²&\"'(-_)=^$*<,;:!"),
    // Avec Maj
    characterKeys("°+¨£%µ>?./§"),
    // Avec AltGr (rangée des chiffres, puis € sur le E et ¤ sur le $)
    characterKeys("~#{[|`\\^@]}€¤"),
    // Typographie française absente du clavier Windows
    characterKeys("«»’…–—"),
    BOTTOM_ROW,
  ],
}
