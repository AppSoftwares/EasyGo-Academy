// src/components/teacher/TeacherStudentCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { teacherService } from '../../services/teacherService'

export const TeacherStudentCard = ({ student, onViewProgress, onSendMessage }) => {
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [progress, setProgress] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(false)

  const loadProgress = async () => {
    setLoadingProgress(true)
    try {
      const res = await teacherService.getStudentProgress(student.id)
      if (res.data.success) {
        setProgress(res.data.progress)
        setShowProgressModal(true)
        if (onViewProgress) onViewProgress(student)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoadingProgress(false)
    }
  }

  const getLevelColor = (level) => {
    const colors = {
      A1: 'bg-green-100 text-green-700',
      A2: 'bg-blue-100 text-blue-700',
      B1: 'bg-amber-100 text-amber-700',
      B2: 'bg-orange-100 text-orange-700',
      C1: 'bg-red-100 text-red-700'
    }
    return colors[level] || 'bg-gray-100 text-gray-500'
  }

  const getStatusColor = (lastAccess) => {
    if (!lastAccess) return 'bg-gray-100 text-gray-500'
    const days = Math.floor((new Date() - new Date(lastAccess)) / (1000 * 60 * 60 * 24))
    if (days <= 1) return 'bg-green-100 text-green-700'
    if (days <= 7) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-lg font-bold text-primary">
            {student.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{student.name}</h3>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>
          <Link to={`/teacher/messages?student=${student.id}`} className="text-primary text-sm p-2 hover:bg-primary/10 rounded-full transition">
            💬
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-400">Nivel</p>
            <p className={`font-semibold inline-block px-2 py-0.5 rounded-full text-xs ${getLevelColor(student.assignedLevel)}`}>
              {student.assignedLevel || 'A1'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-400">Progreso</p>
            <p className="font-semibold text-primary">{student.progress || 0}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-400">Clases</p>
            <p className="font-semibold text-gray-700">{student.attendedClasses || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-400">Último acceso</p>
            <p className={`font-semibold text-xs ${getStatusColor(student.lastAccess)} px-1 py-0.5 rounded-full inline-block`}>
              {student.lastAccess ? new Date(student.lastAccess).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Progreso académico</span>
            <span>{student.progress || 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
              style={{ width: `${student.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button 
            onClick={loadProgress}
            className="flex-1 py-2 bg-gray-50 text-primary rounded-xl text-xs font-semibold hover:bg-gray-100 transition"
          >
            📊 Ver progreso
          </button>
          <button 
            onClick={() => onSendMessage?.(student)}
            className="flex-1 py-2 bg-primary/10 text-primary rounded-xl text-xs font-semibold hover:bg-primary/20 transition"
          >
            💬 Mensaje
          </button>
        </div>
      </div>

      {/* Modal de Progreso Detallado */}
      {showProgressModal && progress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowProgressModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Progreso de {student.name}</h3>
              <button onClick={() => setShowProgressModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            
            {loadingProgress ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Progreso general */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Progreso general</span>
                    <span className="text-sm font-bold text-primary">{progress.overall || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progress.overall || 0}%` }} />
                  </div>
                </div>
                
                {/* Progreso por nivel */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Progreso por nivel</h4>
                  <div className="space-y-3">
                    {Object.entries(progress.levels || {}).map(([level, data]) => (
                      <div key={level}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Nivel {level}</span>
                          <span className="text-gray-500">{data.completed}/{data.total} unidades</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(data.completed / data.total) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Unidades recientes */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📖 Últimas unidades</h4>
                  <div className="space-y-2">
                    {(progress.recentUnits || []).map(unit => (
                      <div key={unit.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${unit.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm text-gray-600 flex-1">{unit.title}</span>
                        <span className="text-xs text-gray-400">{unit.score || 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{progress.totalTime || 0}h</p>
                    <p className="text-xs text-gray-500">Tiempo de estudio</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{progress.avgScore || 0}%</p>
                    <p className="text-xs text-gray-500">Puntaje promedio</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 mt-6">
              <Link 
                to={`/teacher/messages?student=${student.id}`}
                className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold text-center"
              >
                Enviar mensaje
              </Link>
              <button 
                onClick={() => setShowProgressModal(false)} 
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}