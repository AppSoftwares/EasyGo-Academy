// src/pages/teacher/TeacherContent.jsx - Versión Mejorada
import { useState, useEffect } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'

export const TeacherContent = () => {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1']

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setLoading(true)
    try {
      const res = await teacherService.getContent()
      if (res.data.success) {
        setContent(res.data.content || [])
        showToast('Contenido cargado correctamente')
      }
    } catch (error) {
      console.error('Error loading content:', error)
      showToast('Error al cargar el contenido', 'error')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item = null) => {
    setEditingItem(item)
    setFormData(item || {
      title: '',
      description: '',
      type: 'lesson',
      level: 'A1',
      fileUrl: '',
      embedCode: '',
      externalLink: '',
      duration: '',
      tags: ''
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      showToast('El título es requerido', 'error')
      return
    }
    setSaving(true)
    try {
      if (editingItem) {
        await teacherService.updateContent(editingItem.id, formData)
        showToast('Contenido actualizado correctamente')
      } else {
        await teacherService.createContent(formData)
        showToast('Contenido creado correctamente')
      }
      setShowModal(false)
      loadContent()
    } catch (error) {
      showToast('Error al guardar: ' + (error.response?.data?.message || error.message), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await teacherService.deleteContent(id)
      loadContent()
      showToast('Contenido eliminado correctamente')
      setShowDeleteConfirm(null)
    } catch (error) {
      showToast('Error al eliminar', 'error')
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      lesson: '📖',
      material: '📄',
      video: '🎥',
      link: '🔗',
      exercise: '✏️',
      quiz: '📝',
      audio: '🎧',
      module: '📦'
    }
    return icons[type] || '📄'
  }

  const getTypeLabel = (type) => {
    const labels = {
      lesson: 'Lección',
      material: 'Material',
      video: 'Video',
      link: 'Enlace',
      exercise: 'Ejercicio',
      quiz: 'Quiz',
      audio: 'Audio',
      module: 'Módulo'
    }
    return labels[type] || type
  }

  const getTypeColor = (type) => {
    const colors = {
      lesson: 'bg-blue-100 text-blue-700',
      material: 'bg-indigo-100 text-indigo-700',
      video: 'bg-red-100 text-red-700',
      link: 'bg-green-100 text-green-700',
      exercise: 'bg-amber-100 text-amber-700',
      quiz: 'bg-purple-100 text-purple-700',
      audio: 'bg-pink-100 text-pink-700',
      module: 'bg-gray-100 text-gray-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  const getLevelColor = (level) => {
    const colors = {
      A1: 'bg-emerald-100 text-emerald-700',
      A2: 'bg-blue-100 text-blue-700',
      B1: 'bg-amber-100 text-amber-700',
      B2: 'bg-orange-100 text-orange-700',
      C1: 'bg-rose-100 text-rose-700'
    }
    return colors[level] || 'bg-gray-100 text-gray-500'
  }

  // Filtros
  const filteredContent = content.filter(item => {
    if (activeTab !== 'all' && item.type !== activeTab) return false
    if (selectedLevel !== 'all' && item.level !== selectedLevel) return false
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description?.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  // Estadísticas
  const stats = {
    total: content.length,
    byType: {
      lesson: content.filter(c => c.type === 'lesson').length,
      material: content.filter(c => c.type === 'material').length,
      video: content.filter(c => c.type === 'video').length,
      audio: content.filter(c => c.type === 'audio').length,
      exercise: content.filter(c => c.type === 'exercise').length,
      quiz: content.filter(c => c.type === 'quiz').length,
      link: content.filter(c => c.type === 'link').length
    }
  }

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex flex-col justify-center items-center h-96">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Cargando biblioteca...</p>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      {/* Toast Notifications */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header mejorado */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-3xl p-8">
          <div className="relative">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">📚</span>
              Biblioteca de Contenido
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona todos los recursos educativos: lecciones, materiales, videos, ejercicios y más.
            </p>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {[
            { type: 'all', label: 'Todos', icon: '📚', count: stats.total, color: 'bg-gray-100' },
           // { type: 'lesson', label: 'Lecciones', icon: '📖', count: stats.byType.lesson, color: 'bg-blue-100' },
            { type: 'material', label: 'Materiales', icon: '📄', count: stats.byType.material, color: 'bg-indigo-100' },
            { type: 'video', label: 'Videos', icon: '🎥', count: stats.byType.video, color: 'bg-red-100' },
            { type: 'audio', label: 'Audios', icon: '🎧', count: stats.byType.audio, color: 'bg-pink-100' },
            { type: 'exercise', label: 'Ejercicios', icon: '✏️', count: stats.byType.exercise, color: 'bg-amber-100' },
            { type: 'quiz', label: 'Quizzes', icon: '📝', count: stats.byType.quiz, color: 'bg-purple-100' }
          ].map(stat => (
            <button
              key={stat.type}
              onClick={() => setActiveTab(stat.type)}
              className={`p-3 rounded-2xl text-center transition-all ${
                activeTab === stat.type 
                  ? `${stat.color} ring-2 ring-primary shadow-md scale-105` 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl block mb-1">{stat.icon}</span>
              <p className="text-xs font-bold text-gray-700 hidden sm:block">{stat.label}</p>
              <p className="text-lg font-black text-primary">{stat.count}</p>
            </button>
          ))}
        </div>

        {/* Barra de filtros */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="🔍 Buscar por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            </div>
            
            {/* Filtro por nivel */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            >
              <option value="all">Todos los niveles</option>
              {levels.map(level => (
                <option key={level} value={level}>Nivel {level}</option>
              ))}
            </select>
            
            {/* Vista toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                title="Vista cuadrícula"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                title="Vista lista"
              >
                ☰
              </button>
            </div>
            
            {/* Botón nuevo recurso */}
            <button 
              onClick={() => openModal()} 
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-lg">+</span>
              Nuevo Recurso
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {filteredContent.length} de {stats.total} recursos
          </p>
        </div>

        {/* Content Grid mejorado */}
        {filteredContent.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-8xl mb-4 opacity-50">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay contenido</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || activeTab !== 'all' || selectedLevel !== 'all'
                ? 'No se encontraron resultados con los filtros actuales'
                : 'Comienza creando tu primer recurso educativo'}
            </p>
            {(searchTerm || activeTab !== 'all' || selectedLevel !== 'all') ? (
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setActiveTab('all')
                  setSelectedLevel('all')
                }} 
                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-semibold"
              >
                Limpiar filtros
              </button>
            ) : (
              <button onClick={() => openModal()} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold">
                + Crear primer recurso
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredContent.map(item => (
              <div key={item.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`h-2 bg-gradient-to-r ${item.type === 'lesson' ? 'from-blue-500 to-blue-600' : 
                  item.type === 'material' ? 'from-indigo-500 to-indigo-600' :
                  item.type === 'video' ? 'from-red-500 to-red-600' :
                  item.type === 'audio' ? 'from-pink-500 to-pink-600' :
                  item.type === 'exercise' ? 'from-amber-500 to-amber-600' :
                  item.type === 'quiz' ? 'from-purple-500 to-purple-600' : 'from-gray-500 to-gray-600'}`} />
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(item.level)}`}>
                          {item.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => openModal(item)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg">✏️</button>
                      <button onClick={() => setShowDeleteConfirm(item)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">🗑️</button>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {item.description || 'Sin descripción'}
                  </p>

                  {/* Badge de tipo */}
                  <div className="mb-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </div>

                  {/* Tags */}
                  {item.tags && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.split(',').slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Métricas */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">👁️ {item.views || 0}</span>
                    <span className="flex items-center gap-1">📥 {item.downloads || 0}</span>
                    {item.duration && <span className="flex items-center gap-1">⏱️ {item.duration}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Tipo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Título</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Nivel</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Vistas</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredContent.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(item.type)}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(item.type)}`}>
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(item.level)}`}>
                          {item.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.views || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openModal(item)} className="text-primary p-1.5 hover:bg-primary/10 rounded-lg">✏️</button>
                          <button onClick={() => setShowDeleteConfirm(item)} className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar - FUERA del space-y-6 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem ? '✏️ Editar Recurso' : '➕ Nuevo Recurso'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editingItem ? 'Actualiza la información del recurso' : 'Completa los datos para crear un nuevo recurso'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl transition">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  placeholder="Ej: Guía de verbos irregulares"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  rows={3}
                  placeholder="Breve descripción del recurso..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    value={formData.type || 'lesson'}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="lesson">📖 Lección</option>
                    <option value="material">📄 Material (PDF/DOC)</option>
                    <option value="video">🎥 Video</option>
                    <option value="audio">🎧 Audio</option>
                    <option value="link">🔗 Enlace web</option>
                    <option value="exercise">✏️ Ejercicio</option>
                    <option value="quiz">📝 Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel *</label>
                  <select
                    value={formData.level || 'A1'}
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="A1">🌟 A1 - Principiante</option>
                    <option value="A2">📘 A2 - Básico</option>
                    <option value="B1">📗 B1 - Intermedio</option>
                    <option value="B2">📕 B2 - Avanzado</option>
                    <option value="C1">🎓 C1 - Competente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'link' ? 'Enlace web' : 'URL del recurso (opcional)'}
                </label>
                <input
                  type="url"
                  value={formData.fileUrl || formData.externalLink || ''}
                  onChange={e => {
                    if (formData.type === 'link') {
                      setFormData({ ...formData, externalLink: e.target.value })
                    } else {
                      setFormData({ ...formData, fileUrl: e.target.value })
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (opcional)</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    placeholder="Ej: 10:30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separados por coma)</label>
                  <input
                    type="text"
                    value={formData.tags || ''}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    placeholder="gramática, verbos, PDF"
                  />
                </div>
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código embed (opcional)</label>
                  <textarea
                    value={formData.embedCode || ''}
                    onChange={e => setFormData({ ...formData, embedCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono"
                    rows={2}
                    placeholder="<iframe src='...'></iframe>"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-all hover:shadow-lg"
              >
                {saving ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Crear')}
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

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🗑️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar recurso?</h3>
              <p className="text-gray-500 mb-6">
                ¿Estás seguro de que quieres eliminar "{showDeleteConfirm.title}"? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(showDeleteConfirm.id)}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 transition"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </TeacherLayout>
  )
}