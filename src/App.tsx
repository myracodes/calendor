import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import { Navbar } from "./components/Navbar/Navbar"
import { BatchCookingPage } from "./pages/BatchCookingPage/BatchCookingPage"
import { BudgetPage } from "./pages/BudgetPage/BudgetPage"
import { BujoFactoryPage } from "./pages/BujoFactoryPage/BujoFactoryPage"
import { CalendarsPage } from "./pages/CalendarsPage/CalendarsPage"
import { CourrierPage } from "./pages/CourrierPage/CourrierPage"
import { CoursesPage } from "./pages/CoursesPage/CoursesPage"
import { COMMIT_HASH } from "./version"

export default function App() {
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
        </Routes>

        <footer className="footer">
          <p>version {COMMIT_HASH}</p>
        </footer>
      </main>
    </HashRouter>
  )
}
