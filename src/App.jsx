import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppStore } from './store'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { CatalogPage } from './pages/CatalogPage'
import { ContactPage } from './pages/ContactPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAppStore()
  if (loading) return <div className="loading-screen">Cargando panel…</div>
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  const { settings, loading } = useAppStore()

  if (loading) return <div className="loading-screen">Cargando sitio…</div>

  return (
    <Routes>
      <Route element={<Layout settings={settings} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/quienes-somos" element={<AboutPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/contacto" element={<ContactPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
