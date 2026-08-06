// src/pages/teacher/TeacherStudentDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'
import { teacherService as teacherApi } from '../../services/teacherService'

export const TeacherStudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)

  useEffect(() => {
    loadStudentData()
    loadStudentProgress()
    loadStudentAssignments()
  }, [id])

  const loadStudentData = async () => {
    try {
      const res = await teacherService.getStudent(id)
      if (res.data.success) {
        setStudent(res.data.student)
      }
    } catch (error) {
      console.error('Error loading student:', error)
    }
  }

  const loadStudentProgress = async () => {
    try {
      const res = await teacherService.getStudentProgress(id)
      if (res.data.success) {
        setProgress(res.data.progress)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const loadStudentAssignments = async () => {
    try {
      const res = await teacherService.getStudentAssignments(id)
      if (res.data.success) {
        setAssignments(res.data.assignments || [])
      }
    } catch (error) {
      console.error('Error loading assignments:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    
    setSending(true)
    try {
      const res = await teacherService.sendMessage(id, newMessage)
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.message])
        setNewMessage('')
        setShowMessageModal(false)
        alert('Mensaje enviado correctamente')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error al enviar el mensaje')
    } finally {
      setSending(false)
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

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-red-100 text-red-700',
      suspended: 'bg-orange-100 text-orange-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-500'
  }

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </TeacherLayout>
    )
  }

  if (!student) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">👨‍🎓</span>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Alumno no encontrado</h2>
          <p className="text-gray-500 mb-6">El alumno que buscas no existe</p>
          <button onClick={() => navigate('/teacher/students')} className="px-6 py-2 bg-primary text-white rounded-lg">
            Volver a alumnos
          </button>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Botón volver */}
        <button onClick={() => navigate('/teacher/students')} className="flex items-center gap-2 text-gray-500 hover:text-primary transition">
          ← Volver a alumnos
        </button>

        {/* Header - Información del alumno */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-lg">
              {student.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                  {student.status === 'active' ? 'Activo' : student.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getLevelColor(student.assignedLevel)}`}>
                  Nivel {student.assignedLevel || 'A1'}
                </span>
              </div>
              <p className="text-gray-600">{student.email}</p>
              {student.phone && <p className="text-gray-500 text-sm mt-1">📞 {student.phone}</p>}
              <div className="flex gap-4 mt-3 text-sm text-gray-500">
                <span>📅 Registro: {new Date(student.createdAt).toLocaleDateString()}</span>
                <span>🕒 Último acceso: {student.lastAccess ? new Date(student.lastAccess).toLocaleDateString() : '-'}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowMessageModal(true)}
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm flex items-center gap-2"
            >
              💬 Enviar mensaje
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'overview', label: '📊 Resumen', icon: '📊' },
            { id: 'progress', label: '📈 Progreso', icon: '📈' },
            { id: 'classes', label: '📅 Clases', icon: '📅' },
            { id: 'assignments', label: '📝 Tareas', icon: '📝' },
            { id: 'activity', label: '🕒 Actividad', icon: '🕒' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel de Resumen */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📚</div>
                  <span className="text-2xl font-bold text-primary">{progress?.completedUnits || 0}/{progress?.totalUnits || 0}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Unidades completadas</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">⭐</div>
                  <span className="text-2xl font-bold text-primary">{progress?.avgScore || 0}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Puntaje promedio</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">⏱️</div>
                  <span className="text-2xl font-bold text-primary">{progress?.totalTime || 0}h</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Horas de estudio</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">🎓</div>
                  <span className="text-2xl font-bold text-primary">{student.attendedClasses || 0}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Clases asistidas</p>
              </div>
            </div>

            {/* Progreso General */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Progreso General</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso académico</span>
                  <span className="font-semibold text-primary">{progress?.overall || 0}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${progress?.overall || 0}%` }} />
                </div>
              </div>
              
              {/* Progreso por nivel */}
              <div className="space-y-3 mt-6">
                <h3 className="font-semibold text-gray-800">Progreso por nivel</h3>
                {Object.entries(progress?.levels || {}).map(([level, data]) => (
                  <div key={level}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Nivel {level}</span>
                      <span className="text-gray-500">{data.completed}/{data.total} unidades</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(data.completed / data.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Últimas unidades */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-900">📖 Últimas unidades completadas</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {progress?.recentUnits?.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No hay unidades completadas aún</div>
                ) : (
                  progress?.recentUnits?.map(unit => (
                    <div key={unit.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-900">{unit.title}</p>
                          <p className="text-xs text-gray-400">Completado el {new Date(unit.completedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{unit.score}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Panel de Progreso Detallado */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Gráfica de progreso */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Evolución del progreso</h2>
              <div className="h-64 flex items-end gap-2">
                {progress?.dailyProgress?.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40"
                      style={{ height: `${day.value}%`, minHeight: '4px' }}
                    />
                    <span className="text-[10px] text-gray-400">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Habilidades */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Evaluación por habilidad</h2>
              <div className="space-y-4">
                {[
                  { name: 'Gramática', value: progress?.skills?.grammar || 0 },
                  { name: 'Vocabulario', value: progress?.skills?.vocabulary || 0 },
                  { name: 'Comprensión auditiva', value: progress?.skills?.listening || 0 },
                  { name: 'Comprensión lectora', value: progress?.skills?.reading || 0 },
                  { name: 'Expresión oral', value: progress?.skills?.speaking || 0 },
                  { name: 'Expresión escrita', value: progress?.skills?.writing || 0 }
                ].map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="font-semibold text-primary">{skill.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${skill.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Panel de Clases */}
        {activeTab === 'classes' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">📅 Clases asistidas</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {student.classes?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No hay clases registradas</div>
              ) : (
                student.classes?.map(cls => (
                  <div key={cls.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{cls.title}</p>
                      <p className="text-sm text-gray-500">{new Date(cls.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls.attended ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {cls.attended ? 'Asistió' : 'Ausente'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Panel de Tareas */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">📝 Tareas entregadas</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No hay tareas entregadas</div>
              ) : (
                assignments.map(assignment => (
                  <div key={assignment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-500">Entregado: {new Date(assignment.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${assignment.grade >= 70 ? 'text-green-600' : assignment.grade ? 'text-orange-600' : 'text-gray-400'}`}>
                          {assignment.grade ? `${assignment.grade}/${assignment.maxScore}` : 'Sin calificar'}
                        </p>
                        {assignment.grade && (
                          <span className="text-xs text-gray-400">{Math.round((assignment.grade / assignment.maxScore) * 100)}%</span>
                        )}
                      </div>
                    </div>
                    {assignment.feedback && (
                      <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg">📝 {assignment.feedback}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Panel de Actividad */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">🕒 Registro de actividad</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {progress?.activityLog?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No hay actividad registrada</div>
              ) : (
                progress?.activityLog?.map((activity, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-3 hover:bg-gray-50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                      {activity.type === 'class' ? '📅' : activity.type === 'assignment' ? '📝' : '📚'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Enviar Mensaje */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMessageModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Enviar mensaje a {student.name}</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none resize-none"
              rows={5}
            />
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleSendMessage} 
                disabled={sending || !newMessage.trim()}
                className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
              >
                {sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>
              <button 
                onClick={() => setShowMessageModal(false)} 
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  )
}