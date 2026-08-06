// src/pages/teacher/TeacherAssignments.jsx
import { useState, useEffect } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'

export const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  
  // Estados para asignación de alumnos
  const [assignedToAll, setAssignedToAll] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [studentsList, setStudentsList] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    try {
      const res = await teacherService.getAssignments()
      if (res.data.success) {
        setAssignments(res.data.assignments || [])
      }
    } catch (error) {
      console.error('Error loading assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async () => {
    setLoadingStudents(true)
    try {
      const res = await teacherService.getMyStudents()
      if (res.data.success) {
        setStudentsList(res.data.students || [])
      }
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const openModal = async (assignment = null) => {
    setEditingAssignment(assignment)
    
    if (!assignment) {
      // Cargar lista de alumnos al crear nueva tarea
      await loadStudents()
      setAssignedToAll(false)
      setSelectedStudents([])
      setFormData({
        title: '',
        description: '',
        instructions: '',
        level: 'A1',
        dueDate: '',
        maxScore: 100,
        type: 'homework'
      })
    } else {
      // Si es edición, cargar datos existentes
      setAssignedToAll(assignment.assignedToAll || false)
      setSelectedStudents(assignment.assignedStudentIds || [])
      setFormData(assignment)
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    // Validar que haya alumnos asignados
    if (!assignedToAll && selectedStudents.length === 0) {
      alert('Debes seleccionar al menos un alumno o asignar a todos')
      return
    }

    setSaving(true)
    try {
      const data = {
        ...formData,
        assignedToAll: assignedToAll,
        assignedStudentIds: assignedToAll ? [] : selectedStudents
      }
      
      if (editingAssignment) {
        await teacherService.updateAssignment(editingAssignment.id, data)
      } else {
        await teacherService.createAssignment(data)
      }
      setShowModal(false)
      loadAssignments()
      alert(editingAssignment ? 'Tarea actualizada' : 'Tarea creada exitosamente')
    } catch (error) {
      console.error('Error saving assignment:', error)
      alert('Error al guardar la tarea: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta tarea? Esta acción también eliminará todas las entregas de los alumnos.')) return
    try {
      await teacherService.deleteAssignment(id)
      loadAssignments()
      alert('Tarea eliminada')
    } catch (error) {
      alert('Error al eliminar la tarea')
    }
  }

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment)
  }

  const getStatusColor = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    if (due < today) return 'bg-red-100 text-red-700'
    if (due.toDateString() === today.toDateString()) return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const getStatusText = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    if (due < today) return 'Vencida'
    if (due.toDateString() === today.toDateString()) return 'Hoy'
    return 'Pendiente'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
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
            <h1 className="text-2xl font-bold text-gray-900">📝 Tareas</h1>
            <p className="text-gray-500 text-sm mt-1">Gestiona las tareas de tus alumnos</p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition"
          >
            <span>➕</span> Nueva Tarea
          </button>
        </div>

        {/* Grid de tareas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {assignments.map(assignment => (
            <div key={assignment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className={`h-1 ${getStatusColor(assignment.dueDate)}`} />
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(assignment.dueDate)}`}>
                        {getStatusText(assignment.dueDate)}
                      </span>
                      <span className="text-xs text-gray-400">Nivel {assignment.level}</span>
                      <span className="text-xs text-gray-400 capitalize">{assignment.type}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{assignment.title}</h3>
                    {assignment.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{assignment.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(assignment)} className="text-primary text-sm p-1 hover:bg-primary/10 rounded-lg transition">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(assignment.id)} className="text-red-500 text-sm p-1 hover:bg-red-50 rounded-lg transition">
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Información de fechas */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📅</span> Entrega: {formatDate(assignment.dueDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>⭐</span> Puntuación: {assignment.maxScore} pts
                  </div>
                </div>

                {/* Estadísticas de asignación */}
                <div className="mt-3 bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👥</span>
                      <span className="text-sm font-medium text-gray-700">
                        {assignment.assignedToAll ? 'Todos los alumnos' : `${assignment.totalAssigned || assignment.assignedStudentIds?.length || 0} alumnos específicos`}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <span className="text-green-600">📝 {assignment.submittedCount || 0} entregas</span>
                      <span className="text-orange-600">⏳ {assignment.pendingCount || (assignment.totalAssigned - assignment.submittedCount) || 0} pendientes</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${((assignment.submittedCount || 0) / (assignment.totalAssigned || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => handleViewSubmissions(assignment)}
                  className="w-full mt-4 py-2 bg-gray-50 text-primary rounded-xl text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-1"
                >
                  Ver entregas →
                </button>
              </div>
            </div>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl block mb-4">📝</span>
            <p className="text-gray-500">No hay tareas creadas</p>
            <button onClick={() => openModal()} className="mt-4 text-primary font-semibold hover:underline">
              Crear primera tarea →
            </button>
          </div>
        )}

        {/* Modal de entregas */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAssignment(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Entregas - {selectedAssignment.title}</h3>
                <button onClick={() => setSelectedAssignment(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">📅 Entrega:</span> {formatDate(selectedAssignment.dueDate)}</div>
                  <div><span className="text-gray-500">⭐ Máxima nota:</span> {selectedAssignment.maxScore} pts</div>
                  <div><span className="text-gray-500">👥 Alumnos asignados:</span> {selectedAssignment.assignedToAll ? 'Todos' : selectedAssignment.assignedStudentIds?.length || 0}</div>
                  <div><span className="text-gray-500">📝 Entregas:</span> {selectedAssignment.submittedCount || 0}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="font-semibold text-gray-800 mb-2">Lista de alumnos:</div>
                {selectedAssignment.submissions?.length === 0 && !selectedAssignment.assignedStudentIds?.length ? (
                  <p className="text-center text-gray-500 py-8">No hay alumnos asignados a esta tarea</p>
                ) : (
                  <div className="space-y-2">
                    {selectedAssignment.submissions?.map(sub => (
                      <div key={sub.id} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">{sub.student?.name || `Alumno #${sub.studentId}`}</p>
                            <p className="text-xs text-gray-500">{sub.student?.email}</p>
                            {sub.submittedAt && (
                              <p className="text-xs text-gray-400 mt-1">Entregado: {new Date(sub.submittedAt).toLocaleString()}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${sub.grade ? 'text-green-600' : 'text-orange-600'}`}>
                              {sub.grade ? `${sub.grade}/${selectedAssignment.maxScore}` : 'Sin calificar'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {sub.submitted ? '✅ Entregado' : '⏳ Pendiente'}
                            </p>
                          </div>
                        </div>
                        {sub.feedback && (
                          <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-200">📝 Feedback: {sub.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Crear/Editar Tarea */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingAssignment ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}
              </h3>
              
              <div className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                    placeholder="Ej: Tarea de gramática - Present Simple"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                    rows={2}
                    placeholder="Breve descripción de la tarea"
                  />
                </div>

                {/* Instrucciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones</label>
                  <textarea
                    value={formData.instructions || ''}
                    onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                    rows={3}
                    placeholder="Instrucciones detalladas para completar la tarea"
                  />
                </div>

                {/* Tipo y Nivel */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={formData.type || 'homework'}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      <option value="homework">📚 Tarea</option>
                      <option value="quiz">📝 Quiz</option>
                      <option value="project">🎯 Proyecto</option>
                      <option value="exam">📋 Examen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                    <select
                      value={formData.level || 'A1'}
                      onChange={e => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      <option value="A1">A1 - Principiante</option>
                      <option value="A2">A2 - Básico</option>
                      <option value="B1">B1 - Intermedio</option>
                      <option value="B2">B2 - Avanzado</option>
                      <option value="C1">C1 - Competente</option>
                    </select>
                  </div>
                </div>

                {/* Fecha y Puntuación */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega *</label>
                    <input
                      type="date"
                      value={formData.dueDate?.split('T')[0] || ''}
                      onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Puntuación máxima</label>
                    <input
                      type="number"
                      value={formData.maxScore || 100}
                      onChange={e => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                {/* Asignación de alumnos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asignar a:</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="radio"
                        name="assignmentType"
                        checked={assignedToAll}
                        onChange={() => {
                          setAssignedToAll(true)
                          setSelectedStudents([])
                        }}
                      />
                      <span>Todos los alumnos</span>
                    </label>
                    
                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="radio"
                        name="assignmentType"
                        checked={!assignedToAll}
                        onChange={() => setAssignedToAll(false)}
                      />
                      <span>Alumnos específicos</span>
                    </label>
                    
                    {!assignedToAll && (
                      <div className="mt-3 p-3 border border-gray-200 rounded-xl">
                        <p className="text-xs text-gray-500 mb-2">
                          Selecciona los alumnos ({selectedStudents.length} seleccionados):
                        </p>
                        {loadingStudents ? (
                          <div className="flex justify-center py-4">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : studentsList.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">No hay alumnos disponibles</p>
                        ) : (
                          <div className="max-h-48 overflow-y-auto space-y-2">
                            {studentsList.map(student => (
                              <label key={student.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.includes(student.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedStudents([...selectedStudents, student.id])
                                    } else {
                                      setSelectedStudents(selectedStudents.filter(id => id !== student.id))
                                    }
                                  }}
                                />
                                <div className="flex-1">
                                  <span className="text-sm">{student.name}</span>
                                  <span className="text-xs text-gray-400 ml-2">Nivel {student.assignedLevel || 'A1'}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                        {!assignedToAll && selectedStudents.length === 0 && (
                          <p className="text-xs text-red-500 mt-2">⚠️ Selecciona al menos un alumno</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-primary-dark transition"
                >
                  {saving ? 'Guardando...' : 'Guardar Tarea'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  )
}