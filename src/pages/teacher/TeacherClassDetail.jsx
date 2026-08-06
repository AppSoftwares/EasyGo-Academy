// src/pages/teacher/TeacherClassDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'

export const TeacherClassDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [classData, setClassData] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    loadClassData()
    loadEnrollments()
  }, [id])

  const loadClassData = async () => {
    try {
      const res = await teacherService.getClass(id)
      if (res.data.success) {
        setClassData(res.data.class)
        setFormData(res.data.class)
      }
    } catch (error) {
      console.error('Error loading class:', error)
    }
  }

  const loadEnrollments = async () => {
    try {
      const res = await teacherService.getClassEnrollments(id)
      if (res.data.success) {
        setEnrollments(res.data.enrollments || [])
      }
    } catch (error) {
      console.error('Error loading enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateClass = async () => {
    setSaving(true)
    try {
      const res = await teacherService.updateClass(id, formData)
      if (res.data.success) {
        setClassData(res.data.class)
        setShowEditModal(false)
        alert('Clase actualizada correctamente')
      }
    } catch (error) {
      console.error('Error updating class:', error)
      alert('Error al actualizar la clase')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClass = async () => {
    if (!window.confirm('¿Eliminar esta clase permanentemente? Esta acción notificará a todos los inscritos.')) return
    try {
      await teacherService.deleteClass(id)
      navigate('/teacher/classes')
      alert('Clase eliminada')
    } catch (error) {
      alert('Error al eliminar la clase')
    }
  }

  const handleMarkAttendance = async (studentId, attended) => {
    try {
      const res = await teacherService.markAttendance(id, studentId, attended)
      if (res.data.success) {
        loadEnrollments()
        alert(`Asistencia marcada como ${attended ? 'presente' : 'ausente'}`)
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('Error al marcar asistencia')
    }
  }

  const getStatus = (date) => {
    const today = new Date()
    const classDate = new Date(date)
    if (classDate < today) return { label: 'Completada', color: 'bg-green-100 text-green-700', icon: '✅' }
    if (classDate.toDateString() === today.toDateString()) return { label: 'Hoy', color: 'bg-blue-100 text-blue-700', icon: '🔴' }
    return { label: 'Próxima', color: 'bg-amber-100 text-amber-700', icon: '📅' }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const exportAttendance = () => {
    const headers = ['Alumno', 'Email', 'Nivel', 'Asistencia', 'Fecha de inscripción']
    const rows = enrollments.map(e => [
      e.user?.name,
      e.user?.email,
      e.user?.assignedLevel || 'A1',
      e.attended ? 'Presente' : 'Pendiente',
      new Date(e.createdAt).toLocaleDateString()
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `asistencia_${classData?.title}_${new Date().toLocaleDateString()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sendReminder = async () => {
    try {
      await teacherService.sendClassReminder(id)
      alert('Recordatorio enviado a todos los inscritos')
    } catch (error) {
      alert('Error al enviar recordatorios')
    }
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

  if (!classData) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">📅</span>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Clase no encontrada</h2>
          <p className="text-gray-500 mb-6">La clase que buscas no existe</p>
          <button onClick={() => navigate('/teacher/classes')} className="px-6 py-2 bg-primary text-white rounded-lg">
            Volver a clases
          </button>
        </div>
      </TeacherLayout>
    )
  }

  const status = getStatus(classData.date)

  return (
    <TeacherLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Botón volver */}
        <button onClick={() => navigate('/teacher/classes')} className="flex items-center gap-2 text-gray-500 hover:text-primary transition">
          ← Volver a clases
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
                  {status.icon} {status.label}
                </span>
                <span className="text-sm text-gray-500">ID: {classData.id}</span>
                {classData.isRecurring && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                    🔁 Recurrente
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{classData.title}</h1>
              {classData.description && (
                <p className="text-gray-600 mt-2">{classData.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>📅</span> {formatDate(classData.date)}
                </div>
                <div className="flex items-center gap-2">
                  <span>⏰</span> {classData.time} ({classData.duration} minutos)
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span> {classData.currentStudents || 0}/{classData.maxStudents} inscritos
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                ✏️ Editar
              </button>
              <button onClick={handleDeleteClass} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Resumen', icon: '📊' },
            { id: 'students', label: '👨‍🎓 Alumnos', icon: '👨‍🎓' },
            { id: 'attendance', label: '📋 Asistencia', icon: '📋' },
            { id: 'materials', label: '📚 Materiales', icon: '📚' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
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
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
                  <span className="text-2xl font-bold text-primary">{classData.currentStudents || 0}/{classData.maxStudents}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Inscritos</p>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${((classData.currentStudents || 0) / classData.maxStudents) * 100}%` }} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
                  <span className="text-2xl font-bold text-primary">{enrollments.filter(e => e.attended).length}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Asistieron</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">⏳</div>
                  <span className="text-2xl font-bold text-primary">{enrollments.filter(e => !e.attended).length}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Pendientes</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">⭐</div>
                  <span className="text-2xl font-bold text-primary">{Math.round((enrollments.filter(e => e.attended).length / (classData.currentStudents || 1)) * 100)}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Tasa de asistencia</p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Información de la clase</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 w-32">📅 Fecha:</span>
                    <span className="text-gray-700">{formatDate(classData.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 w-32">⏰ Hora:</span>
                    <span className="text-gray-700">{classData.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 w-32">⏱️ Duración:</span>
                    <span className="text-gray-700">{classData.duration} minutos</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 w-32">👥 Capacidad:</span>
                    <span className="text-gray-700">{classData.maxStudents} estudiantes</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 w-32">🔗 Zoom:</span>
                    {classData.meetLink ? (
                      <a href={classData.meetLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Acceder a la reunión</a>
                    ) : (
                      <span className="text-gray-400">No asignado</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 w-32">📅 Creación:</span>
                    <span className="text-gray-700">{new Date(classData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="flex flex-wrap gap-3">
              {classData.meetLink && status.label === 'Hoy' && (
                <a href={classData.meetLink} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition">
                  🎥 Iniciar clase
                </a>
              )}
              <button onClick={sendReminder} className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold text-sm hover:bg-primary/20 transition">
                📧 Enviar recordatorio a todos
              </button>
              <button onClick={exportAttendance} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition">
                📊 Exportar asistencia
              </button>
            </div>
          </div>
        )}

        {/* Panel de Alumnos Inscritos */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">👨‍🎓 Alumnos inscritos ({enrollments.length})</h2>
              <input
                type="text"
                placeholder="🔍 Buscar alumno..."
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm w-64"
              />
            </div>
            <div className="divide-y divide-gray-100">
              {enrollments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No hay alumnos inscritos</div>
              ) : (
                enrollments.map(enrollment => (
                  <div key={enrollment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          {enrollment.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <Link to={`/teacher/students/${enrollment.userId}`} className="font-semibold text-gray-900 hover:text-primary">
                            {enrollment.user?.name}
                          </Link>
                          <p className="text-sm text-gray-500">{enrollment.user?.email}</p>
                          <p className="text-xs text-gray-400">Nivel {enrollment.user?.assignedLevel || 'A1'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${enrollment.attended ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {enrollment.attended ? '✅ Asistió' : '⏳ Pendiente'}
                        </span>
                        <Link to={`/teacher/messages?student=${enrollment.userId}`} className="text-primary text-sm p-2 hover:bg-primary/10 rounded-full transition">
                          💬
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Panel de Asistencia */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">📋 Marcar asistencia</h2>
              <button onClick={exportAttendance} className="text-sm text-primary hover:underline">
                Exportar lista
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {enrollments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No hay alumnos inscritos</div>
              ) : (
                enrollments.map(enrollment => (
                  <div key={enrollment.id} className="p-4 flex items-center justify-between flex-wrap gap-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {enrollment.user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{enrollment.user?.name}</p>
                        <p className="text-sm text-gray-500">{enrollment.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkAttendance(enrollment.userId, true)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${enrollment.attended ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100'}`}
                      >
                        ✅ Presente
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(enrollment.userId, false)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!enrollment.attended && enrollment.attended !== null ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-100'}`}
                      >
                        ❌ Ausente
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Panel de Materiales */}
        {activeTab === 'materials' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">📚 Materiales de la clase</h2>
              <button className="text-primary text-sm flex items-center gap-1">
                ➕ Agregar material
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {classData.materials?.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-2">📚</span>
                  <p className="text-gray-400">No hay materiales subidos</p>
                  <button className="mt-3 text-primary text-sm">Subir primer material →</button>
                </div>
              ) : (
                classData.materials?.map(material => (
                  <div key={material.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{material.type === 'pdf' ? '📄' : material.type === 'video' ? '🎥' : '🔗'}</span>
                      <div>
                        <p className="font-medium text-gray-900">{material.title}</p>
                        <p className="text-sm text-gray-500">{material.description}</p>
                      </div>
                    </div>
                    <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                      Ver →
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Editar Clase</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formData.date?.split('T')[0] || ''}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={formData.time || ''}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
                  <input
                    type="number"
                    value={formData.duration || 60}
                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Máx. estudiantes</label>
                  <input
                    type="number"
                    value={formData.maxStudents || 50}
                    onChange={e => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enlace Zoom</label>
                <input
                  type="text"
                  value={formData.meetLink || ''}
                  onChange={e => setFormData({ ...formData, meetLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdateClass} disabled={saving} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  )
}