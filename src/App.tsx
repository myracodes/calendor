import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import { Navbar } from "./components/Navbar/Navbar"
import { BatchCookingPage } from "./pages/BatchCookingPage/BatchCookingPage"
import { BudgetPage } from "./pages/BudgetPage/BudgetPage"
import { CalendarsPage } from "./pages/CalendarsPage/CalendarsPage"
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
        </Routes>

        <footer className="footer">
          <p>version {COMMIT_HASH}</p>
        </footer>
      </main>
    </HashRouter>
  )
}
