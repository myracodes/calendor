import { type RefObject, useLayoutEffect, useRef, useState } from "react"

/**
 * La largeur en px de l'élément pointé par la ref, suivie quand elle change
 * (rotation du téléphone, fenêtre redimensionnée) ; 0 avant la première mesure.
 * L'élément doit être affiché dès le montage du composant.
 */
export function useElementWidth<Element extends HTMLElement>(): [
  RefObject<Element | null>,
  number,
] {
  const ref = useRef<Element>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = ref.current
    if (element === null) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}
