import { useAuth } from "@/features/auth/hooks/useAuth"
import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

type ProtectedRouteProps = {
  children: ReactNode
  requiredRole?: "ADMIN" | "CLIENT"  // opcional — si no se pasa solo verifica login
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  // Si no está logueado → al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Si se requiere un rol específico y no lo tiene → al inicio
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}