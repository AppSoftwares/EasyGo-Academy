import { useState, useEffect } from 'react'
import { AdminLayout } from '../components/dashboard/AdminLayout'
import { useAuthStore } from '../store/useAuthStore'
import { userService } from '../services/userService'
import { questionService } from '../services/questionService'
import { audiobookService } from '../services/audiobookService'
import { newsService } from '../services/newsService'
import { pronunciationService } from '../services/pronunciationService'
import api from '../services/api'

export const AdminPage = () => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  // Datos
  const [users, setUsers] = useState([])
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [stats, setStats] = useState({
    total: 0, active: 0, newToday: 0, newThisMonth: 0, newThisYear: 0,
    byLevel: {}, byPlan: {}, totalTeachers: 0
  })

  // Contenido
  const [questions, setQuestions] = useState([])
  const [audiobooks, setAudiobooks] = useState([])
  const [news, setNews] = useState([])
  const [pronunciations, setPronunciations] = useState([])
  const [leads, setLeads] = useState([])

  // Modal
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [modalType, setModalType] = useState('')
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const results = await Promise.allSettled([
        userService.getAll(),
        questionService.getAll(),
        audiobookService.getAll(),
        newsService.getAll(),
        pronunciationService.getAll(),
        api.get('/leads'),
        api.get('/dictionary/stats'),
        api.get('/progress/stats'),
      ])

      const [usersRes, questionsRes, audiobooksRes, newsRes, pronRes, leadsRes] = results

      const allUsers = usersRes.value?.data?.users || []
      setUsers(allUsers)
      setTeachers(allUsers.filter(u => u.role === 'teacher'))
      setStudents(allUsers.filter(u => u.role === 'user'))
      setQuestions(questionsRes.value?.data?.questions || [])
      setAudiobooks(audiobooksRes.value?.data?.audiobooks || [])
      setNews(newsRes.value?.data?.news || [])
      setPronunciations(pronRes.value?.data?.pronunciations || [])
      setLeads(leadsRes.value?.data?.leads || [])

      // Calcular estadísticas
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const thisYear = new Date(now.getFullYear(), 0, 1)

      const byLevel = {}
      const byPlan = {}
      allUsers.forEach(u => {
        if (u.assignedLevel) byLevel[u.assignedLevel] = (byLevel[u.assignedLevel] || 0) + 1
        if (u.plan) byPlan[u.plan] = (byPlan[u.plan] || 0) + 1
      })

      setStats({
        total: allUsers.length,
        active: allUsers.filter(u => u.active).length,
        newToday: allUsers.filter(u => new Date(u.createdAt) >= today).length,
        newThisMonth: allUsers.filter(u => new Date(u.createdAt) >= thisMonth).length,
        newThisYear: allUsers.filter(u => new Date(u.createdAt) >= thisYear).length,
        byLevel,
        byPlan,
        totalTeachers: allUsers.filter(u => u.role === 'teacher').length,
      })
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return
    try {
      switch (type) {
        case 'user': await userService.delete(id); break
        case 'question': await questionService.delete(id); break
        case 'audiobook': await audiobookService.delete(id); break
        case 'news': await newsService.delete(id); break
        case 'pronunciation': await pronunciationService.delete(id); break
      }
      loadAllData()
    } catch (err) {
      alert('Error al eliminar')
    }
  }

  const openModal = (type, item = null) => {
    setModalType(type)
    setEditingItem(item)
    setFormData(item ? { ...item } : {})
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      switch (modalType) {
        case 'user':
          if (editingItem) await userService.update(editingItem.id, formData)
          else await userService.create(formData)
          break
        case 'question':
          if (editingItem) await questionService.update(editingItem.id, formData)
          else await questionService.create(formData)
          break
        case 'audiobook':
          if (editingItem) await audiobookService.update(editingItem.id, formData)
          else await audiobookService.create(formData)
          break
        case 'news':
          if (editingItem) await newsService.update(editingItem.id, formData)
          else await newsService.create(formData)
          break
        case 'pronunciation':
          if (editingItem) await pronunciationService.update(editingItem.id, formData)
          else await pronunciationService.create(formData)
          break
      }
      setShowModal(false)
      loadAllData()
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.message || err.message))
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Alumnos', icon: '🎓', count: students.length },
    { id: 'teachers', label: 'Profesores', icon: '👨‍🏫', count: teachers.length },
    { id: 'questions', label: 'Preguntas', icon: '📝', count: questions.length },
    { id: 'audiobooks', label: 'Audiolibros', icon: '🎧', count: audiobooks.length },
    { id: 'news', label: 'Noticias', icon: '📰', count: news.length },
    { id: 'pronunciation', label: 'Pronunciación', icon: '🎤', count: pronunciations.length },
    { id: 'leads', label: 'Leads', icon: '📋', count: leads.length },
  ]

  const getLevelColor = (l) => ({ A1: 'bg-emerald-500', A2: 'bg-blue-500', B1: 'bg-amber-500', B2: 'bg-orange-500', C1: 'bg-rose-500' })[l] || 'bg-gray-400'

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Resumen General</h2>
      
      {/* Stats principales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Alumnos', value: students.length, icon: '🎓', color: 'bg-blue-50 text-blue-700' },
          { label: 'Profesores', value: stats.totalTeachers, icon: '👨‍🏫', color: 'bg-green-50 text-green-700' },
          { label: 'Nuevos Hoy', value: stats.newToday, icon: '🆕', color: 'bg-amber-50 text-amber-700' },
          { label: 'Este Mes', value: stats.newThisMonth, icon: '📅', color: 'bg-purple-50 text-purple-700' },
          { label: 'Este Año', value: stats.newThisYear, icon: '📆', color: 'bg-rose-50 text-rose-700' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 ${s.color} bg-opacity-50`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Distribución por nivel y plan */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Alumnos por Nivel</h3>
          <div className="space-y-3">
            {['A1', 'A2', 'B1', 'B2', 'C1'].map(level => (
              <div key={level} className="flex items-center gap-3">
                <span className="text-sm font-semibold w-8">{level}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getLevelColor(level)} transition-all`}
                    style={{ width: `${stats.total > 0 ? ((stats.byLevel[level] || 0) / stats.total) * 100 : 0}%` }} />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">{stats.byLevel[level] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Plan de Membresía</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold w-20">Básico</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-500 rounded-full" style={{ width: `${stats.total > 0 ? ((stats.byPlan?.basic || 0) / stats.total) * 100 : 0}%` }} />
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">{stats.byPlan?.basic || 0}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold w-20">Premium</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.total > 0 ? ((stats.byPlan?.premium || 0) / stats.total) * 100 : 0}%` }} />
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">{stats.byPlan?.premium || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => { setActiveTab('students'); openModal('user') }} className="bg-primary text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
            + Nuevo Alumno
          </button>
          <button onClick={() => { setActiveTab('teachers'); openModal('user') }} className="bg-green-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
            + Nuevo Profesor
          </button>
          <button onClick={() => { setActiveTab('questions'); openModal('question') }} className="bg-amber-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors">
            + Nueva Pregunta
          </button>
          <button onClick={() => { setActiveTab('news'); openModal('news') }} className="bg-purple-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
            + Nueva Noticia
          </button>
        </div>
      </div>
    </div>
  )

  const renderUserTable = (userList, role) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="font-bold text-gray-900">{role === 'teacher' ? 'Profesores' : 'Alumnos'} ({userList.length})</h3>
        <button onClick={() => openModal('user')} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold">
          + Nuevo {role === 'teacher' ? 'Profesor' : 'Alumno'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nivel</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {userList.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.assignedLevel ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                    {u.assignedLevel || 'Sin nivel'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.plan || 'basic'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs ${u.active ? 'text-green-600' : 'text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-green-500' : 'bg-red-500'}`} />
                    {u.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openModal('user', u)} className="text-primary hover:underline text-xs font-semibold mr-3">Editar</button>
                  <button onClick={() => handleDelete('user', u.id)} className="text-red-500 hover:underline text-xs font-semibold">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderContentTable = (items, columns, type) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">{tabs.find(t => t.id === activeTab)?.label} ({items.length})</h3>
        <button onClick={() => openModal(type)} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Nuevo</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{col}</th>)}
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.slice(0, 100).map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-700 max-w-[200px] truncate">
                    {col === 'level' ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">{item[col]}</span>
                    ) : typeof item[col] === 'object' ? JSON.stringify(item[col]).substring(0, 50) : (item[col] || '-')}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openModal(type, item)} className="text-primary hover:underline text-xs font-semibold mr-3">Editar</button>
                  <button onClick={() => handleDelete(type, item.id)} className="text-red-500 hover:underline text-xs font-semibold">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderLeadsTable = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Leads / Contactos ({leads.length})</h3>
        <p className="text-xs text-gray-400 mt-1">Formularios de contacto de la landing page</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Teléfono</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fuente</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.slice(0, 100).map(lead => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{lead.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{lead.email}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{lead.phone || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{lead.source || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${lead.status === 'new' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {lead.status || 'new'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'students': return renderUserTable(students, 'student')
      case 'teachers': return renderUserTable(teachers, 'teacher')
      case 'questions': return renderContentTable(questions, ['question', 'type', 'level', 'category', 'points'], 'question')
      case 'audiobooks': return renderContentTable(audiobooks, ['title', 'level', 'category', 'duration', 'narrator'], 'audiobook')
      case 'news': return renderContentTable(news, ['title', 'level', 'category', 'readingTime', 'views'], 'news')
      case 'pronunciation': return renderContentTable(pronunciations, ['word', 'translation', 'level', 'category', 'difficulty'], 'pronunciation')
      case 'leads': return renderLeadsTable()
      default: return null
    }
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

  const userFields = ['name', 'email', 'password', 'phone', 'role', 'plan', 'active']
  const questionFields = ['question', 'type', 'answer', 'level', 'category', 'section', 'points']
  const audiobookFields = ['title', 'description', 'level', 'category', 'duration', 'narrator', 'accent', 'audioUrl']
  const newsFields = ['title', 'subtitle', 'content', 'level', 'category', 'readingTime', 'featured']
  const pronunciationFields = ['word', 'translation', 'spanishPronunciation', 'phonetic', 'level', 'category', 'difficulty', 'tips']

  const getFieldsForType = () => {
    switch (modalType) {
      case 'user': return userFields
      case 'question': return questionFields
      case 'audiobook': return audiobookFields
      case 'news': return newsFields
      case 'pronunciation': return pronunciationFields
      default: return []
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">⚙️ Administración</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona alumnos, profesores y contenido</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}>
              {tab.icon} {tab.label}
              {tab.count > 0 && <span className="text-xs opacity-70">({tab.count})</span>}
            </button>
          ))}
        </div>

        {renderContent()}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {editingItem ? 'Editar' : 'Crear'} {modalType === 'user' ? 'usuario' : modalType}
              </h3>
              
              <div className="space-y-4">
                {getFieldsForType().map(field => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">{field}</label>
                    {field === 'active' || field === 'featured' ? (
                      <select value={formData[field] || 'true'} onChange={e => setFormData({ ...formData, [field]: e.target.value === 'true' })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none">
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    ) : field === 'role' ? (
                      <select value={formData[field] || 'user'} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none">
                        <option value="user">Alumno</option>
                        <option value="teacher">Profesor</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : field === 'plan' ? (
                      <select value={formData[field] || 'basic'} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none">
                        <option value="basic">Básico</option>
                        <option value="premium">Premium</option>
                      </select>
                    ) : field === 'level' ? (
                      <select value={formData[field] || 'A1'} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none">
                        <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option>
                      </select>
                    ) : field === 'type' ? (
                      <select value={formData[field] || 'multiple'} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none">
                        <option value="multiple">Multiple choice</option><option value="fill">Completar</option>
                      </select>
                    ) : field === 'content' || field === 'description' || field === 'tips' || field === 'subtitle' ? (
                      <textarea value={formData[field] || ''} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none min-h-[80px]" />
                    ) : field === 'password' && editingItem ? (
                      <input type="password" value={formData[field] || ''} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        placeholder="Dejar vacío para no cambiar"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none" />
                    ) : (
                      <input type="text" value={formData[field] || ''} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary/30 transition-all outline-none" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
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