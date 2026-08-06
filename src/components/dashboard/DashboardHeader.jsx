// src/components/dashboard/DashboardHeader.jsx
import { useAuthStore } from '../../store/useAuthStore'

export const DashboardHeader = () => {
  const { user } = useAuthStore()
  const userName = user?.name?.split(' ')[0] || 'Estudiante'

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          ¡Bienvenido de nuevo, {userName}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Continúa tu camino hacia la fluidez en inglés
        </p>
      </div>
    </div>
  )
}