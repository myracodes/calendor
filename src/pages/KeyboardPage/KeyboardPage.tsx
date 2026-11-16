import { useLayoutEffect, useRef } from "react"
import {
  deleteBackward,
  insertText,
  type TextEdit,
  type TextSelection,
} from "../../keyboard/editText"
import { ActionButton } from "../../shared/ActionButton/ActionButton"
import { Card } from "../../shared/Card/Card"
import { useToast } from "../../shared/Toast/useToast"
import { usePersistentState } from "../../shared/usePersistentState"
import { VirtualKeyboard } from "./components/VirtualKeyboard/VirtualKeyboard"
import "./KeyboardPage.css"

// Taper un texte à la souris, puis le copier sans toucher au clavier.
export function KeyboardPage() {
  const [text, setText] = usePersistentState("keyboard.text", "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // Position du curseur après une frappe du clavier virtuel : React place le
  // curseur en fin de texte quand il remplace la valeur de la zone de texte,
  // il faut donc le remettre à sa place une fois le rendu fait.
  const pendingCaretRef = useRef<number | null>(null)
  const { toast, showToast } = useToast()

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    const caret = pendingCaretRef.current
    if (textarea === null || caret === null) return
    pendingCaretRef.current = null
    textarea.focus()
    textarea.setSelectionRange(caret, caret)
  }, [text])

  // Applique une modification à l'endroit du curseur (ou de la sélection) de la zone de texte.
  function editAtCaret(edit: (selection: TextSelection) => TextEdit) {
    const textarea = textareaRef.current
    if (textarea === null) return
    const result = edit({
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    })
    // Texte inchangé (⌫ en début de texte…) : pas de rendu, donc pas d'effet
    // pour replacer le curseur, on le fait tout de suite.
    if (result.text === text) {
      textarea.focus()
      textarea.setSelectionRange(result.caret, result.caret)
      return
    }
    pendingCaretRef.current = result.caret
    setText(result.text)
  }

  function typeText(inserted: string) {
    editAtCaret(selection => insertText(text, selection, inserted))
  }

  function deleteCharacter() {
    editAtCaret(selection => deleteBackward(text, selection))
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text)
      showToast("success", "Texte copié dans le presse-papiers.")
    } catch (error) {
      console.error(error)
      showToast(
        "error",
        "Copie impossible : le navigateur refuse l'accès au presse-papiers.",
      )
    }
  }

  function clearText() {
    const previousText = text
    setText("")
    showToast("success", "Texte effacé.", {
      label: "Annuler",
      onClick: () => setText(previousText),
    })
  }

  return (
    <>
      <Card variantColor="sky">
        <h2>Texte</h2>
        <textarea
          ref={textareaRef}
          className="keyboard-page-text"
          aria-label="Texte"
          placeholder="Commencer à taper…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="keyboard-page-actions">
          <ActionButton
            variant="secondary"
            disabled={text === ""}
            onClick={clearText}
          >
            Effacer
          </ActionButton>
          <ActionButton disabled={text === ""} onClick={copyText}>
            Copier
          </ActionButton>
        </div>
      </Card>

      <Card variantColor="candy">
        <h2>Clavier</h2>
        <VirtualKeyboard onInput={typeText} onBackspace={deleteCharacter} />
      </Card>

      {toast}
    </>
  )
}
