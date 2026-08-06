// src/pages/ResourcesPage.jsx
import { useState, useEffect } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { contentService } from '../services/contentService'
import { useAuthStore } from '../store/useAuthStore'

export const ResourcesPage = () => {
  const { user } = useAuthStore()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedResource, setSelectedResource] = useState(null)

  // Obtener el nivel del usuario para filtrar contenido
  const userLevel = user?.assignedLevel || user?.finalAssignedLevel || 'A1'

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      const res = await contentService.getAll()
      if (res.data.success) {
        setResources(res.data.content || [])
      }
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obtener tipos únicos para los tabs (desde los datos reales)
  const getUniqueTypes = () => {
    const types = new Set(resources.map(r => r.type))
    return Array.from(types)
  }

  // Contar recursos por tipo
  const getCountByType = (type) => {
    if (type === 'all') return resources.length
    return resources.filter(r => r.type === type).length
  }

  // Filtrar recursos
  const filteredResources = resources.filter(resource => {
    const matchesTab = activeTab === 'all' || resource.type === activeTab
    const matchesSearch = resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags?.toLowerCase().includes(searchTerm.toLowerCase())
    // Solo mostrar recursos del nivel del usuario o inferiores (según regla de negocio)
    const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5 }
    const userLevelValue = levelOrder[userLevel] || 1
    const resourceLevelValue = levelOrder[resource.level] || 1
    const matchesLevel = resourceLevelValue <= userLevelValue
    
    return matchesTab && matchesSearch && matchesLevel
  })

  const getTypeIcon = (type) => {
    const icons = {
      material: '📄',
      video: '🎥',
      audio: '🎧',
      link: '🔗',
      exercise: '✏️',
      quiz: '📝'
    }
    return icons[type] || '📄'
  }

  const getTypeLabel = (type) => {
    const labels = {
      material: 'Material',
      video: 'Video',
      audio: 'Audio',
      link: 'Enlace',
      exercise: 'Ejercicio',
      quiz: 'Quiz'
    }
    return labels[type] || type
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

  const handleDownload = async (resource) => {
    if (resource.fileUrl) {
      // Incrementar contador de descargas
      try {
        await contentService.recordDownload(resource.id)
        // Abrir enlace de descarga
        window.open(resource.fileUrl, '_blank')
      } catch (error) {
        console.error('Error recording download:', error)
        window.open(resource.fileUrl, '_blank')
      }
    } else if (resource.externalLink) {
      window.open(resource.externalLink, '_blank')
    } else {
      alert('No hay archivo disponible para descargar')
    }
  }

  const handlePreview = (resource) => {
    setSelectedResource(resource)
    // Registrar vista
    if (resource.id) {
      contentService.recordView(resource.id).catch(console.error)
    }
  }

  // Tabs dinámicos desde los datos reales
  const tabs = [
    { id: 'all', label: 'Todos', icon: '📚' },
    ...getUniqueTypes().map(type => ({
      id: type,
      label: getTypeLabel(type),
      icon: getTypeIcon(type)
    }))
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Centro de Recursos</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Material educativo compartido por tus profesores
              {userLevel && <span className="text-primary ml-2">Nivel: {userLevel}</span>}
            </p>
          </div>
          
          {/* View toggle */}
          <div className="hidden sm:flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              🔲 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              📋 Lista
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Buscar recursos por nombre, descripción o nivel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm sm:text-base bg-white"
          />
          <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl">🔍</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tabs - Dinámicos */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <span className="text-sm sm:text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {getCountByType(tab.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <span>{filteredResources.length} de {resources.length} recursos disponibles</span>
          {activeTab !== 'all' && (
            <button 
              onClick={() => setActiveTab('all')}
              className="text-primary hover:underline font-semibold"
            >
              Mostrar todos
            </button>
          )}
        </div>

        {/* Vista Grid */}
        {viewMode === 'grid' && filteredResources.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id} 
                className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative"
              >
                {/* Badge de nivel */}
                <span className={`absolute top-3 right-3 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold ${getLevelColor(resource.level)}`}>
                  Nivel {resource.level}
                </span>

                {/* Icono */}
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                  {getTypeIcon(resource.type)}
                </div>

                {/* Info */}
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 pr-16">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                  {resource.description || 'Sin descripción'}
                </p>

                {/* Meta info */}
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400 mb-3 sm:mb-4">
                  {resource.duration && <span>⏱️ {resource.duration}</span>}
                  {resource.fileUrl && <span>📦 Archivo</span>}
                  {resource.externalLink && <span>🔗 Enlace</span>}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400 mb-3 sm:mb-4">
                  <span>👁️ {resource.views || 0}</span>
                  <span>⬇️ {resource.downloads || 0}</span>
                </div>

                {/* Tags */}
                {resource.tags && (
                  <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                    {resource.tags.split(',').slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(resource)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all"
                  >
                    👁️ Vista Previa
                  </button>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all"
                  >
                    ⬇️ Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista Lista */}
        {viewMode === 'list' && filteredResources.length > 0 && (
          <div className="hidden sm:block space-y-2">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {getTypeIcon(resource.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{resource.description || 'Sin descripción'}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${getLevelColor(resource.level)}`}>
                      Nivel {resource.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    {resource.duration && <span>⏱️ {resource.duration}</span>}
                    <span>👁️ {resource.views || 0}</span>
                    <span>⬇️ {resource.downloads || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handlePreview(resource)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    ⬇️ Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredResources.length === 0 && !loading && (
          <div className="text-center py-12">
            <span className="text-5xl sm:text-6xl block mb-4">📭</span>
            <p className="text-gray-500 text-base sm:text-lg">No se encontraron recursos</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">No hay material educativo disponible para tu nivel aún</p>
          </div>
        )}

        {/* Modal de Vista Previa */}
        {selectedResource && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedResource(null)}>
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-4xl sm:text-5xl">{getTypeIcon(selectedResource.type)}</span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{selectedResource.title}</h3>
                    <span className="text-xs sm:text-sm text-gray-500">{getTypeLabel(selectedResource.type)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{selectedResource.description || 'Sin descripción'}</p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Nivel</p>
                  <p className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getLevelColor(selectedResource.level)}`}>
                    {selectedResource.level}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Tipo</p>
                  <p className="font-semibold text-sm sm:text-base">{getTypeLabel(selectedResource.type)}</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Vistas</p>
                  <p className="font-semibold text-sm sm:text-base">{selectedResource.views || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Descargas</p>
                  <p className="font-semibold text-sm sm:text-base">{selectedResource.downloads || 0}</p>
                </div>
              </div>

              {selectedResource.tags && (
                <div className="mb-4 sm:mb-6">
                  <p className="text-xs text-gray-500 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedResource.tags.split(',').map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    handleDownload(selectedResource)
                    setSelectedResource(null)
                  }}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base"
                >
                  ⬇️ Descargar
                </button>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}