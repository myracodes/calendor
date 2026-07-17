import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import { AuthProvider } from "./auth/AuthProvider"
import { useAuth } from "./auth/useAuth"
import { Navbar } from "./components/Navbar/Navbar"
import { LoginPage } from "./pages/LoginPage/LoginPage"
import { isAuthRequired } from "./supabase/client"
import { BatchCookingPage } from "./pages/BatchCookingPage/BatchCookingPage"
import { BudgetPage } from "./pages/BudgetPage/BudgetPage"
import { BujoFactoryPage } from "./pages/BujoFactoryPage/BujoFactoryPage"
import { CalendarsPage } from "./pages/CalendarsPage/CalendarsPage"
import { CourrierPage } from "./pages/CourrierPage/CourrierPage"
import { CoursesPage } from "./pages/CoursesPage/CoursesPage"
import { CvPage } from "./pages/CvPage/CvPage"
import { COMMIT_HASH } from "./version"

// Le verrou : l'app ne s'affiche qu'avec une session valide. Il ne joue qu'en
// build de prod, et seulement si Supabase est configuré (voir isAuthRequired).
function AppGate() {
  const { session, loading } = useAuth()
  // Évite un flash de l'écran de connexion pendant la relecture de la session.
  if (loading) return null
  if (isAuthRequired && session === null) return <LoginPage />
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
        </Routes>

        <footer className="footer">
          <p>version {COMMIT_HASH}</p>
        </footer>
      </main>
    </HashRouter>
  )
}
