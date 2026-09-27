import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import { AuthProvider } from "./auth/AuthProvider"
import { useAuth } from "./auth/useAuth"
import { BatchCookingPage } from "./pages/BatchCookingPage/BatchCookingPage"
import { BudgetPage } from "./pages/BudgetPage/BudgetPage"
import { BujoFactoryPage } from "./pages/BujoFactoryPage/BujoFactoryPage"
import { CalendarsPage } from "./pages/CalendarsPage/CalendarsPage"
import { CourrierPage } from "./pages/CourrierPage/CourrierPage"
import { CoursesPage } from "./pages/CoursesPage/CoursesPage"
import { CvPage } from "./pages/CvPage/CvPage"
import { LoginPage } from "./pages/LoginPage/LoginPage"
import { SeriesPage } from "./pages/SeriesPage/SeriesPage"
import { Navbar } from "./shared/Navbar/Navbar"
import { isSupabaseConfigured } from "./supabase/client"
import { COMMIT_HASH } from "./version"

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

function AppContent() {
  return (
    <HashRouter>
      <main className="app">
        <div className="app-header">
          <h1>Calendor</h1>
          <Navbar />
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/calendars" replace />} />
          <Route path="/calendars" element={<CalendarsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/batch-cooking" element={<BatchCookingPage />} />
          <Route path="/bujo" element={<BujoFactoryPage />} />
          <Route path="/courrier" element={<CourrierPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/cv" element={<CvPage />} />
          <Route path="/series" element={<SeriesPage />} />
        </Routes>

        <footer className="footer">
          <p>version {COMMIT_HASH}</p>
        </footer>
      </main>
    </HashRouter>
  )
}
