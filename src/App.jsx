import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Familias from "./pages/Familias"
import Doacoes from "./pages/Doacoes"
import Parceiros from "./pages/Parceiros"
import Entradas from "./pages/Entradas"
import Relatorios from "./pages/Relatorios" // Nova importação
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/familias" element={<Familias />} />
          <Route path="/doacoes" element={<Doacoes />} />
          <Route path="/parceiros" element={<Parceiros />} />
          <Route path="/entradas" element={<Entradas />} />
          <Route path="/relatorios" element={<Relatorios />} /> {/* Nova Rota */}
        </Route>
      </Routes>
      <Toaster richColors position="bottom-right" /> 
    </BrowserRouter>
  )
}

export default App