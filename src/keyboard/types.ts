/** Page du clavier affichée : lettres et accents, ou caractères spéciaux. */
export type KeyboardPage = "letters" | "symbols"

/** Touche qui ne tape pas le caractère écrit dessus (modificateur, effacement, changement de page…). */
export type FunctionKeyAction =
  | "shift"
  | "capsLock"
  | "backspace"
  | "enter"
  | "space"
  | "switchPage"

export type KeyboardKey =
  | { type: "character"; character: string }
  | { type: "function"; action: FunctionKeyAction }
