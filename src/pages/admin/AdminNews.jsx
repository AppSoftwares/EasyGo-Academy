import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/dashboard/AdminLayout'
import { newsService } from '../../services/newsService'

export const AdminNews = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeLevel, setActiveLevel] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)

  useEffect(() => { loadData() }, [activeLevel])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeLevel !== 'all') params.level = activeLevel
      const res = await newsService.getAll(params)
      setNews(res.data?.news || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filtered = news.filter(n =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (item = null) => {
    setEditingItem(item)
    setFormData(item || { 
      title: '', 
      subtitle: '', 
      content: '', 
      contentSpanish: '', 
      level: 'A1', 
      category: 'easygo', 
      readingTime: 3, 
      featured: false, 
      active: true 
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = { ...formData, featured: formData.featured === 'true' || formData.featured === true }
      if (editingItem) await newsService.update(editingItem.id, data)
      else await newsService.create(data)
      setShowModal(false)
      loadData()
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta noticia?')) return
    try { 
      await newsService.delete(id)
      loadData() 
    } catch { 
      alert('Error al eliminar') 
    }
  }

  const getLevelColor = (l) => {
    const colors = { 
      A1: 'bg-emerald-100 text-emerald-700', 
      A2: 'bg-blue-100 text-blue-700', 
      B1: 'bg-amber-100 text-amber-700', 
      B2: 'bg-orange-100 text-orange-700', 
      C1: 'bg-rose-100 text-rose-700' 
    }
    return colors[l] || 'bg-gray-100 text-gray-500'
  }

  const getCategoryIcon = (cat) => {
    const icons = {
      easygo: '🎓',
      business: '💼',
      technology: '💻',
      health: '❤️',
      education: '📚',
      culture: '🎭',
      tips: '💡',
      sports: '⚽',
      entertainment: '🎬',
      science: '🔬',
      world: '🌍',
      usa: '🇺🇸'
    }
    return icons[cat] || '📰'
  }

  const viewDetails = (item) => {
    setSelectedNews(item)
    setShowDetailModal(true)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header - Compacto */}
        <div className="flex flex-row justify-between items-center gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">📰 Noticias</h1>
            <p className="text-xs text-gray-500">{news.length} noticias</p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="bg-primary text-white px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1"
          >
            <span>➕</span> Nueva
          </button>
        </div>

        {/* Filtros - Compactos */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map(l => (
            <button 
              key={l} 
              onClick={() => setActiveLevel(l)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                activeLevel === l 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}>
              {l === 'all' ? 'Todos' : l}
            </button>
          ))}
        </div>

        {/* Búsqueda - Compacta */}
        <div className="relative">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar noticia..."
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">✕</button>
          )}
        </div>

        {/* Versión Desktop - Tabla */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Título</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Nivel</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Categoría</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Min</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">⭐</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Vistas</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(n => (
                  <tr key={n.id} className="hover:bg-gray-50 border-t border-gray-50">
                    <td className="px-3 py-2 text-xs font-semibold text-gray-900 max-w-[180px] truncate" title={n.title}>
                      {n.title}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(n.level)}`}>
                        {n.level}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500 capitalize">{n.category}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{n.readingTime || 2}</td>
                    <td className="px-3 py-2 text-xs">{n.featured ? '⭐' : '-'}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{n.views || 0}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => openModal(n)} className="text-primary text-xs mr-2">Editar</button>
                      <button onClick={() => handleDelete(n.id)} className="text-red-500 text-xs">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No se encontraron noticias</div>}
        </div>

        {/* Versión Mobile - Tarjetas COMPACTAS */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border">No se encontraron noticias</div>
          ) : (
            filtered.map(n => (
              <div key={n.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                {/* Fila superior: nivel + acciones */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(n.level)}`}>
                      {n.level}
                    </span>
                    <span className="text-xs text-gray-400">{getCategoryIcon(n.category)} {n.category}</span>
                    {n.featured && <span className="text-xs">⭐</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => viewDetails(n)} className="text-primary text-xs">🔍</button>
                    <button onClick={() => openModal(n)} className="text-primary text-xs">✏️</button>
                    <button onClick={() => handleDelete(n.id)} className="text-red-500 text-xs">🗑️</button>
                  </div>
                </div>
                {/* Título */}
                <p className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">{n.title}</p>
                {/* Info adicional compacta */}
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-2 mt-1">
                  <span>⏱️ {n.readingTime || 2} min</span>
                  <span>👁️ {n.views || 0} vistas</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Detalles (Móvil) - Compacto */}
        {showDetailModal && selectedNews && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={() => setShowDetailModal(false)}>
            <div className="bg-white rounded-2xl p-4 max-w-sm w-full max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Detalles</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400">✕</button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Título</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedNews.title}</p>
                </div>
                {selectedNews.subtitle && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Subtítulo</p>
                    <p className="text-sm text-gray-600">{selectedNews.subtitle}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Nivel</p>
                    <p className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(selectedNews.level)}`}>
                      {selectedNews.level}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Categoría</p>
                    <p className="capitalize">{selectedNews.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Lectura</p>
                    <p>{selectedNews.readingTime || 2} min</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Vistas</p>
                    <p>{selectedNews.views || 0}</p>
                  </div>
                </div>
                {selectedNews.content && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">📝 Contenido (inglés)</p>
                    <p className="text-xs text-gray-600 line-clamp-3">{selectedNews.content}</p>
                  </div>
                )}
                {selectedNews.contentSpanish && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">🇪🇸 Resumen español</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{selectedNews.contentSpanish}</p>
                  </div>
                )}
                <button onClick={() => { setShowDetailModal(false); openModal(selectedNews) }} 
                  className="w-full bg-primary text-white py-2 rounded-xl font-semibold text-sm mt-2">
                  Editar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Crear/Editar - Compacto */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingItem ? '✏️ Editar' : '➕ Nueva'} Noticia
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Título *</label>
                  <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Subtítulo</label>
                  <input type="text" value={formData.subtitle || ''} onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nivel</label>
                    <select value={formData.level || 'A1'} onChange={e => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                      {['A1','A2','B1','B2','C1'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Categoría</label>
                    <select value={formData.category || 'easygo'} onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                      {['easygo','business','technology','health','education','culture','tips','sports','entertainment','science','world','usa'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Min lectura</label>
                    <input type="number" value={formData.readingTime || 3} onChange={e => setFormData({ ...formData, readingTime: parseInt(e.target.value) })}
                      className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Destacada</label>
                    <select value={formData.featured ? 'true' : 'false'} onChange={e => setFormData({ ...formData, featured: e.target.value === 'true' })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      <option value="false">No</option>
                      <option value="true">⭐ Sí</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Estado</label>
                    <select value={formData.active ? 'true' : 'false'} onChange={e => setFormData({ ...formData, active: e.target.value === 'true' })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      <option value="true">🟢 Activo</option>
                      <option value="false">🔴 Inactivo</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Contenido (inglés)</label>
                  <textarea value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[80px]" rows={3} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Resumen español</label>
                  <textarea value={formData.contentSpanish || ''} onChange={e => setFormData({ ...formData, contentSpanish: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[60px]" rows={2} />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}