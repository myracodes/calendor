import { useState } from "react"
import { addDays, todayIso } from "../../dates"
import { DEFAULT_TASK_CATEGORY } from "../../planning/categories"
import { neighborsOf } from "../../planning/order"
import { EXTENSION_DAYS, initialRange } from "../../planning/range"
import { duplicateDraft } from "../../planning/taskDates"
import type { PlanningTask, PlanningTaskDraft } from "../../planning/types"
import { usePlanning } from "../../planning/usePlanning"
import { longDayTitle, taskPeriod } from "../../planning/wording"
import { Alert } from "../../shared/Alert/Alert"
import { Card } from "../../shared/Card/Card"
import { useToast } from "../../shared/Toast/useToast"
import { isSupabaseConfigured } from "../../supabase/client"
import { PlanningGrid } from "./components/PlanningGrid/PlanningGrid"
import { TaskDialog } from "./components/TaskDialog/TaskDialog"
import "./PlanningPage.css"

export function PlanningPage() {
  // Les tâches sont en base : sans Supabase, pas de verrou ni de session,
  // donc rien à afficher.
  if (!isSupabaseConfigured) {
    return (
      <Alert variantColor="danger" title="Base de données non configurée">
        Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir
        .env.example).
      </Alert>
    )
  }

  return <PlanningCard />
}

/** La fenêtre ouverte : l'ajout d'une tâche sur un jour, ou une tâche à modifier. */
type OpenDialog =
  | { kind: "add"; day: string }
  | { kind: "edit"; task: PlanningTask }

function toDraft(task: PlanningTask): PlanningTaskDraft {
  return {
    id: task.id,
    title: task.title,
    startDate: task.startDate,
    endDate: task.endDate,
    category: task.category,
    sortOrder: task.sortOrder,
  }
}

/**
 * Le message d'une tâche lâchée : déplacée vers d'autres jours, étendue par
 * sa poignée du bas, ou rangée avant ou après une autre tâche du même jour.
 */
function dropMessage(
  before: PlanningTask,
  saved: PlanningTask,
  tasks: PlanningTask[],
): string {
  const title = `« ${saved.title} »`
  if (saved.startDate !== before.startDate) {
    return `${title} déplacé ${taskPeriod(saved, "au")}.`
  }
  if (saved.endDate !== before.endDate) {
    return `${title} noté ${taskPeriod(saved)}.`
  }
  const { previous, next } = neighborsOf(tasks, saved)
  if (next !== undefined) return `${title} placé avant « ${next.title} ».`
  if (previous !== undefined) {
    return `${title} placé après « ${previous.title} ».`
  }
  return `${title} déplacé.`
}

// Les jours autour d'aujourd'hui, élargis par « Jours précédents » et
// « Jours suivants », et la fenêtre d'ajout ou de modification d'une tâche.
function PlanningCard() {
  const [today] = useState(todayIso)
  const [range, setRange] = useState(() => initialRange(today))
  const planning = usePlanning(range)
  const { toast, showToast } = useToast()
  const [dialog, setDialog] = useState<OpenDialog | null>(null)

  if (!planning.loaded) {
    if (planning.loadError === null) {
      return <p className="hint">Chargement du planning…</p>
    }
    return (
      <Alert variantColor="danger" title="Impossible de charger le planning">
        {planning.loadError}
      </Alert>
    )
  }

  async function add(draft: PlanningTaskDraft) {
    const saved = await planning.saveTask(draft)
    setDialog(null)
    showToast("success", `« ${saved.title} » ajouté ${taskPeriod(saved)}.`)
  }

  async function saveEditing(draft: PlanningTaskDraft) {
    const saved = await planning.saveTask(draft)
    setDialog(null)
    showToast("success", `« ${saved.title} » enregistré.`)
  }

  async function undoRemove(task: PlanningTask) {
    try {
      await planning.restoreTask(task)
    } catch (caught) {
      showToast(
        "error",
        `« ${task.title} » non restauré : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `« ${task.title} » restauré.`)
  }

  async function remove(task: PlanningTask) {
    await planning.removeTask(task.id)
    setDialog(null)
    showToast("success", `« ${task.title} » supprimé.`, {
      label: "Annuler",
      onClick: () => undoRemove(task),
    })
  }

  async function undoDuplicate(copy: PlanningTask) {
    try {
      await planning.removeTask(copy.id)
    } catch (caught) {
      showToast(
        "error",
        `Copie de « ${copy.title} » non retirée : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `Copie de « ${copy.title} » retirée.`)
  }

  async function duplicate(task: PlanningTask) {
    const copy = await planning.saveTask(duplicateDraft(task))
    showToast(
      "success",
      `« ${copy.title} » dupliqué ${taskPeriod(copy, "au")}.`,
      { label: "Annuler", onClick: () => undoDuplicate(copy) },
    )
  }

  async function undoDrop(original: PlanningTask) {
    try {
      await planning.saveTask(toDraft(original))
    } catch (caught) {
      showToast(
        "error",
        `« ${original.title} » non remis à sa place : ${(caught as Error).message}`,
      )
      return
    }
    showToast("info", `« ${original.title} » remis à sa place.`)
  }

  // Ne rejette pas (voir useTaskDrag) : l'erreur s'affiche ici, et la tâche
  // revient à sa place.
  async function drop(task: PlanningTask, draft: PlanningTaskDraft) {
    let saved: PlanningTask
    try {
      saved = await planning.saveTask(draft)
    } catch (caught) {
      showToast("error", (caught as Error).message)
      return
    }
    showToast("success", dropMessage(task, saved, planning.tasks), {
      label: "Annuler",
      onClick: () => undoDrop(task),
    })
  }

  function showEarlierDays() {
    setRange(previous => ({
      ...previous,
      from: addDays(previous.from, -EXTENSION_DAYS),
    }))
  }

  function showLaterDays() {
    setRange(previous => ({
      ...previous,
      to: addDays(previous.to, EXTENSION_DAYS),
    }))
  }

  return (
    <Card variantColor="sky">
      <h2>Planning</h2>
      <p className="hint">
        Clique sur un jour pour y noter une tâche. Glisse une tâche vers un
        autre jour, ou avant ou après une autre (au doigt : appui long), et tire
        son bord du bas pour l'étendre sur plusieurs jours.
      </p>
      {/* Échec du chargement des jours ajoutés : le planning déjà chargé
          reste affiché. */}
      {planning.loadError !== null && (
        <Alert variantColor="danger" title="Impossible de charger ces jours">
          {planning.loadError}
        </Alert>
      )}

      <button
        type="button"
        className="planning-more-days"
        onClick={showEarlierDays}
      >
        Jours précédents
      </button>
      <PlanningGrid
        range={range}
        today={today}
        tasks={planning.tasks}
        onAddOnDay={day => setDialog({ kind: "add", day })}
        onOpenTask={task => setDialog({ kind: "edit", task })}
        onDuplicateTask={duplicate}
        onDropTask={drop}
        showToast={showToast}
      />
      <button
        type="button"
        className="planning-more-days"
        onClick={showLaterDays}
      >
        Jours suivants
      </button>

      {dialog?.kind === "add" && (
        <TaskDialog
          heading={longDayTitle(dialog.day)}
          initialDraft={{
            id: null,
            title: "",
            startDate: dialog.day,
            endDate: dialog.day,
            category: DEFAULT_TASK_CATEGORY,
          }}
          saveLabel="Ajouter la tâche"
          onSave={add}
          onClose={() => setDialog(null)}
          showToast={showToast}
          toast={toast}
        />
      )}
      {dialog?.kind === "edit" && (
        <TaskDialog
          heading="Modifier la tâche"
          initialDraft={toDraft(dialog.task)}
          saveLabel="Enregistrer la tâche"
          onSave={saveEditing}
          onDelete={() => remove(dialog.task)}
          onClose={() => setDialog(null)}
          showToast={showToast}
          toast={toast}
        />
      )}
      {dialog === null && toast}
    </Card>
  )
}
