// src/pages/teacher/TeacherModules.jsx - Versión Rediseñada
import { useState, useEffect } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { moduleService } from '../../services/moduleService'
import { moduleContentService } from '../../services/moduleContentService'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export const TeacherModules = () => {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState('A1')
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [moduleForm, setModuleForm] = useState({})
  const [saving, setSaving] = useState(false)
  
  // Estado para el módulo seleccionado (vista de detalle)
  const [selectedModule, setSelectedModule] = useState(null)
  const [moduleItems, setModuleItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  
  // Estado para contenido disponible (dentro del mismo panel)
  const [availableContent, setAvailableContent] = useState([])
  const [selectedType, setSelectedType] = useState('lesson')
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingAvailable, setLoadingAvailable] = useState(false)
  const [selectedContentIds, setSelectedContentIds] = useState([])
  const [addingContent, setAddingContent] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1']

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  useEffect(() => {
    loadModules()
  }, [selectedLevel])

  const loadModules = async () => {
    setLoading(true)
    try {
      const res = await moduleService.getModules(selectedLevel)
      if (res.data.success) {
        setModules(res.data.modules || [])
      }
    } catch (error) {
      console.error('Error loading modules:', error)
      showToast('Error al cargar los módulos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadModuleContent = async (moduleId) => {
    setLoadingItems(true)
    try {
      const res = await moduleContentService.getModuleContent(moduleId)
      if (res.data.success) {
        setModuleItems(res.data.items || [])
      }
    } catch (error) {
      console.error('Error loading module content:', error)
      setModuleItems([])
    } finally {
      setLoadingItems(false)
    }
  }

  const loadAvailableContent = async (moduleId, type, search = '') => {
    setLoadingAvailable(true)
    try {
      const res = await moduleContentService.getAvailableContent(moduleId, type, search)
      if (res.data.success) {
        setAvailableContent(res.data.content || [])
      } else {
        setAvailableContent([])
      }
    } catch (error) {
      console.error('Error loading available content:', error)
      setAvailableContent([])
    } finally {
      setLoadingAvailable(false)
    }
  }

  const openModuleManager = async (module) => {
    setSelectedModule(module)
    await loadModuleContent(module.id)
    await loadAvailableContent(module.id, selectedType, searchTerm)
  }

  const handleAddContent = async () => {
    if (selectedContentIds.length === 0 || !selectedModule) {
      showToast('Selecciona al menos un elemento', 'error')
      return
    }
    
    setAddingContent(true)
    let successCount = 0
    
    for (const contentId of selectedContentIds) {
      const content = availableContent.find(c => c.id === contentId)
      if (content) {
        try {
          await moduleContentService.addContentToModule(selectedModule.id, {
            contentId: content.id,
            contentType: content.type,
            order: moduleItems.length + successCount + 1
          })
          successCount++
        } catch (error) {
          console.error('Error adding content:', error)
        }
      }
    }
    
    setSelectedContentIds([])
    setSearchTerm('')
    await loadModuleContent(selectedModule.id)
    await loadAvailableContent(selectedModule.id, selectedType, '')
    showToast(`${successCount} elemento(s) agregado(s) correctamente`)
    setAddingContent(false)
  }

  const handleRemoveContent = async (id, title) => {
    if (!window.confirm(`¿Eliminar "${title}" del módulo?`)) return
    
    try {
      await moduleContentService.removeContent(id)
      await loadModuleContent(selectedModule.id)
      await loadAvailableContent(selectedModule.id, selectedType, searchTerm)
      showToast('Elemento eliminado del módulo')
    } catch (error) {
      showToast('Error al eliminar', 'error')
    }
  }

  const handleTypeChange = async (type) => {
    setSelectedType(type)
    setSelectedContentIds([])
    if (selectedModule) {
      await loadAvailableContent(selectedModule.id, type, searchTerm)
    }
  }

  const handleSearch = async (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (selectedModule) {
      await loadAvailableContent(selectedModule.id, selectedType, value)
    }
  }

  const handleContentDragEnd = async (result) => {
    if (!result.destination || !selectedModule) return
    
    const reorderedItems = Array.from(moduleItems)
    const [removed] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, removed)
    
    const updatedItems = reorderedItems.map((item, idx) => ({
      id: item.id,
      order: idx + 1
    }))
    
    setModuleItems(reorderedItems)
    
    try {
      await moduleContentService.reorderContent(selectedModule.id, updatedItems)
    } catch (error) {
      console.error('Error reordering content:', error)
      loadModuleContent(selectedModule.id)
    }
  }

  const openModuleModal = (module = null) => {
    setEditingModule(module)
    setModuleForm(module || {
      title: '',
      description: '',
      level: selectedLevel,
      order: modules.length + 1
    })
    setShowModuleModal(true)
  }

  const handleSaveModule = async () => {
    if (!moduleForm.title?.trim()) {
      showToast('El título del módulo es requerido', 'error')
      return
    }
    setSaving(true)
    try {
      if (editingModule) {
        await moduleService.updateModule(editingModule.id, moduleForm)
        showToast('Módulo actualizado correctamente')
      } else {
        await moduleService.createModule(moduleForm)
        showToast('Módulo creado correctamente')
      }
      setShowModuleModal(false)
      loadModules()
    } catch (error) {
      showToast('Error: ' + (error.response?.data?.message || error.message), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteModule = async (id, title) => {
    if (!window.confirm(`¿Eliminar el módulo "${title}"? Se eliminará TODO su contenido.`)) return
    try {
      await moduleService.deleteModule(id)
      if (selectedModule?.id === id) setSelectedModule(null)
      loadModules()
      showToast('Módulo eliminado correctamente')
    } catch (error) {
      showToast('Error al eliminar el módulo', 'error')
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return
    
    const items = Array.from(modules)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    const updatedItems = items.map((item, idx) => ({
      id: item.id,
      order: idx + 1
    }))
    
    setModules(items)
    
    try {
      await moduleService.reorderModules(selectedLevel, updatedItems)
    } catch (error) {
      console.error('Error reordering:', error)
      loadModules()
    }
  }

  const getTypeIcon = (type) => {
    const icons = { grammar: '📘', audiobook: '🎧', task: '📝', lesson: '📖', exercise: '✏️', quiz: '📋', video: '🎥', material: '📄' }
    return icons[type] || '📄'
  }

  const getTypeLabel = (type) => {
    const labels = { grammar: 'Gramática', audiobook: 'Audiolibro', task: 'Tarea', lesson: 'Lección', exercise: 'Ejercicio', quiz: 'Quiz', video: 'Video', material: 'Material' }
    return labels[type] || type
  }

  const getTypeColor = (type) => {
    const colors = {
      lesson: 'bg-blue-100 text-blue-700',
      grammar: 'bg-purple-100 text-purple-700',
      audiobook: 'bg-pink-100 text-pink-700',
      task: 'bg-amber-100 text-amber-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  const getLevelBadge = (level) => {
    const colors = { A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700', B1: 'bg-amber-100 text-amber-700', B2: 'bg-orange-100 text-orange-700', C1: 'bg-rose-100 text-rose-700' }
    return colors[level] || 'bg-gray-100 text-gray-500'
  }

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex flex-col justify-center items-center h-96">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Cargando módulos...</p>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      {/* Toast Notifications */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-3xl p-8">
          <div className="relative">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">📦</span>
              Módulos del Curso
            </h1>
            <p className="text-gray-600 mt-2">Organiza los módulos por nivel y gestiona su contenido en un solo lugar.</p>
          </div>
        </div>

        {/* Selector de nivel */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 min-w-[70px] px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedLevel === level
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg">{level === 'A1' ? '🌟' : level === 'A2' ? '📘' : level === 'B1' ? '📗' : level === 'B2' ? '📕' : '🎓'}</span>
                  <span>Nivel {level}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Layout de dos columnas cuando hay un módulo seleccionado */}
        {selectedModule ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Columna izquierda: Lista de módulos */}
            <div className="lg:w-1/3 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-700">Módulos</h2>
                <button onClick={() => openModuleModal()} className="text-primary text-sm font-semibold">+ Nuevo</button>
              </div>
              
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="modules">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {modules.map((module, index) => (
                        <div
                          key={module.id}
                          onClick={() => {
                            setSelectedModule(module)
                            loadModuleContent(module.id)
                            loadAvailableContent(module.id, selectedType, '')
                          }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedModule?.id === module.id
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {module.order_in_module || index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm">{module.title}</h3>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {module.lessons?.length || 0} lecciones
                              </p>
                            </div>
                            {selectedModule?.id === module.id && (
                              <span className="text-primary">✓</span>
                            )}
                          </div>
                        </div>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Columna derecha: Contenido del módulo seleccionado */}
            <div className="lg:w-2/3 space-y-4">
              {/* Header del módulo */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedModule.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedModule.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Pestañas de tipos de contenido */}
              <div className="flex gap-2 border-b border-gray-200">
                {[
                  { id: 'lesson', label: '📖 Lecciones' },
                  { id: 'grammar', label: '📘 Gramática' },
                  { id: 'audiobook', label: '🎧 Audiolibros' },
                  { id: 'task', label: '📝 Tareas' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeChange(type.id)}
                    className={`px-4 py-2 text-sm font-semibold transition-all ${
                      selectedType === type.id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Búsqueda */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar contenido disponible..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Contenido actual del módulo */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>📌 Contenido en este módulo</span>
                  <span className="text-xs text-gray-400">({moduleItems.length})</span>
                </h3>
                
                {loadingItems ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : moduleItems.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-400 text-sm">No hay contenido en este módulo</p>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleContentDragEnd}>
                    <Droppable droppableId="moduleContent">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          {moduleItems.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`bg-white border rounded-xl p-3 flex items-center justify-between transition-all ${
                                    snapshot.isDragging ? 'border-primary shadow-lg' : 'border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div {...provided.dragHandleProps} className="cursor-grab text-gray-400">⋮⋮</div>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(item.contentType)}`}>
                                      {getTypeIcon(item.contentType)}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900 text-sm">{item.details?.title}</h4>
                                      <span className="text-xs text-gray-400">{getTypeLabel(item.contentType)}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveContent(item.id, item.details?.title)}
                                    className="text-red-400 hover:text-red-600 p-1"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>

              {/* Contenido disponible para agregar */}
              <div className="border-t border-gray-200 pt-4 mt-2">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>📚 Contenido disponible para agregar</span>
                  {selectedContentIds.length > 0 && (
                    <button
                      onClick={handleAddContent}
                      disabled={addingContent}
                      className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                    >
                      {addingContent ? 'Agregando...' : `Agregar (${selectedContentIds.length})`}
                    </button>
                  )}
                </h3>

                {loadingAvailable ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : availableContent.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-400 text-sm">
                      No hay {getTypeLabel(selectedType).toLowerCase()} disponible para agregar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {availableContent.map(content => (
                      <label
                        key={content.id}
                        className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                          selectedContentIds.includes(content.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedContentIds.includes(content.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedContentIds([...selectedContentIds, content.id])
                            } else {
                              setSelectedContentIds(selectedContentIds.filter(id => id !== content.id))
                            }
                          }}
                          className="w-4 h-4 text-primary rounded"
                        />
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(content.type)}`}>
                          {getTypeIcon(content.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{content.title}</h4>
                          {content.description && (
                            <p className="text-xs text-gray-400 line-clamp-1">{content.description}</p>
                          )}
                        </div>
                        {content.level && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelBadge(content.level)}`}>
                            {content.level}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Vista de lista de módulos (sin selección) */
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{modules.length} módulos disponibles</p>
              <button onClick={() => openModuleModal()} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold">
                + Crear Módulo
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-8xl mb-4 opacity-50">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay módulos creados</h3>
                <button onClick={() => openModuleModal()} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold">
                  + Crear primer módulo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() => openModuleManager(module)}
                    className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-primary/30 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📦</span>
                          <h3 className="font-bold text-gray-900">{module.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelBadge(module.level)}`}>
                            {module.level}
                          </span>
                        </div>
                        {module.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{module.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-400">📖 {module.lessons?.length || 0} lecciones</span>
                          <span className="text-xs text-gray-400">📦 {moduleItems.length} elementos</span>
                        </div>
                      </div>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openModuleModal(module)} className="text-primary p-2 hover:bg-primary/10 rounded-lg">✏️</button>
                        <button onClick={() => handleDeleteModule(module.id, module.title)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">🗑️</button>
                      </div>
                    </div>
                    <button className="mt-3 w-full py-2 text-primary text-sm font-semibold border border-primary/20 rounded-xl hover:bg-primary/5 transition">
                      Gestionar contenido →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar Módulo */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowModuleModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingModule ? '✏️ Editar Módulo' : '➕ Nuevo Módulo'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={moduleForm.title || ''}
                  onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  placeholder="Ej: My Identity at Work"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={moduleForm.description || ''}
                  onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                  <select
                    value={moduleForm.level || selectedLevel}
                    onChange={e => setModuleForm({ ...moduleForm, level: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  >
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input
                    type="number"
                    value={moduleForm.order || modules.length + 1}
                    onChange={e => setModuleForm({ ...moduleForm, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    min="1"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveModule} disabled={saving} className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button onClick={() => setShowModuleModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">
                Cancelar
              </button>
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
      `}</style>
    </TeacherLayout>
  )
}