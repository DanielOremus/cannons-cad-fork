import AuthPage from '../pages/AuthPage/AuthPage'
import AdminPage from '../pages/AdminPage/AdminPage'
import { AuthProvider } from '../features/auth/context/AuthProvider'
import { useAuth } from '../features/auth/context/AuthContext'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BrandMark } from '../shared/components/BrandMark'

function AppLoadingState() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <section
        className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm"
        aria-live="polite"
        aria-busy="true"
      >
        <BrandMark compact />
        <p className="mt-6 text-sm text-muted-foreground">Restoring your session...</p>
      </section>
    </main>
  )
}

function AdminRoute() {
  const { status, accessToken, isAdmin } = useAuth()

  if (status === 'loading') {
    return <AppLoadingState />
  }

  if (!accessToken) {
    return <Navigate to="/" replace />
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background px-6 py-8 text-foreground">
        <section className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <BrandMark compact />
          <p className="mt-6 text-xs font-medium uppercase tracking-wide text-primary">
            Access denied
          </p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight">
            User management is restricted
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to manage users.
          </p>
        </section>
      </main>
    )
  }

  return <AdminPage />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
