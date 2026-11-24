import { useEffect } from "react"
import { HashRouter, Link, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import { AuthProvider } from "./auth/AuthProvider"
import { useAuth } from "./auth/useAuth"
import { HOME_PATH } from "./home/homePath"
import { BatchCookingPage } from "./pages/BatchCookingPage/BatchCookingPage"
import { BooksPage } from "./pages/BooksPage/BooksPage"
import { BudgetPage } from "./pages/BudgetPage/BudgetPage"
import { CalendarsPage } from "./pages/CalendarsPage/CalendarsPage"
import { CourrierPage } from "./pages/CourrierPage/CourrierPage"
import { CoursesPage } from "./pages/CoursesPage/CoursesPage"
import { CvPage } from "./pages/CvPage/CvPage"
import { GiftIdeasPage } from "./pages/GiftIdeasPage/GiftIdeasPage"
import { HomePage } from "./pages/HomePage/HomePage"
import { KeyboardPage } from "./pages/KeyboardPage/KeyboardPage"
import { LoginPage } from "./pages/LoginPage/LoginPage"
import { PaperFactoryPage } from "./pages/PaperFactoryPage/PaperFactoryPage"
import { PlanningPage } from "./pages/PlanningPage/PlanningPage"
import { RecommendationsPage } from "./pages/RecommendationsPage/RecommendationsPage"
import { SeriesPage } from "./pages/SeriesPage/SeriesPage"
import { WeightPage } from "./pages/WeightPage/WeightPage"
import { LastPageRedirect, LastPageTracker } from "./shared/LastPage/LastPage"
import { LogoutButton } from "./shared/LogoutButton/LogoutButton"
import { Navbar } from "./shared/Navbar/Navbar"
import { useAccountKeySequence } from "./shortcuts/useAccountKeySequence"
import { useKeySequence } from "./shortcuts/useKeySequence"
import { useLongPress } from "./shortcuts/useLongPress"
import { isSupabaseConfigured } from "./supabase/client"
import { COMMIT_HASH } from "./version"
import { WEIGHT_PATH } from "./weight/weightPath"

// Le verrou : l'app ne s'affiche qu'avec une session valide, en dev comme en
// prod, dès que Supabase est configuré (voir isSupabaseConfigured).
function AppGate() {
  const { session, loading } = useAuth()
  // Évite un flash de l'écran de connexion pendant la relecture de la session.
  if (loading) return null
  if (isSupabaseConfigured && session === null) return <LoginPage />
  return <AppContent />
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  )
}

const VERSION_PRESS_TO_UNLOCK_MS = 2000

function AppContent() {
  // Pages cachées (Poids) : visibles une fois la séquence de touches du
  // compte tapée, ou la version maintenue enfoncée, jusqu'au prochain
  // rechargement de l'app. Réservées aux comptes qui ont une séquence en
  // base (supabase/shortcuts.sql) : sans elle, l'appui long ne fait rien non
  // plus.
  const keySequence = useAccountKeySequence()
  const keySequenceTyped = useKeySequence(keySequence)
  const [versionPressed, versionPressHandlers] = useLongPress(
    VERSION_PRESS_TO_UNLOCK_MS,
  )
  const unlockedByPress = versionPressed && keySequence !== null
  const secretPagesUnlocked = keySequenceTyped || unlockedByPress

  // Le pied de page est loin du menu : remonte en haut de la page pour
  // montrer l'onglet qui vient d'apparaître.
  useEffect(() => {
    if (unlockedByPress) window.scrollTo({ top: 0, behavior: "smooth" })
  }, [unlockedByPress])

  return (
    <HashRouter>
      <LastPageTracker />
      <main className="app">
        <div className="app-header">
          <div className="app-title-row">
            <h1>
              <Link to={HOME_PATH} className="app-title-link">
                Calendor
              </Link>
            </h1>
            <LogoutButton />
          </div>
          <Navbar showSecretLinks={secretPagesUnlocked} />
        </div>

        <Routes>
          <Route path="/" element={<LastPageRedirect />} />
          <Route path={HOME_PATH} element={<HomePage />} />
          <Route path="/calendars" element={<CalendarsPage />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/batch-cooking" element={<BatchCookingPage />} />
          <Route path="/paper-factory" element={<PaperFactoryPage />} />
          <Route path="/courrier" element={<CourrierPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/cv" element={<CvPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/gift-ideas" element={<GiftIdeasPage />} />
          <Route path="/keyboard" element={<KeyboardPage />} />
          {/* Encore verrouillée (adresse tapée à la main, ou rechargement sur
              la page) : retour à l'accueil. */}
          <Route
            path={WEIGHT_PATH}
            element={
              secretPagesUnlocked ? (
                <WeightPage />
              ) : (
                <Navigate to={HOME_PATH} replace />
              )
            }
          />
        </Routes>

        <footer className="footer">
          <p className="footer-version" {...versionPressHandlers}>
            version {COMMIT_HASH}
          </p>
        </footer>
      </main>
    </HashRouter>
  )
}
