import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/dashboard/AdminLayout'
import { classService } from '../../services/classService'
import { userService } from '../../services/userService'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale'

export const AdminClasses = () => {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [userTimeZone, setUserTimeZone] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    loadData()
    loadTeachers()
    setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await classService.getAll()
      if (res.data.success) setClasses(res.data.classes || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const loadTeachers = async () => {
    try {
      const res = await userService.getAll()
      setTeachers((res.data?.users || []).filter(u => u.role === 'teacher' && u.active))
    } catch (err) { console.error(err) }
  }

  const handleTeacherSelect = (teacherId) => {
    if (!teacherId) {
      setFormData(prev => ({
        ...prev,
        teacherId: '', teacherName: '', teacherRole: '', teacherPhoto: '', teacherInitials: '',
      }))
      return
    }
    const teacher = teachers.find(t => t.id === parseInt(teacherId))
    if (teacher) {
      const initials = teacher.name?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '??'
      setFormData(prev => ({
        ...prev,
        teacherId: teacher.id,
        teacherName: teacher.name,
        teacherRole: teacher.role || 'Profesor',
        teacherPhoto: teacher.photo || '',
        teacherInitials: initials,
      }))
    }
  }

  const openModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      const dateStr = item.date || ''
      const timeStr = item.time?.split(' - ')[0] || '10:00'
      const classDate = dateStr && timeStr ? new Date(`${dateStr}T${timeStr}:00`) : new Date()
      setSelectedDate(classDate)
      setFormData({
        title: item.title || '',
        subtitle: item.subtitle || '',
        teacherId: item.teacherId || '',
        teacherName: item.teacherName || '',
        teacherRole: item.teacherRole || '',
        teacherPhoto: item.teacherPhoto || '',
        teacherInitials: item.teacherInitials || '',
        meetLink: item.meetLink || '',
        level: item.level || 'all',
        maxStudents: item.maxStudents || 5,
        duration: item.duration || 60,
        active: item.active !== undefined ? item.active : true,
      })
    } else {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      nextWeek.setHours(10, 0, 0, 0)
      setSelectedDate(nextWeek)
      setFormData({
        title: '', subtitle: '', teacherId: '', teacherName: '', teacherRole: '', teacherPhoto: '', teacherInitials: '',
        meetLink: '', level: 'all', maxStudents: 5, duration: 60, active: true,
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!selectedDate) { alert('Selecciona una fecha y hora'); return }
    setSaving(true)
    try {
      const date = selectedDate.toISOString().split('T')[0]
      const hours = selectedDate.getHours().toString().padStart(2, '0')
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
      const duration = parseInt(formData.duration) || 60
      const endDate = new Date(selectedDate.getTime() + duration * 60000)
      const endHours = endDate.getHours().toString().padStart(2, '0')
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0')
      const time = `${hours}:${minutes} - ${endHours}:${endMinutes}`
      const data = { ...formData, date, time, duration, maxStudents: parseInt(formData.maxStudents) || 5 }
      if (editingItem) await classService.update(editingItem.id, data)
      else await classService.create(data)
      setShowModal(false)
      loadData()
    } catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta clase?')) return
    try { await classService.delete(id); loadData() } catch { alert('Error') }
  }

  const now = new Date().toISOString().split('T')[0]
  const upcomingClasses = classes.filter(c => c.date >= now && c.active)
  const pastClasses = classes.filter(c => c.date < now || !c.active)
  const displayedClasses = activeTab === 'upcoming' ? upcomingClasses : pastClasses
  const getLevelColor = (l) => ({ A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700', B1: 'bg-amber-100 text-amber-700', B2: 'bg-orange-100 text-orange-700', C1: 'bg-rose-100 text-rose-700', all: 'bg-purple-100 text-purple-700' })[l] || ''

  if (loading) return <AdminLayout><div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📹 Clases en vivo</h1>
            <p className="text-gray-500 text-sm mt-1">{classes.length} clases · {upcomingClasses.length} próximas {userTimeZone && <span className="ml-2 text-xs text-gray-400">🕐 {userTimeZone}</span>}</p>
          </div>
          <button onClick={() => openModal()} className="bg-primary text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm">➕ Nueva Clase</button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'upcoming' ? 'bg-primary text-white shadow' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>📅 Próximas ({upcomingClasses.length})</button>
          <button onClick={() => setActiveTab('past')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'past' ? 'bg-primary text-white shadow' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>📜 Pasadas ({pastClasses.length})</button>
        </div>

        <div className="space-y-4">
          {displayedClasses.map(c => (
            <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{c.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getLevelColor(c.level)}`}>{c.level}</span>
                    {!c.active && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">Inactiva</span>}
                  </div>
                  {c.subtitle && <p className="text-sm text-gray-500">{c.subtitle}</p>}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    <span>📅 {new Date(c.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    <span>⏰ {c.time}</span>
                    {c.duration && <span>⏱️ {c.duration} min</span>}
                    <span>👨‍🏫 {c.teacherName || 'Sin profesor'}</span>
                    <span>👥 {c.currentStudents || 0}/{c.maxStudents}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openModal(c)} className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/20">✏️</button>
                  <button onClick={() => handleDelete(c.id)} className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100">🗑️</button>
                </div>
              </div>
            </div>
          ))}
          {displayedClasses.length === 0 && <div className="text-center py-16"><span className="text-5xl block mb-4">📅</span><p className="text-gray-500">No hay clases</p></div>}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div><h3 className="text-xl font-bold text-gray-900">{editingItem ? '✏️ Editar Clase' : '📹 Nueva Clase en Vivo'}</h3><p className="text-sm text-gray-400 mt-0.5">{editingItem ? 'Modifica los detalles' : 'Programa una clase por Zoom'}</p></div>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">📝 Título *</label><input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Ej: Conversación en inglés" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-primary/30 transition-all outline-none" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">📋 Subtítulo</label><input type="text" value={formData.subtitle || ''} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Ej: Énfasis en pronunciación" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-primary/30 transition-all outline-none" /></div>
                  
                  {/* SELECTOR DE PROFESOR */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">👨‍🏫 Profesor *</label>
                    <select value={formData.teacherId || ''} onChange={e => handleTeacherSelect(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-primary/30 transition-all outline-none cursor-pointer">
                      <option value="">Seleccionar profesor...</option>
                      {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.email})</option>)}
                    </select>
                    {formData.teacherId && (
                      <div className="mt-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {formData.teacherPhoto ? <img src={formData.teacherPhoto} alt="" className="w-full h-full rounded-2xl object-cover" /> : (formData.teacherInitials || '👨‍🏫')}
                        </div>
                        <div><p className="font-bold text-gray-900">{formData.teacherName}</p><p className="text-xs text-gray-500">{formData.teacherRole}</p></div>
                      </div>
                    )}
                  </div>

                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">🔗 Enlace de Zoom</label><input type="text" value={formData.meetLink || ''} onChange={e => setFormData({ ...formData, meetLink: e.target.value })} placeholder="https://zoom.us/j/1234567890" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm" /></div>
                </div>

                <div className="space-y-4">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">📅 Fecha y Hora *</label><DatePicker selected={selectedDate} onChange={d => setSelectedDate(d)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} timeCaption="Hora" dateFormat="dd/MM/yyyy h:mm aa" locale={es} minDate={new Date()} placeholderText="Selecciona fecha y hora" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-primary/30 transition-all outline-none cursor-pointer" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">⏱️ Duración</label><select value={formData.duration || 60} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm cursor-pointer"><option value={30}>30 minutos</option><option value={45}>45 minutos</option><option value={60}>1 hora</option><option value={90}>1h 30min</option><option value={120}>2 horas</option></select></div>
                  
                  {selectedDate && (
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-sm font-semibold text-primary">📅 {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="text-sm text-gray-600 mt-1">⏰ De <strong>{selectedDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</strong> a <strong>{new Date(selectedDate.getTime() + (formData.duration || 60) * 60000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</strong></p>
                      <p className="text-xs text-gray-400 mt-1">⏱️ {formData.duration || 60} minutos</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">🎯 Nivel</label><select value={formData.level || 'all'} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm cursor-pointer"><option value="all">🌍 Todos</option><option value="A1">🟢 A1</option><option value="A2">🔵 A2</option><option value="B1">🟡 B1</option><option value="B2">🟠 B2</option><option value="C1">🔴 C1</option></select></div>
                    <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">👥 Cupo</label><input type="number" value={formData.maxStudents || 5} onChange={e => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 5 })} min="1" max="50" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">📌 Estado</label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setFormData({ ...formData, active: true })} className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all ${formData.active ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>✅ Activa</button>
                      <button type="button" onClick={() => setFormData({ ...formData, active: false })} className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all ${!formData.active ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>⏸️ Inactiva</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-4 bg-blue-50 rounded-2xl border border-blue-100"><p className="text-xs text-blue-700">🕐 Tu zona horaria: <strong>{userTimeZone}</strong></p><p className="text-xs text-blue-600 mt-1">La clase se mostrará en la zona horaria local de cada estudiante.</p></div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-lg">{saving ? 'Guardando...' : editingItem ? '💾 Guardar cambios' : '📹 Crear clase'}</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-colors">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .react-datepicker { font-family: 'Plus Jakarta Sans', sans-serif !important; border: 1px solid #e2e8f0 !important; border-radius: 1rem !important; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important; }
        .react-datepicker__header { background: #f8fafc !important; border-bottom: 1px solid #e2e8f0 !important; }
        .react-datepicker__day--selected, .react-datepicker__time-list-item--selected { background-color: #5B2ECC !important; border-radius: 0.5rem !important; }
        .react-datepicker__day:hover { background-color: #f1f5f9 !important; border-radius: 0.5rem !important; }
        .react-datepicker__time-container { border-left: 1px solid #e2e8f0 !important; }
        .react-datepicker__triangle { display: none !important; }
      `}</style>
    </AdminLayout>
  )
}