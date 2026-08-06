import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { useAuthStore } from '../store/useAuthStore'

export const SettingsPage = () => {
  const { user } = useAuthStore()

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Perfil de Usuario</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
              <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" defaultValue={user?.email} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
            </div>
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
              Guardar Cambios
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Cambiar Contrasena</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contrasena Actual</label>
              <input type="password" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nueva Contrasena</label>
              <input type="password" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
            </div>
            <button className="bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-accent-dark transition-colors">
              Actualizar Contrasena
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}