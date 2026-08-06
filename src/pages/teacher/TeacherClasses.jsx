// src/pages/teacher/TeacherClasses.jsx
import { useState, useEffect } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'

export const TeacherClasses = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const res = await teacherService.getMyClasses()
      if (res.data.success) setClasses(res.data.classes || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (cls = null) => {
    setEditingClass(cls)
    setFormData(cls || {
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      meetLink: '',
      maxStudents: 50
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingClass) {
        await teacherService.updateClass(editingClass.id, formData)
      } else {
        await teacherService.createClass(formData)
      }
      setShowModal(false)
      loadClasses()
      alert(editingClass ? 'Clase actualizada' : 'Clase creada')
    } catch (error) {
      alert('Error al guardar la clase')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta clase permanentemente?')) return
    try {
      await teacherService.deleteClass(id)
      loadClasses()
      alert('Clase eliminada')
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const getStatus = (date) => {
    const today = new Date()
    const classDate = new Date(date)
    if (classDate < today) return { label: 'Completada', color: 'bg-green-100 text-green-700' }
    if (classDate.toDateString() === today.toDateString()) return { label: 'Hoy', color: 'bg-blue-100 text-blue-700' }
    return { label: 'Próxima', color: 'bg-amber-100 text-amber-700' }
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

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📅 Mis Clases</h1>
            <p className="text-gray-500 text-sm mt-1">Gestiona tus clases en vivo</p>
          </div>
          <button onClick={() => openModal()} className="bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition">
            <span>➕</span> Nueva Clase
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Todas', 'Próximas', 'Hoy', 'Completadas'].map(filter => (
            <button key={filter} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:border-primary/30">
              {filter}
            </button>
          ))}
        </div>

        {/* Grid de Clases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {classes.map(cls => {
            const status = getStatus(cls.date)
            return (
              <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className={`h-1 ${status.color.replace('text', 'bg').replace('-700', '-500')}`} />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-400">ID: {cls.id}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{cls.title}</h3>
                      {cls.description && <p className="text-sm text-gray-500 mt-1">{cls.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(cls)} className="text-primary text-sm p-1">✏️</button>
                      <button onClick={() => handleDelete(cls.id)} className="text-red-500 text-sm p-1">🗑️</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📅</span> {new Date(cls.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>⏰</span> {cls.time} ({cls.duration} min)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>👥</span> {cls.currentStudents || 0}/{cls.maxStudents} inscritos
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>🔗</span> {cls.meetLink ? (
                        <a href={cls.meetLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Zoom</a>
                      ) : 'No asignado'}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <button onClick={() => setSelectedClass(cls)} className="text-primary text-sm font-semibold flex items-center gap-1">
                      Ver inscritos →
                    </button>
                    {cls.meetLink && status.label === 'Hoy' && (
                      <a href={cls.meetLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-semibold">
                        Iniciar Clase
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl block mb-4">📅</span>
            <p className="text-gray-500">No tienes clases programadas</p>
            <button onClick={() => openModal()} className="mt-4 text-primary font-semibold hover:underline">Crear primera clase →</button>
          </div>
        )}

        {/* Modal de inscritos */}
        {selectedClass && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedClass(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Inscritos - {selectedClass.title}</h3>
                <button onClick={() => setSelectedClass(null)} className="text-gray-400 text-xl">✕</button>
              </div>
              <div className="space-y-2">
                {selectedClass.enrollments?.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay inscritos aún</p>
                ) : (
                  selectedClass.enrollments?.map(enrollment => (
                    <div key={enrollment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {enrollment.user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{enrollment.user?.name}</p>
                        <p className="text-xs text-gray-500">{enrollment.user?.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${enrollment.attended ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {enrollment.attended ? 'Asistió' : 'Pendiente'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Crear/Editar */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{editingClass ? 'Editar Clase' : 'Nueva Clase'}</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Título de la clase" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none" />
                <textarea placeholder="Descripción" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none" rows={2} />
                <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="time" value={formData.time || ''} onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  <input type="number" placeholder="Duración (min)" value={formData.duration || 60} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <input type="text" placeholder="Enlace de Zoom" value={formData.meetLink || ''} onChange={e => setFormData({ ...formData, meetLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                <input type="number" placeholder="Máximo estudiantes" value={formData.maxStudents || 50} onChange={e => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  )
}