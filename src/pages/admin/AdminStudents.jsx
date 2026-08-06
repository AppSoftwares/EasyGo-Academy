import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/dashboard/AdminLayout'
import { userService } from '../../services/userService'

export const AdminStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => { loadStudents() }, [])

  const loadStudents = async () => {
    try {
      const res = await userService.getAll()
      setStudents((res.data?.users || []).filter(u => u.role === 'user'))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (user = null) => {
    setEditingUser(user)
    setFormData(user ? { ...user, password: '' } : { name: '', email: '', password: '', phone: '', role: 'user', plan: 'basic', active: true })
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
      loadStudents()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este alumno permanentemente?')) return
    try {
      await userService.delete(id)
      loadStudents()
    } catch (err) {
      alert('Error al eliminar')
    }
  }

  const getLevelBadge = (level) => {
    const colors = { 
      A1: 'bg-emerald-100 text-emerald-700', 
      A2: 'bg-blue-100 text-blue-700', 
      B1: 'bg-amber-100 text-amber-700', 
      B2: 'bg-orange-100 text-orange-700', 
      C1: 'bg-rose-100 text-rose-700' 
    }
    return level ? colors[level] || 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-400'
  }

  const viewStudentDetails = (student) => {
    setSelectedStudent(student)
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
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🎓 Alumnos</h1>
            <p className="text-gray-500 text-sm mt-1">{students.length} alumnos registrados</p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="w-full sm:w-auto bg-primary text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>➕</span> Nuevo Alumno
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar alumno por nombre o email..."
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:border-primary/30 transition-all outline-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Versión Desktop - Tabla (visible en md y superior) */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Alumno</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nivel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Registro</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                          {student.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{student.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getLevelBadge(student.assignedLevel)}`}>
                        {student.assignedLevel || 'Sin nivel'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${student.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {student.plan || 'basic'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs ${student.active ? 'text-green-600' : 'text-red-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.active ? 'bg-green-500' : 'bg-red-500'}`} />
                        {student.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openModal(student)} className="text-primary hover:underline text-xs font-semibold mr-3">Editar</button>
                      <button onClick={() => handleDelete(student.id)} className="text-red-500 hover:underline text-xs font-semibold">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-gray-400">No se encontraron alumnos</div>
          )}
        </div>

        {/* Versión Mobile - Tarjetas (visible en móvil) */}
        <div className="md:hidden space-y-3">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
              No se encontraron alumnos
            </div>
          ) : (
            filteredStudents.map(student => (
              <div 
                key={student.id} 
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all"
              >
                {/* Header de tarjeta */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                      {student.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-xs text-gray-400">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => viewStudentDetails(student)} 
                      className="text-primary text-xs font-semibold p-1"
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button 
                      onClick={() => openModal(student)} 
                      className="text-primary text-xs font-semibold p-1"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(student.id)} 
                      className="text-red-500 text-xs font-semibold p-1"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Información */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-gray-400 mb-0.5">Nivel</p>
                    <p className={`font-semibold inline-block px-2 py-0.5 rounded-full ${getLevelBadge(student.assignedLevel)}`}>
                      {student.assignedLevel || 'Sin nivel'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-gray-400 mb-0.5">Plan</p>
                    <p className={`font-semibold ${student.plan === 'premium' ? 'text-amber-600' : 'text-gray-500'}`}>
                      {student.plan === 'premium' ? 'Premium ⭐' : 'Básico'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-gray-400 mb-0.5">Estado</p>
                    <p className={`font-semibold ${student.active ? 'text-green-600' : 'text-red-500'}`}>
                      {student.active ? 'Activo ✓' : 'Inactivo ✗'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-gray-400 mb-0.5">Registro</p>
                    <p className="font-semibold text-gray-600">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Detalles (Móvil) */}
        {showDetailModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Detalles del Alumno</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                    {selectedStudent.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedStudent.name}</h4>
                    <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                    {selectedStudent.phone && <p className="text-sm text-gray-500">{selectedStudent.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono text-sm text-gray-700">#{selectedStudent.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Nivel:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getLevelBadge(selectedStudent.assignedLevel)}`}>
                      {selectedStudent.assignedLevel || 'Sin nivel'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Plan:</span>
                    <span className={selectedStudent.plan === 'premium' ? 'text-amber-600 font-semibold' : 'text-gray-500'}>
                      {selectedStudent.plan === 'premium' ? 'Premium ⭐' : 'Básico'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Estado:</span>
                    <span className={selectedStudent.active ? 'text-green-600' : 'text-red-500'}>
                      {selectedStudent.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Registro:</span>
                    <span className="text-gray-600">
                      {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleString() : '-'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => {
                      setShowDetailModal(false)
                      openModal(selectedStudent)
                    }}
                    className="flex-1 bg-primary text-white py-2 rounded-xl font-semibold text-sm"
                  >
                    Editar Alumno
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

        {/* Modal de Crear/Editar (responsive) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">{editingUser ? '✏️ Editar Alumno' : '➕ Nuevo Alumno'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Nombre completo *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none"
                    placeholder="ejemplo@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                    {editingUser ? 'Contraseña (dejar vacío para mantener)' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Plan</label>
                    <select 
                      value={formData.plan || 'basic'} 
                      onChange={e => setFormData({ ...formData, plan: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      <option value="basic">📘 Básico</option>
                      <option value="premium">⭐ Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Estado</label>
                    <select 
                      value={formData.active ? 'true' : 'false'} 
                      onChange={e => setFormData({ ...formData, active: e.target.value === 'true' })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      <option value="true">🟢 Activo</option>
                      <option value="false">🔴 Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button 
                  onClick={handleSave} 
                  disabled={saving} 
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : '💾 Guardar'}
                </button>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}