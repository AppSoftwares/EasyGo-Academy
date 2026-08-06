import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/dashboard/AdminLayout'
import { userService } from '../../services/userService'

export const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  useEffect(() => { loadTeachers() }, [])

  const loadTeachers = async () => {
    try {
      const res = await userService.getAll()
      setTeachers((res.data?.users || []).filter(u => u.role === 'teacher'))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filteredTeachers = teachers.filter(t =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.phone?.includes(searchTerm)
  )

  const openModal = (user = null) => {
    setEditingUser(user)
    setFormData(user ? { ...user, password: '' } : { name: '', email: '', password: '', phone: '', role: 'teacher', plan: 'premium', active: true })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingUser) {
        const data = { ...formData }
        if (!data.password) delete data.password
        await userService.update(editingUser.id, data)
      } else {
        await userService.create(formData)
      }
      setShowModal(false)
      loadTeachers()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este profesor permanentemente?')) return
    try { 
      await userService.delete(id)
      loadTeachers() 
    } catch { 
      alert('Error al eliminar') 
    }
  }

  const viewDetails = (teacher) => {
    setSelectedTeacher(teacher)
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
            <h1 className="text-xl font-bold text-gray-900">👨‍🏫 Profesores</h1>
            <p className="text-xs text-gray-500">{teachers.length} profesores</p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="bg-green-600 text-white px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1"
          >
            <span>➕</span> Nuevo
          </button>
        </div>

        {/* Búsqueda - Compacta */}
        <div className="relative">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar profesor..."
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
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Profesor</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Email</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Teléfono</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Estado</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Registro</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-gray-50 border-t border-gray-50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-[10px] font-bold text-green-700">
                          {teacher.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{teacher.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">{teacher.email}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{teacher.phone || '-'}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] ${teacher.active ? 'text-green-600' : 'text-red-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${teacher.active ? 'bg-green-500' : 'bg-red-500'}`} />
                        {teacher.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[10px] text-gray-400">
                      {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => openModal(teacher)} className="text-primary text-xs mr-2">Editar</button>
                      <button onClick={() => handleDelete(teacher.id)} className="text-red-500 text-xs">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTeachers.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">No se encontraron profesores</div>
          )}
        </div>

        {/* Versión Mobile - Tarjetas COMPACTAS */}
        <div className="md:hidden space-y-2">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border">No se encontraron profesores</div>
          ) : (
            filteredTeachers.map(teacher => (
              <div key={teacher.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                {/* Fila superior: nombre + acciones */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                      {teacher.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{teacher.name}</p>
                      <p className="text-[10px] text-gray-400">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => viewDetails(teacher)} className="text-primary text-xs">🔍</button>
                    <button onClick={() => openModal(teacher)} className="text-primary text-xs">✏️</button>
                    <button onClick={() => handleDelete(teacher.id)} className="text-red-500 text-xs">🗑️</button>
                  </div>
                </div>
                {/* Info adicional compacta */}
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-2 mt-1">
                  <span>📞 {teacher.phone || 'Sin teléfono'}</span>
                  <span className={`inline-flex items-center gap-1 ${teacher.active ? 'text-green-600' : 'text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${teacher.active ? 'bg-green-500' : 'bg-red-500'}`} />
                    {teacher.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Detalles (Móvil) - Compacto */}
        {showDetailModal && selectedTeacher && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={() => setShowDetailModal(false)}>
            <div className="bg-white rounded-2xl p-4 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Detalles del Profesor</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400">✕</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-lg font-bold text-green-700">
                    {selectedTeacher.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedTeacher.name}</h4>
                    <p className="text-xs text-gray-500">{selectedTeacher.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 text-xs">ID:</span>
                    <span className="text-xs text-gray-700">#{selectedTeacher.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 text-xs">📞 Teléfono:</span>
                    <span className="text-xs text-gray-700">{selectedTeacher.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 text-xs">📅 Registro:</span>
                    <span className="text-xs text-gray-700">
                      {selectedTeacher.createdAt ? new Date(selectedTeacher.createdAt).toLocaleDateString() : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400 text-xs">🔵 Estado:</span>
                    <span className={`text-xs font-semibold ${selectedTeacher.active ? 'text-green-600' : 'text-red-500'}`}>
                      {selectedTeacher.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => { setShowDetailModal(false); openModal(selectedTeacher) }} 
                    className="flex-1 bg-primary text-white py-2 rounded-xl font-semibold text-sm"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => setShowDetailModal(false)} 
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold text-sm"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Crear/Editar - Compacto */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-5 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingUser ? '✏️ Editar Profesor' : '➕ Nuevo Profesor'}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre *</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email *</label>
                  <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    {editingUser ? 'Contraseña (dejar vacío)' : 'Contraseña *'}
                  </label>
                  <input type="password" value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Teléfono</label>
                  <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
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