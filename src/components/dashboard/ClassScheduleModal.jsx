import { useState } from 'react'
import { classService } from '../../services/classService'

export const ClassScheduleModal = ({ classes, onClose, onEnroll, onUnenroll, enrolling }) => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const levels = [
    { id: 'all', label: 'Todos', color: 'bg-gray-100 text-gray-700' },
    { id: 'A1', label: 'A1', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'A2', label: 'A2', color: 'bg-blue-100 text-blue-700' },
    { id: 'B1', label: 'B1', color: 'bg-amber-100 text-amber-700' },
    { id: 'B2', label: 'B2', color: 'bg-orange-100 text-orange-700' },
    { id: 'C1', label: 'C1', color: 'bg-rose-100 text-rose-700' },
  ]

  const filteredClasses = classes.filter(c => {
    const matchLevel = filter === 'all' || c.level === filter || c.level === 'all'
    const matchSearch = !searchTerm || 
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchLevel && matchSearch
  })

  const getStatusBadge = (c) => {
    if (c.isEnrolled) return { text: 'Inscrito', color: 'bg-green-100 text-green-700 border-green-200' }
    if (!c.hasSpace) return { text: 'Llena', color: 'bg-red-100 text-red-600 border-red-200' }
    return { text: 'Disponible', color: 'bg-blue-100 text-blue-700 border-blue-200' }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">📅 Clases disponibles</h3>
            <p className="text-sm text-gray-400 mt-0.5">{classes.length} clases programadas</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 flex items-center justify-center transition-all text-lg">✕</button>
        </div>

        {/* Búsqueda */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar por título, profesor..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-primary/30 transition-all outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>

        {/* Filtros de nivel */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide flex-shrink-0">
          {levels.map(l => (
            <button
              key={l.id}
              onClick={() => setFilter(l.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === l.id ? 'bg-primary text-white shadow' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Lista de clases */}
        <div className="flex-1 overflow-y-auto space-y-3 mt-2">
          {filteredClasses.map(c => {
            const status = getStatusBadge(c)
            const classDate = new Date(c.date)
            const isToday = classDate.toDateString() === new Date().toDateString()
            const isTomorrow = classDate.toDateString() === new Date(Date.now() + 86400000).toDateString()
            
            let dateLabel = classDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
            if (isToday) dateLabel = 'Hoy'
            if (isTomorrow) dateLabel = 'Mañana'

            return (
              <div
                key={c.id}
                className={`relative p-5 rounded-2xl border-2 transition-all hover:shadow-md ${
                  c.isEnrolled ? 'border-green-300 bg-green-50/50' :
                  !c.hasSpace ? 'border-red-200 bg-red-50/30' :
                  'border-gray-100 bg-white hover:border-primary/20'
                }`}
              >
                {/* Badge de estado */}
                <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.color}`}>
                  {status.text}
                </span>

                <div className="flex items-start gap-4">
                  
                  {/* Avatar del profesor */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {c.teacherPhoto ? (
                      <img src={c.teacherPhoto} alt={c.teacherName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black text-primary">
                        {c.teacherInitials || c.teacherName?.charAt(0)?.toUpperCase() || '👨‍🏫'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5 pr-20">{c.title}</h4>
                    {c.subtitle && <p className="text-xs text-gray-500 mb-2">{c.subtitle}</p>}
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="text-sm">📅</span>
                        <strong>{dateLabel}</strong> · {classDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-sm">⏰</span>
                        {c.time}
                      </span>
                      {c.duration && (
                        <span className="flex items-center gap-1">
                          <span>⏱️</span>
                          {c.duration} min
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">👨‍🏫 {c.teacherName || 'Sin profesor'}</span>
                      <span className="flex items-center gap-1">👥 {c.currentStudents || 0}/{c.maxStudents}</span>
                    </div>

                    {/* Barra de cupos */}
                    <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (c.currentStudents / c.maxStudents) >= 0.8 ? 'bg-red-500' :
                          (c.currentStudents / c.maxStudents) >= 0.5 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${((c.currentStudents || 0) / c.maxStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Botón de acción */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  {c.isEnrolled ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => c.meetLink && window.open(c.meetLink, '_blank')}
                        className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                      >
                        🎥 Entrar a clase
                      </button>
                      <button
                        onClick={() => onUnenroll(c.id)}
                        className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : c.hasSpace ? (
                    <button
                      onClick={() => onEnroll(c.id)}
                      disabled={enrolling}
                      className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {enrolling ? 'Inscribiendo...' : '📝 Inscribirme a esta clase'}
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

          {filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">📅</span>
              <p className="text-gray-500 font-medium">No se encontraron clases</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Intenta con otra búsqueda' : 'No hay clases programadas por el momento'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}