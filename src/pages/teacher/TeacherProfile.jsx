// src/pages/teacher/TeacherProfile.jsx
import { useState, useEffect } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'
import { useAuthStore } from '../../store/useAuthStore'

export const TeacherProfile = () => {
  const { user, updateUser } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [schedule, setSchedule] = useState([])
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)

  useEffect(() => {
    loadProfile()
    loadSchedule()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await teacherService.getProfile()
      if (res.data.success) {
        setProfile(res.data.profile)
        setFormData({
          name: res.data.profile.name || '',
          email: res.data.profile.email || '',
          phone: res.data.profile.phone || '',
          bio: res.data.profile.bio || '',
          specialty: res.data.profile.specialty || '',
          education: res.data.profile.education || '',
          experience: res.data.profile.experience || '',
          socialMedia: res.data.profile.socialMedia || {}
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSchedule = async () => {
    try {
      const res = await teacherService.getSchedule()
      if (res.data.success) {
        setSchedule(res.data.schedule || [])
      }
    } catch (error) {
      console.error('Error loading schedule:', error)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await teacherService.updateProfile(formData)
      if (res.data.success) {
        alert('Perfil actualizado correctamente')
        if (updateUser) updateUser({ name: formData.name })
        loadProfile()
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setSaving(true)
    try {
      const res = await teacherService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      if (res.data.success) {
        alert('Contraseña actualizada correctamente')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert(error.response?.data?.message || 'Error al cambiar la contraseña')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSchedule = async () => {
    setSaving(true)
    try {
      const res = await teacherService.updateSchedule(schedule)
      if (res.data.success) {
        alert('Horario actualizado correctamente')
        setShowScheduleModal(false)
        loadSchedule()
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('Error al guardar el horario')
    } finally {
      setSaving(false)
    }
  }

  const addScheduleItem = () => {
    const newItem = {
      id: Date.now(),
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      subject: '',
      active: true
    }
    setSchedule([...schedule, newItem])
  }

  const updateScheduleItem = (id, field, value) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeScheduleItem = (id) => {
    setSchedule(prev => prev.filter(item => item.id !== id))
  }

  const daysOfWeek = [
    { value: 'Monday', label: 'Lunes' },
    { value: 'Tuesday', label: 'Martes' },
    { value: 'Wednesday', label: 'Miércoles' },
    { value: 'Thursday', label: 'Jueves' },
    { value: 'Friday', label: 'Viernes' },
    { value: 'Saturday', label: 'Sábado' },
    { value: 'Sunday', label: 'Domingo' }
  ]

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {formData.name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{formData.name || 'Profesor'}</h1>
              <p className="text-gray-500">{formData.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                  {profile?.role === 'teacher' ? 'Profesor' : 'Educador'}
                </span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {profile?.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'profile', label: '👤 Perfil', icon: '👤' },
            { id: 'schedule', label: '📅 Horario', icon: '📅' },
            { id: 'security', label: '🔒 Seguridad', icon: '🔒' },
            { id: 'stats', label: '📊 Estadísticas', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel de Perfil */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Información Personal</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                  <input
                    type="text"
                    value={formData.specialty || ''}
                    onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                    placeholder="Ej: Gramática, Conversación, Negocios"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                  placeholder="Cuéntales a tus alumnos sobre ti, tu experiencia y metodología de enseñanza..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Educación</label>
                <textarea
                  value={formData.education || ''}
                  onChange={e => setFormData({ ...formData, education: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                  placeholder="Títulos, certificaciones, cursos relevantes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia</label>
                <textarea
                  value={formData.experience || ''}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                  placeholder="Años de experiencia, instituciones donde has trabajado..."
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Panel de Horario */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Horario de Clases</h2>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                <span>✏️</span> Editar Horario
              </button>
            </div>

            {schedule.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl block mb-2">📅</span>
                <p className="text-gray-500">No has configurado tu horario aún</p>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="mt-3 text-primary font-semibold text-sm"
                >
                  Configurar horario →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {daysOfWeek.map(day => {
                  const daySchedule = schedule.filter(s => s.day === day.value)
                  if (daySchedule.length === 0) return null
                  return (
                    <div key={day.value} className="border-b border-gray-100 pb-3 last:border-0">
                      <h3 className="font-semibold text-gray-800 mb-2">{day.label}</h3>
                      {daySchedule.map(item => (
                        <div key={item.id} className="flex items-center gap-3 text-sm text-gray-600 ml-4">
                          <span>⏰ {item.startTime} - {item.endTime}</span>
                          <span className="text-primary">•</span>
                          <span>{item.subject || 'Clase de inglés'}</span>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Panel de Seguridad */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cambiar Contraseña</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 outline-none"
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={handleChangePassword}
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {saving ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">📱 Sesiones Activas</h3>
              <p className="text-sm text-gray-500">Puedes ver y gestionar las sesiones activas de tu cuenta</p>
              <button className="mt-3 text-sm text-red-500 hover:underline">
                Cerrar todas las sesiones
              </button>
            </div>
          </div>
        )}

        {/* Panel de Estadísticas */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Estadísticas de Enseñanza</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{profile?.totalStudents || 0}</p>
                <p className="text-xs text-gray-500">Alumnos</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{profile?.totalClasses || 0}</p>
                <p className="text-xs text-gray-500">Clases</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{profile?.avgRating || 0}★</p>
                <p className="text-xs text-gray-500">Calificación</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{profile?.totalHours || 0}h</p>
                <p className="text-xs text-gray-500">Horas impartidas</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">📈 Resumen</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Tasa de satisfacción</span>
                  <span className="font-semibold">{profile?.satisfactionRate || 0}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${profile?.satisfactionRate || 0}%` }} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Retención de alumnos</span>
                  <span className="font-semibold">{profile?.retentionRate || 0}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${profile?.retentionRate || 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición de Horario */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowScheduleModal(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Editar Horario</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 text-xl">✕</button>
              </div>

              <div className="space-y-4">
                {schedule.map((item, idx) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex gap-3 flex-wrap">
                      <select
                        value={item.day}
                        onChange={e => updateScheduleItem(item.id, 'day', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                      >
                        {daysOfWeek.map(day => (
                          <option key={day.value} value={day.value}>{day.label}</option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={item.startTime}
                        onChange={e => updateScheduleItem(item.id, 'startTime', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                      />
                      <span className="self-center">a</span>
                      <input
                        type="time"
                        value={item.endTime}
                        onChange={e => updateScheduleItem(item.id, 'endTime', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Materia/Curso"
                        value={item.subject}
                        onChange={e => updateScheduleItem(item.id, 'subject', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => removeScheduleItem(item.id)}
                        className="px-3 py-2 bg-red-100 text-red-500 rounded-lg text-sm hover:bg-red-200"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addScheduleItem}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition"
                >
                  + Agregar bloque horario
                </button>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveSchedule}
                    disabled={saving}
                    className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Guardar Horario'}
                  </button>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  )
}