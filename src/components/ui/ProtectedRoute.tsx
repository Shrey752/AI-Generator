import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface Props {
  children: React.ReactNode
  requireAdmin?: boolean
  requireBuyer?: boolean
}

export default function ProtectedRoute({ children, requireAdmin, requireBuyer }: Props) {
  const { user, isAdmin, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />
  if (requireBuyer && isAdmin) return <Navigate to="/admin" replace />

  return <>{children}</>
}
