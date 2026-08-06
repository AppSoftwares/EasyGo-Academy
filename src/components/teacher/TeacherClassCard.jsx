// src/components/teacher/TeacherClassCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { teacherService } from '../../services/teacherService'

export const TeacherClassCard = ({ class: classData, onDelete, onEdit }) => {
  const [showEnrollments, setShowEnrollments] = useState(false)
  const [enrollments, setEnrollments] = useState([])
  const [loadingEnrollments, setLoadingEnrollments] = useState(false)

  const getStatus = (date) => {
    const today = new Date()
    const classDate = new Date(date)
    if (classDate < today) return { label: 'Completada', color: 'bg-green-100 text-green-700', icon: '✅' }
    if (classDate.toDateString() === today.toDateString()) return { label: 'Hoy', color: 'bg-blue-100 text-blue-700', icon: '🔴' }
    return { label: 'Próxima', color: 'bg-amber-100 text-amber-700', icon: '📅' }
  }

  const loadEnrollments = async () => {
    setLoadingEnrollments(true)
    try {
      const res = await teacherService.getClassEnrollments(classData.id)
      if (res.data.success) {
        setEnrollments(res.data.enrollments || [])
        setShowEnrollments(true)
      }
    } catch (error) {
      console.error('Error loading enrollments:', error)
    } finally {
      setLoadingEnrollments(false)
    }
  }

  const status = getStatus(classData.date)

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
        <div className={`h-1 ${status.color.replace('text', 'bg').replace('-700', '-500')}`} />
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.color}`}>
                  {status.icon} {status.label}
                </span>
                <span className="text-xs text-gray-400">ID: {classData.id}</span>
                {classData.isRecurring && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700">
                    🔁 Recurrente
                  </span>
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{classData.title}</h3>
              {classData.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{classData.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(classData)} className="text-primary text-sm p-1 hover:bg-primary/10 rounded-lg transition">
                ✏️
              </button>
              <button onClick={() => onDelete(classData.id)} className="text-red-500 text-sm p-1 hover:bg-red-50 rounded-lg transition">
                🗑️
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📅</span> {new Date(classData.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>⏰</span> {classData.time} ({classData.duration} min)
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>👥</span> {classData.currentStudents || 0}/{classData.maxStudents} inscritos
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>🔗</span> {classData.meetLink ? (
                <a href={classData.meetLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Zoom</a>
              ) : 'No asignado'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button 
              onClick={loadEnrollments}
              className="flex-1 py-2 bg-gray-50 text-primary rounded-xl text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-1"
            >
              👥 Ver inscritos ({classData.currentStudents || 0})
            </button>
            {classData.meetLink && status.label === 'Hoy' && (
              <a 
                href={classData.meetLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition flex items-center justify-center gap-1"
              >
                🎥 Iniciar Clase
              </a>
            )}
          </div>

          {/* Progress bar */}
          {classData.currentStudents > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Capacidad</span>
                <span>{Math.round((classData.currentStudents / classData.maxStudents) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(classData.currentStudents / classData.maxStudents) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de inscritos */}
      {showEnrollments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEnrollments(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Inscritos - {classData.title}</h3>
              <button onClick={() => setShowEnrollments(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            
            {loadingEnrollments ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : enrollments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay inscritos aún</p>
            ) : (
              <div className="space-y-3">
                {enrollments.map(enrollment => (
                  <div key={enrollment.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          {enrollment.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{enrollment.user?.name}</p>
                          <p className="text-xs text-gray-500">{enrollment.user?.email}</p>
                          <p className="text-xs text-gray-400 mt-1">Nivel {enrollment.user?.assignedLevel || 'A1'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${enrollment.attended ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {enrollment.attended ? '✅ Asistió' : '⏳ Pendiente'}
                        </span>
                        <button className="block text-primary text-xs mt-2 hover:underline">
                          {enrollment.attended ? 'Marcar ausente' : 'Marcar asistencia'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}