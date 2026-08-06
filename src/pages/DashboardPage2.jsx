import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { useNavigate } from 'react-router-dom'

export const DashboardPage = () => {
  const navigate = useNavigate()

  const stats = [
    { title: 'Clases Completadas', value: '12', icon: '✅', color: 'from-green-400 to-emerald-500' },
    { title: 'Horas de Practica', value: '24', icon: '⏰', color: 'from-blue-400 to-cyan-500' },
    { title: 'Nivel Actual', value: 'B1', icon: '📊', color: 'from-purple-400 to-pink-500' },
    { title: 'Proxima Clase', value: '2h', icon: '🎯', color: 'from-orange-400 to-red-500' }
  ]

  const quickActions = [
    { title: 'Chat con IA', desc: 'Practica conversacion', icon: '🤖', path: '/chat', color: 'from-primary to-primary-light' },
    { title: 'Ver Videos', desc: 'Clases grabadas', icon: '🎥', path: '/videos', color: 'from-accent to-accent-light' },
    { title: 'Recursos', desc: 'Material descargable', icon: '📚', path: '/resources', color: 'from-green-500 to-emerald-500' },
    { title: 'Mi Progreso', desc: 'Estadisticas', icon: '📈', path: '/progress', color: 'from-purple-500 to-pink-500' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-xl sm:text-3xl">{stat.icon}</span>
                <span className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                  +12%
                </span>
              </div>
              <h3 className="text-gray-500 text-xs sm:text-sm mb-1">{stat.title}</h3>
              <p className="text-xl sm:text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`bg-gradient-to-br ${action.color} p-3 sm:p-6 rounded-xl sm:rounded-2xl text-white text-left hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <span className="text-2xl sm:text-4xl mb-2 sm:mb-4 block">{action.icon}</span>
              <h3 className="text-sm sm:text-xl font-bold mb-1">{action.title}</h3>
              <p className="text-white/80 text-xs sm:text-sm">{action.desc}</p>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Actividad Reciente</h3>
          <div className="space-y-2 sm:space-y-4">
            {[
              { icon: '💬', text: 'Practicaste con el Chat IA', time: 'Hace 10 minutos', color: 'bg-blue-100 text-blue-600' },
              { icon: '🎥', text: 'Completaste la leccion de Pronunciacion', time: 'Hace 2 horas', color: 'bg-green-100 text-green-600' },
              { icon: '📚', text: 'Descargaste la guia de gramatica', time: 'Ayer', color: 'bg-purple-100 text-purple-600' },
              { icon: '✅', text: 'Completaste 5 ejercicios', time: 'Ayer', color: 'bg-orange-100 text-orange-600' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${activity.color} rounded-full flex items-center justify-center text-base sm:text-lg flex-shrink-0`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{activity.text}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}