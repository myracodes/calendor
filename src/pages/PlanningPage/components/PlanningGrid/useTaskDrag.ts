import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react"
import { dayNumber } from "../../../../dates"
import { sortOrderBefore } from "../../../../planning/order"
import { resizedDraft, shiftedDraft } from "../../../../planning/taskDates"
import type {
  PlanningTask,
  PlanningTaskDraft,
} from "../../../../planning/types"

/**
 * Déplacer la tâche entière (vers un autre jour, ou avant ou après une autre
 * tâche), ou tirer son bord du bas pour changer son dernier jour.
 */
export type DragKind = "move" | "resize"

// Distance (px) à partir de laquelle un appui devient un glisser, et non un clic.
const DRAG_THRESHOLD = 4
// Au doigt, il faut garder l'appui ce temps-là (ms) avant de déplacer une
// tâche : un glissement plus rapide fait défiler la page, comme ailleurs.
const LONG_PRESS_MS = 400
// Pendant l'appui long, un doigt qui bouge plus que ça (px) fait défiler la page.
const TOUCH_SLOP = 10
// Le pointeur près du haut ou du bas de la fenêtre (px) fait défiler la page,
// pour emmener une tâche vers des jours hors de l'écran…
const AUTO_SCROLL_EDGE = 48
// … d'au plus autant de pixels par image, plus vite près du bord.
const AUTO_SCROLL_MAX_SPEED = 14

/**
 * Le jour de la ligne sous le pointeur (attribut data-planning-day de
 * PlanningDayRow, sous les tâches), ou null hors de la grille.
 */
function dayAt(x: number, y: number): string | null {
  for (const element of document.elementsFromPoint(x, y)) {
    if (element instanceof HTMLElement && element.dataset.planningDay) {
      return element.dataset.planningDay
    }
  }
  return null
}

/**
 * La tâche devant laquelle poser celle qu'on déplace, d'après le pointeur :
 * la première, de gauche à droite, parmi celles qui commencent le jour
 * `startDate` (attributs data-task-* de PlanningTaskBlock), dont le milieu
 * est à droite du pointeur ; null pour la poser après toutes.
 */
function taskAfterPointer(
  grid: HTMLElement | null,
  startDate: string,
  movingId: string,
  x: number,
): string | null {
  if (grid === null) return null
  const sameDay = [...grid.querySelectorAll<HTMLElement>("[data-task-id]")]
    .filter(
      element =>
        element.dataset.taskStart === startDate &&
        element.dataset.taskId !== movingId,
    )
    .map(element => ({
      id: element.dataset.taskId ?? null,
      rect: element.getBoundingClientRect(),
    }))
    .sort((a, b) => a.rect.left - b.rect.left)
  const after = sameDay.find(({ rect }) => rect.left + rect.width / 2 > x)
  return after?.id ?? null
}

function autoScrollSpeed(y: number): number {
  if (y < AUTO_SCROLL_EDGE) {
    return -AUTO_SCROLL_MAX_SPEED * (1 - y / AUTO_SCROLL_EDGE)
  }
  const fromBottom = window.innerHeight - y
  if (fromBottom < AUTO_SCROLL_EDGE) {
    return AUTO_SCROLL_MAX_SPEED * (1 - fromBottom / AUTO_SCROLL_EDGE)
  }
  return 0
}

function samePlace(
  a: Pick<PlanningTaskDraft, "startDate" | "endDate" | "sortOrder">,
  b: Pick<PlanningTaskDraft, "startDate" | "endDate" | "sortOrder">,
): boolean {
  return (
    a.startDate === b.startDate &&
    a.endDate === b.endDate &&
    (a.sortOrder ?? null) === (b.sortOrder ?? null)
  )
}

/** Rien n'a changé : ni les dates, ni la place parmi les tâches du jour. */
function isUnchanged(task: PlanningTask, draft: PlanningTaskDraft): boolean {
  return samePlace(task, {
    ...draft,
    sortOrder: draft.sortOrder ?? task.sortOrder,
  })
}

/**
 * Glisser-déposer des tâches d'un jour à l'autre, ou avant ou après une autre
 * tâche, à la souris comme au doigt (appui long). `preview` donne les dates et
 * la place de la tâche en cours de geste, puis pendant son enregistrement,
 * pour qu'elle reste où on l'a lâchée. `onDrop` ne doit pas rejeter : il
 * affiche lui-même son erreur, la tâche revenant alors à sa place.
 */
export function useTaskDrag(
  gridRef: RefObject<HTMLElement | null>,
  tasks: PlanningTask[],
  onDrop: (task: PlanningTask, draft: PlanningTaskDraft) => Promise<void>,
) {
  const [preview, setPreview] = useState<PlanningTaskDraft | null>(null)
  // Fin du geste en cours (écouteurs retirés), pour l'arrêter au démontage.
  const stopRef = useRef<(() => void) | null>(null)
  // Un enregistrement est en cours : pas de nouveau geste avant sa fin.
  const savingRef = useRef(false)
  // Le geste vient de finir : le clic qui suit le lâcher n'ouvre pas la tâche.
  const clickSuppressedRef = useRef(false)
  // Dernières versions de onDrop, que la page recrée à chaque rendu, et des
  // tâches, pour un geste commencé avant leur dernier changement.
  const onDropRef = useRef(onDrop)
  const tasksRef = useRef(tasks)
  useEffect(() => {
    onDropRef.current = onDrop
    tasksRef.current = tasks
  }, [onDrop, tasks])

  useEffect(() => () => stopRef.current?.(), [])

  async function drop(task: PlanningTask, draft: PlanningTaskDraft) {
    if (isUnchanged(task, draft)) {
      setPreview(null)
      return
    }
    savingRef.current = true
    try {
      await onDropRef.current(task, draft)
    } finally {
      savingRef.current = false
      setPreview(null)
    }
  }

  function start(event: ReactPointerEvent, task: PlanningTask, kind: DragKind) {
    if (event.pointerType === "mouse" && event.button !== 0) return
    if (stopRef.current !== null || savingRef.current) return
    const grabbedDay = dayAt(event.clientX, event.clientY)
    if (grabbedDay === null) return

    // La poignée du bas ne fait pas défiler la page (touch-action: none) : au
    // doigt, elle s'étire tout de suite, sans appui long.
    const waitsForLongPress = event.pointerType === "touch" && kind === "move"
    const { pointerId } = event
    const startX = event.clientX
    const startY = event.clientY
    let pointerX = startX
    let pointerY = startY
    const grabbedDayNumber = dayNumber(grabbedDay)
    let pointedDay: string = grabbedDay
    let active = false
    let draft = shiftedDraft(task, 0)
    let longPressTimer: number | undefined
    let scrollFrame: number | undefined
    clickSuppressedRef.current = false

    // Le jour sous le pointeur donne les dates ; pour un déplacement, sa
    // position dans la ligne donne aussi la place parmi les tâches du jour.
    function update() {
      pointedDay = dayAt(pointerX, pointerY) ?? pointedDay
      let next: PlanningTaskDraft
      if (kind === "move") {
        next = shiftedDraft(task, dayNumber(pointedDay) - grabbedDayNumber)
        const beforeId = taskAfterPointer(
          gridRef.current,
          next.startDate,
          task.id,
          pointerX,
        )
        next.sortOrder = sortOrderBefore(
          tasksRef.current,
          task,
          next.startDate,
          beforeId,
        )
      } else {
        next = resizedDraft(task, pointedDay)
      }
      if (samePlace(next, draft)) return
      draft = next
      setPreview(next)
    }

    function autoScroll() {
      const speed = autoScrollSpeed(pointerY)
      if (speed !== 0) {
        window.scrollBy(0, speed)
        update()
      }
      scrollFrame = requestAnimationFrame(autoScroll)
    }

    function activate() {
      active = true
      clickSuppressedRef.current = true
      setPreview(draft)
      // Petit retour au doigt : la tâche est prise (sans effet sur iOS).
      if (event.pointerType === "touch") navigator.vibrate?.(10)
      scrollFrame = requestAnimationFrame(autoScroll)
    }

    function onPointerMove(moveEvent: PointerEvent) {
      if (moveEvent.pointerId !== pointerId) return
      pointerX = moveEvent.clientX
      pointerY = moveEvent.clientY
      if (!active) {
        const distance = Math.hypot(pointerX - startX, pointerY - startY)
        if (waitsForLongPress) {
          // Le doigt a bougé avant la fin de l'appui long : il fait défiler.
          if (distance > TOUCH_SLOP) stop()
          return
        }
        if (distance < DRAG_THRESHOLD) return
        activate()
      }
      update()
    }

    function onPointerUp(upEvent: PointerEvent) {
      if (upEvent.pointerId !== pointerId) return
      const dropped = active
      stop(false)
      if (!dropped) return
      // Le clic qui suit le lâcher arrive juste après : on le laisse passer
      // (ignoré), puis les clics redeviennent normaux.
      window.setTimeout(() => {
        clickSuppressedRef.current = false
      }, 0)
      drop(task, draft)
    }

    function onKeyDown(keyEvent: KeyboardEvent) {
      if (keyEvent.key === "Escape") stop()
    }

    // Une fois la tâche prise au doigt, le glissement la déplace au lieu de
    // faire défiler la page.
    function preventTouchScroll(touchEvent: TouchEvent) {
      if (active) touchEvent.preventDefault()
    }

    // L'appui long ouvrirait sinon le menu contextuel (Android).
    function preventContextMenu(menuEvent: Event) {
      menuEvent.preventDefault()
    }

    function stop(clearPreview = true) {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerCancel)
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("touchmove", preventTouchScroll)
      window.removeEventListener("contextmenu", preventContextMenu)
      window.clearTimeout(longPressTimer)
      if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame)
      stopRef.current = null
      if (clearPreview) setPreview(null)
    }

    function onPointerCancel(cancelEvent: PointerEvent) {
      if (cancelEvent.pointerId === pointerId) stop()
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerCancel)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("touchmove", preventTouchScroll, { passive: false })
    if (event.pointerType === "touch") {
      window.addEventListener("contextmenu", preventContextMenu)
    }
    if (waitsForLongPress) {
      longPressTimer = window.setTimeout(activate, LONG_PRESS_MS)
    }
    stopRef.current = stop
  }

  /** Vrai pour le clic qui suit un glisser-déposer : il ne doit pas ouvrir la tâche. */
  function isClickSuppressed(): boolean {
    return clickSuppressedRef.current
  }

  return { preview, start, isClickSuppressed }
}
