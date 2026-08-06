import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/dashboard/AdminLayout'
import { pronunciationService } from '../../services/pronunciationService'

export const AdminPronunciation = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeLevel, setActiveLevel] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => { loadData() }, [activeLevel])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeLevel !== 'all') params.level = activeLevel
      const res = await pronunciationService.getAll(params)
      setItems(res.data?.pronunciations || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filtered = items.filter(i =>
    i.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (item = null) => {
    setEditingItem(item)
    setFormData(item || { 
      word: '', 
      translation: '', 
      spanishPronunciation: '', 
      phonetic: '', 
      level: 'A1', 
      category: 'common_words', 
      difficulty: 'easy', 
      tips: '', 
      active: true 
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingItem) await pronunciationService.update(editingItem.id, formData)
      else await pronunciationService.create(formData)
      setShowModal(false)
      loadData()
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta palabra?')) return
    try { 
      await pronunciationService.delete(id)
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

  const getDifficultyColor = (d) => {
    const colors = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-red-100 text-red-700'
    }
    return colors[d] || 'bg-gray-100 text-gray-500'
  }

  const getCategoryIcon = (cat) => {
    const icons = {
      common_words: '📖',
      workplace: '💼',
      daily_life: '☀️',
      consonants: '🔇',
      vowels: '🔊',
      silent_letters: '🤫',
      stress: '⚠️',
      intonation: '📈',
      tongue_twisters: '👅'
    }
    return icons[cat] || '🎤'
  }

  const viewDetails = (item) => {
    setSelectedItem(item)
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
            <h1 className="text-xl font-bold text-gray-900">🎤 Pronunciación</h1>
            <p className="text-xs text-gray-500">{items.length} palabras</p>
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
            placeholder="🔍 Buscar palabra..."
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
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Palabra</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Traducción</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Pronunciación</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Nivel</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Dif.</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.id} className="hover:bg-gray-50 border-t border-gray-50">
                    <td className="px-3 py-2 text-xs font-semibold text-gray-900">{i.word}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{i.translation}</td>
                    <td className="px-3 py-2 text-xs text-gray-400 italic">{i.spanishPronunciation || '-'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(i.level)}`}>
                        {i.level}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getDifficultyColor(i.difficulty)}`}>
                        {i.difficulty}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => openModal(i)} className="text-primary text-xs mr-2">Editar</button>
                      <button onClick={() => handleDelete(i.id)} className="text-red-500 text-xs">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No se encontraron palabras</div>}
        </div>

        {/* Versión Mobile - Tarjetas COMPACTAS */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border">No se encontraron palabras</div>
          ) : (
            filtered.map(i => (
              <div key={i.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                {/* Fila superior: nivel + acciones */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(i.level)}`}>
                      {i.level}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getDifficultyColor(i.difficulty)}`}>
                      {i.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">{getCategoryIcon(i.category)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => viewDetails(i)} className="text-primary text-xs">🔍</button>
                    <button onClick={() => openModal(i)} className="text-primary text-xs">✏️</button>
                    <button onClick={() => handleDelete(i.id)} className="text-red-500 text-xs">🗑️</button>
                  </div>
                </div>
                {/* Palabra y traducción */}
                <p className="text-sm font-semibold text-gray-800">{i.word}</p>
                <p className="text-xs text-gray-500">{i.translation}</p>
                {/* Pronunciación */}
                {i.spanishPronunciation && (
                  <p className="text-xs text-gray-400 italic mt-1">/{i.spanishPronunciation}/</p>
                )}
                {/* Info adicional compacta */}
                {i.phonetic && (
                  <div className="text-[10px] text-gray-400 border-t border-gray-50 pt-2 mt-2">
                    🔤 {i.phonetic}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal de Detalles (Móvil) - Compacto */}
        {showDetailModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={() => setShowDetailModal(false)}>
            <div className="bg-white rounded-2xl p-4 max-w-sm w-full max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Detalles</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400">✕</button>
              </div>
              <div className="space-y-3">
                <div className="text-center pb-2 border-b">
                  <p className="text-2xl font-bold text-gray-900">{selectedItem.word}</p>
                  <p className="text-sm text-gray-500">{selectedItem.translation}</p>
                  {selectedItem.spanishPronunciation && (
                    <p className="text-xs text-gray-400 italic mt-1">/{selectedItem.spanishPronunciation}/</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Nivel</p>
                    <p className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(selectedItem.level)}`}>
                      {selectedItem.level}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Dificultad</p>
                    <p className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getDifficultyColor(selectedItem.difficulty)}`}>
                      {selectedItem.difficulty}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Categoría</p>
                    <p className="capitalize">{selectedItem.category?.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Fonética</p>
                    <p>{selectedItem.phonetic || '-'}</p>
                  </div>
                </div>
                {selectedItem.tips && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">💡 Tip</p>
                    <p className="text-xs text-gray-600">{selectedItem.tips}</p>
                  </div>
                )}
                <button onClick={() => { setShowDetailModal(false); openModal(selectedItem) }} 
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
                {editingItem ? '✏️ Editar' : '➕ Nueva'} Palabra
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Palabra *</label>
                  <input type="text" value={formData.word || ''} onChange={e => setFormData({ ...formData, word: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Traducción *</label>
                  <input type="text" value={formData.translation || ''} onChange={e => setFormData({ ...formData, translation: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Pronunciación (español)</label>
                  <input type="text" value={formData.spanishPronunciation || ''} onChange={e => setFormData({ ...formData, spanishPronunciation: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="ej: jolou" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Fonética (IPA)</label>
                  <input type="text" value={formData.phonetic || ''} onChange={e => setFormData({ ...formData, phonetic: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="/həˈləʊ/" />
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
                    <select value={formData.category || 'common_words'} onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                      {['common_words','workplace','daily_life','consonants','vowels','silent_letters','stress','intonation','tongue_twisters'].map(c => (
                        <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Dificultad</label>
                    <select value={formData.difficulty || 'easy'} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                      <option value="easy">Fácil</option>
                      <option value="medium">Media</option>
                      <option value="hard">Difícil</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Tips de pronunciación</label>
                  <textarea value={formData.tips || ''} onChange={e => setFormData({ ...formData, tips: e.target.value })}
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