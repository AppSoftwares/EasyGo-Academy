import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/dashboard/AdminLayout'
import { audiobookService } from '../../services/audiobookService'

export const AdminAudiobooks = () => {
  const [audiobooks, setAudiobooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeLevel, setActiveLevel] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAudiobook, setSelectedAudiobook] = useState(null)

  useEffect(() => { loadData() }, [activeLevel])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeLevel !== 'all') params.level = activeLevel
      const res = await audiobookService.getAll(params)
      setAudiobooks(res.data?.audiobooks || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filtered = audiobooks.filter(a =>
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.narrator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (item = null) => {
    setEditingItem(item)
    setFormData(item || { 
      title: '', 
      description: '', 
      level: 'A1', 
      category: 'stories', 
      duration: '', 
      narrator: '', 
      accent: 'American', 
      audioUrl: '', 
      active: true 
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingItem) await audiobookService.update(editingItem.id, formData)
      else await audiobookService.create(formData)
      setShowModal(false)
      loadData()
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este audiolibro?')) return
    try { 
      await audiobookService.delete(id)
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
      stories: '📖',
      dialogues: '💬',
      business: '💼',
      daily: '☀️',
      news: '📰',
      interviews: '🎙️',
      academic: '🎓',
      other: '📌'
    }
    return icons[cat] || '🎧'
  }

  const viewDetails = (audiobook) => {
    setSelectedAudiobook(audiobook)
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
            <h1 className="text-xl font-bold text-gray-900">🎧 Audiolibros</h1>
            <p className="text-xs text-gray-500">{audiobooks.length} audiolibros</p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="bg-primary text-white px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1"
          >
            <span>➕</span> Nuevo
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
            placeholder="🔍 Buscar audiolibro..."
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
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Duración</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Narrador</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Plays</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 border-t border-gray-50">
                    <td className="px-3 py-2 text-xs font-semibold text-gray-900 max-w-[180px] truncate" title={a.title}>
                      {a.title}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(a.level)}`}>
                        {a.level}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500 capitalize">{a.category}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{a.duration || '-'}</td>
                    <td className="px-3 py-2 text-xs text-gray-500 max-w-[100px] truncate">{a.narrator || '-'}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{a.plays || 0}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => openModal(a)} className="text-primary text-xs mr-2">Editar</button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-500 text-xs">Eliminar</button>
                    </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No se encontraron audiolibros</div>}
        </div>

        {/* Versión Mobile - Tarjetas COMPACTAS */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border">No se encontraron audiolibros</div>
          ) : (
            filtered.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                {/* Fila superior: nivel + acciones */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(a.level)}`}>
                      {a.level}
                    </span>
                    <span className="text-xs text-gray-400">{getCategoryIcon(a.category)} {a.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => viewDetails(a)} className="text-primary text-xs">🔍</button>
                    <button onClick={() => openModal(a)} className="text-primary text-xs">✏️</button>
                    <button onClick={() => handleDelete(a.id)} className="text-red-500 text-xs">🗑️</button>
                  </div>
                </div>
                {/* Título */}
                <p className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">{a.title}</p>
                {/* Info adicional compacta */}
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-2 mt-1">
                  <span>🎙️ {a.narrator || '?'}</span>
                  <span>⏱️ {a.duration || '-'}</span>
                  <span>▶️ {a.plays || 0}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Detalles (Móvil) - Compacto */}
        {showDetailModal && selectedAudiobook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={() => setShowDetailModal(false)}>
            <div className="bg-white rounded-2xl p-4 max-w-sm w-full max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Detalles</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400">✕</button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Título</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedAudiobook.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Nivel</p>
                    <p className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(selectedAudiobook.level)}`}>
                      {selectedAudiobook.level}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Categoría</p>
                    <p className="capitalize">{selectedAudiobook.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Duración</p>
                    <p>{selectedAudiobook.duration || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Reproducciones</p>
                    <p>{selectedAudiobook.plays || 0}</p>
                  </div>
                </div>
                {selectedAudiobook.narrator && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">🎙️ Narrador</p>
                    <p className="text-sm">{selectedAudiobook.narrator}</p>
                  </div>
                )}
                {selectedAudiobook.accent && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">🗣️ Acento</p>
                    <p className="text-sm">{selectedAudiobook.accent}</p>
                  </div>
                )}
                {selectedAudiobook.description && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">📝 Descripción</p>
                    <p className="text-sm text-gray-600">{selectedAudiobook.description}</p>
                  </div>
                )}
                {selectedAudiobook.audioUrl && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">🔗 URL</p>
                    <p className="text-xs text-blue-500 truncate">{selectedAudiobook.audioUrl}</p>
                  </div>
                )}
                <button onClick={() => { setShowDetailModal(false); openModal(selectedAudiobook) }} 
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
                {editingItem ? '✏️ Editar' : '➕ Nuevo'} Audiolibro
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Título *</label>
                  <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción</label>
                  <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[60px]" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nivel</label>
                    <select value={formData.level || 'A1'} onChange={e => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      {['A1','A2','B1','B2','C1'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Categoría</label>
                    <select value={formData.category || 'stories'} onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      {['stories','dialogues','business','daily','news','interviews','academic','other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Duración</label>
                    <input type="text" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="Ej: 15:30" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Narrador</label>
                    <input type="text" value={formData.narrator || ''} onChange={e => setFormData({ ...formData, narrator: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Acento</label>
                    <select value={formData.accent || 'American'} onChange={e => setFormData({ ...formData, accent: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      {['American','British','Australian','Mixed','Other'].map(a => <option key={a} value={a}>{a}</option>)}
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
                  <label className="block text-xs font-semibold text-gray-500 mb-1">URL del Audio</label>
                  <input type="text" value={formData.audioUrl || ''} onChange={e => setFormData({ ...formData, audioUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="https://..." />
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