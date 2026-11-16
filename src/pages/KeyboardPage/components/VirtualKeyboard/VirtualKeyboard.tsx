import { type MouseEvent, useState } from "react"
import { KEYBOARD_PAGES } from "../../../../keyboard/layouts"
import type {
  FunctionKeyAction,
  KeyboardKey,
  KeyboardPage,
} from "../../../../keyboard/types"
import "./VirtualKeyboard.css"

interface VirtualKeyboardProps {
  /** Texte tapé par une touche : un caractère, une espace ou un retour à la ligne. */
  onInput: (inserted: string) => void
  onBackspace: () => void
}

interface FunctionKeyDisplay {
  label: string
  /** Nom de la touche pour les lecteurs d'écran et l'infobulle, sans les flèches du libellé. */
  name: string
}

const FUNCTION_KEYS: Record<
  Exclude<FunctionKeyAction, "switchPage">,
  FunctionKeyDisplay
> = {
  shift: { label: "⇧ Maj", name: "Maj" },
  capsLock: { label: "⇪ Verr. maj", name: "Verr. maj" },
  backspace: { label: "⌫", name: "Effacer le caractère précédent" },
  enter: { label: "↵ Entrée", name: "Entrée" },
  space: { label: "Espace", name: "Espace" },
}

// La touche affichée sur une page mène à l'autre page.
const SWITCH_PAGE_KEYS: Record<KeyboardPage, FunctionKeyDisplay> = {
  letters: { label: "&@#", name: "Caractères spéciaux" },
  symbols: { label: "abc", name: "Lettres et accents" },
}

// Sans ça, cliquer une touche retire le focus de la zone de texte, et le
// curseur n'y est plus visible.
function keepTextFocus(e: MouseEvent) {
  e.preventDefault()
}

/** Clavier AZERTY cliquable, sur deux pages : lettres et accents, puis caractères spéciaux. */
export function VirtualKeyboard({
  onInput,
  onBackspace,
}: VirtualKeyboardProps) {
  const [page, setPage] = useState<KeyboardPage>("letters")
  // Maj ne vaut que pour le caractère suivant, Verr. maj jusqu'à ce qu'on la
  // relâche.
  const [shift, setShift] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  // Comme sur un clavier physique, Maj avec Verr. maj repasse en minuscules.
  const uppercase = shift !== capsLock

  function displayedCharacter(character: string): string {
    return uppercase ? character.toLocaleUpperCase("fr") : character
  }

  function typeCharacter(character: string) {
    onInput(displayedCharacter(character))
    setShift(false)
  }

  function pressFunctionKey(action: FunctionKeyAction) {
    switch (action) {
      case "shift":
        setShift(!shift)
        break
      case "capsLock":
        setCapsLock(!capsLock)
        break
      case "backspace":
        onBackspace()
        break
      case "enter":
        onInput("\n")
        break
      case "space":
        onInput(" ")
        break
      case "switchPage":
        setPage(page === "letters" ? "symbols" : "letters")
        break
    }
  }

  // État enfoncé des modificateurs ; undefined pour les autres touches, qui
  // ne restent pas enfoncées.
  function pressedState(action: FunctionKeyAction): boolean | undefined {
    if (action === "shift") return shift
    if (action === "capsLock") return capsLock
    return undefined
  }

  function renderKey(keyboardKey: KeyboardKey) {
    if (keyboardKey.type === "character") {
      return (
        <button
          key={keyboardKey.character}
          type="button"
          className="virtual-keyboard-key"
          onMouseDown={keepTextFocus}
          onClick={() => typeCharacter(keyboardKey.character)}
        >
          {displayedCharacter(keyboardKey.character)}
        </button>
      )
    }

    const { action } = keyboardKey
    const display =
      action === "switchPage" ? SWITCH_PAGE_KEYS[page] : FUNCTION_KEYS[action]
    const variant = action === "space" ? "space" : "function"
    return (
      <button
        key={action}
        type="button"
        className={`virtual-keyboard-key virtual-keyboard-key--${variant}`}
        aria-label={display.name}
        title={display.name}
        aria-pressed={pressedState(action)}
        onMouseDown={keepTextFocus}
        onClick={() => pressFunctionKey(action)}
      >
        {display.label}
      </button>
    )
  }

  return (
    <div className="virtual-keyboard" role="group" aria-label="Clavier">
      {KEYBOARD_PAGES[page].map((row, rowIndex) => (
        <div key={rowIndex} className="virtual-keyboard-row">
          {row.map(renderKey)}
        </div>
      ))}
    </div>
  )
}
