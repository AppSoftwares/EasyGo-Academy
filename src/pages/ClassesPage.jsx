import { useState, useEffect } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { classService } from '../services/classService'
import { useAuthStore } from '../store/useAuthStore'

export const ClassesPage = () => {
  const { user } = useAuthStore()
  const [classes, setClasses] = useState([])
  const [myClasses, setMyClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [message, setMessage] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [upcomingRes, myRes] = await Promise.all([
        classService.getUpcoming(),
        classService.getMyClasses(),
      ])
      if (upcomingRes.data.success) setClasses(upcomingRes.data.classes || [])
      if (myRes.data.success) setMyClasses(myRes.data.classes || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleEnroll = async (classId) => {
    setEnrolling(true)
    setMessage(null)
    try {
      const res = await classService.enroll(classId)
      setMessage({ type: 'success', text: res.data.message })
      loadData()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al inscribirse' })
    } finally {
      setEnrolling(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleUnenroll = async (classId) => {
    if (!window.confirm('¿Cancelar tu inscripción a esta clase?')) return
    try {
      await classService.unenroll(classId)
      loadData()
    } catch (err) { alert('Error al cancelar') }
  }

  const handleJoinClass = (meetLink) => {
    if (meetLink) window.open(meetLink, '_blank')
  }

  // Filtros
  const now = new Date()
  const upcomingClasses = classes.filter(c => new Date(c.date) >= now && c.active)
  const myUpcomingClasses = myClasses.filter(c => new Date(c.class?.date) >= now)
  const pastClasses = myClasses.filter(c => new Date(c.class?.date) < now)

  const filters = [
    { id: 'all', label: 'Todas las clases', icon: '📅', count: classes.length },
    { id: 'available', label: 'Disponibles', icon: '✅', count: upcomingClasses.length },
    { id: 'my-classes', label: 'Mis clases', icon: '🎓', count: myUpcomingClasses.length },
    { id: 'past', label: 'Pasadas', icon: '📜', count: pastClasses.length },
  ]

  const levels = [
    { id: 'all', label: 'Todos los niveles' },
    { id: 'A1', label: '🟢 A1' },
    { id: 'A2', label: '🔵 A2' },
    { id: 'B1', label: '🟡 B1' },
    { id: 'B2', label: '🟠 B2' },
    { id: 'C1', label: '🔴 C1' },
  ]

  let displayClasses = []
  if (activeFilter === 'my-classes') {
    displayClasses = myUpcomingClasses.map(e => ({ ...e.class, isEnrolled: true }))
  } else if (activeFilter === 'past') {
    displayClasses = pastClasses.map(e => ({ ...e.class, isEnrolled: true, isPast: true }))
  } else if (activeFilter === 'available') {
    displayClasses = upcomingClasses
  } else {
    displayClasses = classes
  }

  // Aplicar filtros adicionales
  displayClasses = displayClasses.filter(c => {
    const matchLevel = levelFilter === 'all' || c.level === levelFilter || c.level === 'all'
    const matchSearch = !searchTerm ||
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchLevel && matchSearch
  })

  const getStatusBadge = (c) => {
    if (c.isPast) return { text: 'Finalizada', color: 'bg-gray-100 text-gray-500 border-gray-200' }
    if (c.isEnrolled) return { text: 'Inscrito ✅', color: 'bg-green-100 text-green-700 border-green-200' }
    if (!c.hasSpace) return { text: 'Llena', color: 'bg-red-100 text-red-600 border-red-200' }
    return { text: 'Disponible', color: 'bg-blue-100 text-blue-700 border-blue-200' }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📹 Clases en vivo</h1>
          <p className="text-gray-500 text-sm mt-1">
            {myUpcomingClasses.length > 0
              ? `Tienes ${myUpcomingClasses.length} clase(s) programada(s)`
              : 'Inscríbete a una clase y practica con profesores nativos'}
          </p>
        </div>

        {/* Mensaje */}
        {message && (
          <div className={`px-5 py-4 rounded-2xl text-sm font-semibold animate-fade-in ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Mi próxima clase (destacada) */}
        {myUpcomingClasses.length > 0 && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-bold text-gray-900 mb-3">🎓 Tu próxima clase</h3>
            {myUpcomingClasses.slice(0, 1).map(e => {
              const c = e.class
              return (
                <div key={c.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{c.title}</h4>
                    <p className="text-sm text-gray-500">{c.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                      <span>📅 {new Date(c.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                      <span>⏰ {c.time}</span>
                      <span>👨‍🏫 {c.teacherName || 'Profesor'}</span>
                    </div>
                  </div>
                  <button onClick={() => handleJoinClass(c.meetLink)} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-500/20">
                    🎥 Entrar a clase
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Filtros principales */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeFilter === f.id ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}>
              {f.icon} {f.label}
              <span className="text-xs opacity-70">({f.count})</span>
            </button>
          ))}
        </div>

        {/* Filtros de nivel + Búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {levels.map(l => (
              <button key={l.id} onClick={() => setLevelFilter(l.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  levelFilter === l.id ? 'bg-primary text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'
                }`}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="🔍 Buscar clase..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none" />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">✕</button>}
          </div>
        </div>

        {/* Grid de clases */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayClasses.map(c => {
            const status = getStatusBadge(c)
            const classDate = new Date(c.date)
            const isToday = classDate.toDateString() === new Date().toDateString()
            const isTomorrow = classDate.toDateString() === new Date(Date.now() + 86400000).toDateString()
            let dateLabel = classDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })
            if (isToday) dateLabel = 'Hoy'
            if (isTomorrow) dateLabel = 'Mañana'

            return (
              <div key={c.id} className={`bg-white rounded-2xl p-5 border-2 transition-all hover:shadow-md ${
                c.isEnrolled ? 'border-green-300 bg-green-50/30' :
                !c.hasSpace ? 'border-red-200 bg-red-50/20' :
                'border-gray-100 hover:border-primary/20'
              }`}>
                
                {/* Status + Fecha */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.color}`}>{status.text}</span>
                  <span className="text-xs text-gray-400 font-medium">{dateLabel}</span>
                </div>

                {/* Profesor + Título */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {c.teacherPhoto ? (
                      <img src={c.teacherPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-black text-primary">
                        {c.teacherInitials || c.teacherName?.charAt(0)?.toUpperCase() || '👨‍🏫'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{c.title}</h4>
                    <p className="text-xs text-gray-500">{c.teacherName || 'Profesor'}</p>
                  </div>
                </div>

                {/* Detalles */}
                <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2"><span>⏰</span> {c.time}</div>
                  {c.duration && <div className="flex items-center gap-2"><span>⏱️</span> {c.duration} minutos</div>}
                  <div className="flex items-center gap-2"><span>👥</span> {c.currentStudents || 0}/{c.maxStudents} estudiantes</div>
                  <div className="flex items-center gap-2"><span>🎯</span> Nivel {c.level === 'all' ? 'Todos' : c.level}</div>
                </div>

                {/* Barra de cupos */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full transition-all ${
                    (c.currentStudents / c.maxStudents) >= 0.8 ? 'bg-red-500' :
                    (c.currentStudents / c.maxStudents) >= 0.5 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${((c.currentStudents || 0) / c.maxStudents) * 100}%` }} />
                </div>

                {/* Acción */}
                <div>
                  {c.isPast ? (
                    <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed">
                      Finalizada
                    </button>
                  ) : c.isEnrolled ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleJoinClass(c.meetLink)}
                        className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
                        🎥 Entrar
                      </button>
                      <button onClick={() => handleUnenroll(c.id)}
                        className="px-3 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                        ✕
                      </button>
                    </div>
                  ) : c.hasSpace ? (
                    <button onClick={() => handleEnroll(c.id)} disabled={enrolling}
                      className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                      {enrolling ? 'Inscribiendo...' : '📝 Inscribirme'}
                    </button>
                  ) : (
                    <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed">
                      🚫 Clase llena
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {displayClasses.length === 0 && (
            <div className="col-span-full text-center py-16">
              <span className="text-5xl block mb-4">📅</span>
              <p className="text-gray-500 font-medium">No se encontraron clases</p>
              <p className="text-gray-400 text-sm mt-1">
                {activeFilter === 'my-classes' ? 'No tienes clases programadas' : 'No hay clases disponibles con esos filtros'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}