import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { classService } from '../../services/classService'
import { useAuthStore } from '../../store/useAuthStore'

export const UpcomingClass = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [myClasses, setMyClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await classService.getMyClasses()
      if (res.data.success) setMyClasses(res.data.classes || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const myNextClass = myClasses[0]

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-20 bg-gray-100 rounded-2xl"></div>
      </div>
    )
  }

  if (!myNextClass) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
        <span className="text-3xl block mb-2">📅</span>
        <h4 className="font-bold text-gray-900 mb-1">Próxima clase en vivo</h4>
        <p className="text-sm text-gray-400">No tienes clases programadas</p>
        <button onClick={() => navigate('/classes')} className="mt-3 text-primary text-sm font-semibold hover:underline">
          Ver clases disponibles →
        </button>
      </div>
    )
  }

  const c = myNextClass.class

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-200 bg-green-50/30 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900">✅ Tu próxima clase</h4>
        <button onClick={() => navigate('/classes')} className="text-xs text-primary hover:text-accent font-semibold">
          Ver todas →
        </button>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <h5 className="font-bold text-gray-900 text-sm">{c.title}</h5>
          <p className="text-xs text-gray-500">{c.subtitle}</p>
          <p className="text-xs text-gray-500">
            📅 {new Date(c.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            {' · '}⏰ {c.time}
          </p>
          <p className="text-xs text-gray-500">👨‍🏫 {c.teacherName || 'Profesor'}</p>
          <button onClick={() => c.meetLink && window.open(c.meetLink, '_blank')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors mt-2">
            🎥 Entrar a clase
          </button>
        </div>
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {c.teacherPhoto ? (
            <img src={c.teacherPhoto} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-black text-primary">
              {c.teacherInitials || c.teacherName?.charAt(0)?.toUpperCase() || '👨‍🏫'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}