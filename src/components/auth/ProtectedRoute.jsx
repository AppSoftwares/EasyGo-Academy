import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}