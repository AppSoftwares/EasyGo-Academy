// src/pages/teacher/TeacherStudents.jsx
import { useState, useEffect } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'
import { Link } from 'react-router-dom'

export const TeacherStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const res = await teacherService.getMyStudents()
      if (res.data.success) setStudents(res.data.students || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewProgress = async (student) => {
    setSelectedStudent(student)
    try {
      const res = await teacherService.getStudentProgress(student.id)
      if (res.data.success) setProgress(res.data.progress)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filteredStudents = students.filter(s => {
    const matchSearch = !searchTerm || 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchLevel = filterLevel === 'all' || s.assignedLevel === filterLevel
    return matchSearch && matchLevel
  })

  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1']

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👨‍🎓 Mis Alumnos</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} estudiantes asignados</p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input type="text" placeholder="🔍 Buscar por nombre o email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary/30" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">✕</button>
            )}
          </div>
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm">
            {levels.map(l => <option key={l} value={l}>{l === 'all' ? 'Todos los niveles' : `Nivel ${l}`}</option>)}
          </select>
        </div>

        {/* Grid de estudiantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                  {student.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
                <Link to={`/teacher/messages?student=${student.id}`} className="text-primary text-sm">💬</Link>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nivel:</span>
                  <span className="font-semibold text-primary">{student.assignedLevel || 'A1'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Progreso:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${student.progress || 0}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-primary">{student.progress || 0}%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Último acceso:</span>
                  <span className="text-xs text-gray-400">{student.lastAccess || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Clases asistidas:</span>
                  <span className="text-xs text-gray-600">{student.attendedClasses || 0}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onClick={() => viewProgress(student)} className="flex-1 py-2 bg-gray-50 text-primary rounded-xl text-xs font-semibold hover:bg-gray-100">
                  Ver progreso
                </button>
                <Link to={`/teacher/messages?student=${student.id}`} className="flex-1 py-2 bg-primary/10 text-primary rounded-xl text-xs font-semibold text-center hover:bg-primary/20">
                  Enviar mensaje
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl block mb-4">👨‍🎓</span>
            <p className="text-gray-500">No se encontraron estudiantes</p>
          </div>
        )}

        {/* Modal de Progreso Detallado */}
        {selectedStudent && progress && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStudent(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Progreso de {selectedStudent.name}</h3>
                <button onClick={() => setSelectedStudent(null)} className="text-gray-400 text-xl">✕</button>
              </div>
              
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
                
                {/* Niveles */}
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
                  <h4 className="font-semibold text-gray-800 mb-2">Unidades recientes</h4>
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
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  )
}