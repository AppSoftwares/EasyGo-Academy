import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/dashboard/AdminLayout'
import { questionService } from '../../services/questionService'

export const AdminQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeLevel, setActiveLevel] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  useEffect(() => { loadQuestions() }, [activeLevel])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeLevel !== 'all') params.level = activeLevel
      const res = await questionService.getAll(params)
      setQuestions(res.data?.questions || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filtered = questions.filter(q =>
    q.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.section?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (item = null) => {
    setEditingItem(item)
    setFormData(item || { 
      question: '', 
      type: 'multiple', 
      answer: '', 
      level: 'A1', 
      category: 'grammar', 
      section: '', 
      points: 1, 
      active: true, 
      options: '[]' 
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = { ...formData }
      if (typeof data.options === 'string') {
        try {
          data.options = JSON.parse(data.options || '[]')
        } catch {
          data.options = []
        }
      }
      if (data.points) data.points = parseInt(data.points)
      if (editingItem) await questionService.update(editingItem.id, data)
      else await questionService.create(data)
      setShowModal(false)
      loadQuestions()
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return
    try { 
      await questionService.delete(id)
      loadQuestions()
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

  const getTypeIcon = (type) => type === 'multiple' ? '🔘' : '✏️'

  const viewDetails = (question) => {
    setSelectedQuestion(question)
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
            <h1 className="text-xl font-bold text-gray-900">📝 Preguntas</h1>
            <p className="text-xs text-gray-500">{questions.length} preguntas</p>
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
            placeholder="🔍 Buscar..."
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
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Pregunta</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Tipo</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Nivel</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Categoría</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Pts</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50 border-t border-gray-50">
                    <td className="px-3 py-2 text-xs text-gray-700 max-w-[200px] truncate">{q.question}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{getTypeIcon(q.type)} {q.type === 'multiple' ? 'Multi' : 'Fill'}</td>
                    <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(q.level)}`}>{q.level}</span></td>
                    <td className="px-3 py-2 text-xs text-gray-500 capitalize">{q.category}</td>
                    <td className="px-3 py-2 text-xs font-semibold text-primary">{q.points}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => openModal(q)} className="text-primary text-xs mr-2">Editar</button>
                      <button onClick={() => handleDelete(q.id)} className="text-red-500 text-xs">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No se encontraron preguntas</div>}
        </div>

        {/* Versión Mobile - Tarjetas COMPACTAS */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border">No se encontraron preguntas</div>
          ) : (
            filtered.map(q => (
              <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                {/* Fila superior: nivel + tipo + acciones */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(q.level)}`}>
                      {q.level}
                    </span>
                    <span className="text-xs text-gray-400">{getTypeIcon(q.type)}</span>
                    <span className="text-xs text-gray-400 capitalize">{q.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => viewDetails(q)} className="text-primary text-xs">🔍</button>
                    <button onClick={() => openModal(q)} className="text-primary text-xs">✏️</button>
                    <button onClick={() => handleDelete(q.id)} className="text-red-500 text-xs">🗑️</button>
                  </div>
                </div>
                {/* Pregunta */}
                <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{q.question}</p>
                {/* Info adicional compacta */}
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-2 mt-1">
                  <span>⭐ {q.points} pts</span>
                  <span>✅ {q.answer?.substring(0, 20)}{q.answer?.length > 20 ? '...' : ''}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Detalles (Móvil) - Compacto */}
        {showDetailModal && selectedQuestion && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={() => setShowDetailModal(false)}>
            <div className="bg-white rounded-2xl p-4 max-w-sm w-full max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Detalles</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400">✕</button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Pregunta</p>
                  <p className="text-sm text-gray-800">{selectedQuestion.question}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Nivel</p>
                    <p className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(selectedQuestion.level)}`}>{selectedQuestion.level}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Puntos</p>
                    <p className="font-semibold text-primary">{selectedQuestion.points}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Tipo</p>
                    <p>{selectedQuestion.type === 'multiple' ? 'Múltiple' : 'Completar'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Categoría</p>
                    <p className="capitalize">{selectedQuestion.category}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">✅ Respuesta</p>
                  <p className="text-sm font-semibold text-green-600 bg-green-50 p-2 rounded-lg">{selectedQuestion.answer}</p>
                </div>
                {selectedQuestion.type === 'multiple' && selectedQuestion.options && JSON.parse(selectedQuestion.options || '[]').length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Opciones</p>
                    <div className="space-y-0.5">
                      {JSON.parse(selectedQuestion.options).map((opt, idx) => (
                        <div key={idx} className="text-xs flex gap-1">
                          <span className="font-semibold text-primary">{String.fromCharCode(65 + idx)}.</span>
                          <span className="text-gray-700">{opt}</span>
                          {opt === selectedQuestion.answer && <span className="text-green-600 text-[10px] ml-auto">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => { setShowDetailModal(false); openModal(selectedQuestion) }} className="w-full bg-primary text-white py-2 rounded-xl font-semibold text-sm mt-2">Editar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Crear/Editar - Compacto */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{editingItem ? '✏️ Editar' : '➕ Nueva'} Pregunta</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Pregunta *</label>
                  <textarea value={formData.question || ''} onChange={e => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[70px]" rows={2} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Respuesta *</label>
                  <input type="text" value={formData.answer || ''} onChange={e => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo</label>
                    <select value={formData.type || 'multiple'} onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      <option value="multiple">Múltiple</option>
                      <option value="fill">Completar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nivel</label>
                    <select value={formData.level || 'A1'} onChange={e => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      {['A1','A2','B1','B2','C1'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Categoría</label>
                    <select value={formData.category || 'grammar'} onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      {['grammar','vocabulary','reading','writing','listening','speaking'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Puntos</label>
                    <input type="number" value={formData.points || 1} onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" min="1" max="10" />
                  </div>
                </div>
                {formData.type === 'multiple' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Opciones (JSON)</label>
                    <textarea value={typeof formData.options === 'string' ? formData.options : JSON.stringify(formData.options || [])} 
                      onChange={e => setFormData({ ...formData, options: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono" rows={3} />
                    <p className="text-[10px] text-gray-400 mt-1">Ej: ["Opción 1", "Opción 2", "Opción 3"]</p>
                  </div>
                )}
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