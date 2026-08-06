// src/components/teacher/ModuleContentManager.jsx
import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { moduleContentService } from '../../services/moduleContentService'

export const ModuleContentManager = ({ moduleId, moduleTitle, onClose }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedType, setSelectedType] = useState('lesson')
  const [availableContent, setAvailableContent] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    loadModuleContent()
  }, [moduleId])

  const loadModuleContent = async () => {
    try {
      const res = await moduleContentService.getModuleContent(moduleId)
      if (res.data.success) {
        setItems(res.data.items)
      }
    } catch (error) {
      console.error('Error loading module content:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableContent = async () => {
    try {
      const res = await moduleContentService.getAvailableContent(moduleId, selectedType, searchTerm)
      if (res.data.success) {
        setAvailableContent(res.data.content)
      }
    } catch (error) {
      console.error('Error loading available content:', error)
    }
  }

  useEffect(() => {
    if (showAddModal) {
      loadAvailableContent()
    }
  }, [showAddModal, selectedType, searchTerm])

  const handleAddContent = async () => {
    if (selectedItems.length === 0) return
    
    for (const contentId of selectedItems) {
      const content = availableContent.find(c => c.id === contentId)
      if (content) {
        await moduleContentService.addContentToModule(moduleId, {
          contentId: content.id,
          contentType: content.type,
          order: items.length + 1
        })
      }
    }
    
    setShowAddModal(false)
    setSelectedItems([])
    loadModuleContent()
    alert('Contenido agregado correctamente')
  }

  const handleRemoveContent = async (id, title) => {
    if (!window.confirm(`¿Eliminar "${title}" del módulo?`)) return
    
    try {
      await moduleContentService.removeContent(id)
      loadModuleContent()
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return
    
    const reorderedItems = Array.from(items)
    const [removed] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, removed)
    
    const updatedItems = reorderedItems.map((item, idx) => ({
      id: item.id,
      order: idx + 1
    }))
    
    setItems(reorderedItems)
    
    try {
      await moduleContentService.reorderContent(moduleId, updatedItems)
    } catch (error) {
      console.error('Error reordering:', error)
      loadModuleContent()
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      grammar: '📘',
      audiobook: '🎧',
      task: '📝',
      lesson: '📖',
      exercise: '✏️',
      quiz: '📋'
    }
    return icons[type] || '📄'
  }

  const getTypeLabel = (type) => {
    const labels = {
      grammar: 'Gramática',
      audiobook: 'Audiolibro',
      task: 'Tarea',
      lesson: 'Lección',
      exercise: 'Ejercicio',
      quiz: 'Quiz'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{moduleTitle}</h2>
          <p className="text-sm text-gray-500">{items.length} elementos en este módulo</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          + Agregar contenido
        </button>
      </div>

      {/* Lista de contenido (drag & drop) */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="moduleContent">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {items.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <span className="text-4xl block mb-2">📭</span>
                  <p className="text-gray-500">No hay contenido en este módulo</p>
                  <p className="text-sm text-gray-400">Usa el botón "Agregar contenido" para empezar</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white border rounded-xl p-4 flex items-center justify-between transition-all ${
                          snapshot.isDragging ? 'border-primary shadow-lg' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div {...provided.dragHandleProps} className="cursor-grab text-gray-400">
                            ⋮⋮
                          </div>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                            {getTypeIcon(item.contentType)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.details?.title || 'Sin título'}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                                {getTypeLabel(item.contentType)}
                              </span>
                              {item.isRequired && (
                                <span className="text-xs text-orange-500">Obligatorio</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveContent(item.id, item.details?.title)}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Modal para agregar contenido */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Agregar contenido al módulo</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>

            {/* Selector de tipo */}
            <div className="flex gap-2 mb-4 border-b pb-2">
              {[
                { id: 'lesson', label: '📖 Lecciones', icon: '📖' },
                { id: 'grammar', label: '📘 Gramática', icon: '📘' },
                { id: 'audiobook', label: '🎧 Audiolibros', icon: '🎧' },
                { id: 'task', label: '📝 Tareas', icon: '📝' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    selectedType === type.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Búsqueda */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="🔍 Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            {/* Lista de contenido disponible */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableContent.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay contenido disponible de este tipo
                </div>
              ) : (
                availableContent.map(content => (
                  <label key={content.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(content.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, content.id])
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== content.id))
                        }
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{content.title}</h4>
                      <p className="text-sm text-gray-500">{content.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{content.level}</span>
                  </label>
                ))
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddContent}
                disabled={selectedItems.length === 0}
                className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
              >
                Agregar ({selectedItems.length})
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}