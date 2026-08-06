import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/dashboard/AdminLayout'
import { userService } from '../../services/userService'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export const AdminDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0, active: 0, inactive: 0, newToday: 0, newThisWeek: 0, newThisMonth: 0, newThisYear: 0,
    totalStudents: 0, totalTeachers: 0, totalAdmins: 0,
    byLevel: {}, byPlan: {}, byRole: {},
    recentUsers: [],
    topStudents: [],
  })
  const [contentStats, setContentStats] = useState({
    totalQuestions: 0, totalAudiobooks: 0, totalNews: 0,
    totalPronunciations: 0, totalDictionary: 0, totalLeads: 0,
    totalPlays: 0, totalDownloads: 0, totalSearches: 0, totalViews: 0,
  })
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => { loadAllData() }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [usersRes, qRes, aRes, nRes, pRes, lRes, dStats, aStats, nStats, pStats] = await Promise.allSettled([
        userService.getAll(),
        api.get('/questions?limit=1'),
        api.get('/audiobooks?limit=1'),
        api.get('/news?limit=1'),
        api.get('/pronunciations?limit=1'),
        api.get('/leads?limit=1'),
        api.get('/dictionary/stats'),
        api.get('/audiobooks/stats'),
        api.get('/news/stats'),
        api.get('/pronunciations/stats'),
      ])

      const allUsers = usersRes.value?.data?.users || []
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const thisYear = new Date(now.getFullYear(), 0, 1)

      // Stats de usuarios
      const byLevel = {}
      const byPlan = {}
      const byRole = {}
      const byMonth = {}
      allUsers.forEach(u => {
        if (u.assignedLevel) byLevel[u.assignedLevel] = (byLevel[u.assignedLevel] || 0) + 1
        if (u.plan) byPlan[u.plan] = (byPlan[u.plan] || 0) + 1
        if (u.role) byRole[u.role] = (byRole[u.role] || 0) + 1
        const m = new Date(u.createdAt).getMonth()
        byMonth[m] = (byMonth[m] || 0) + 1
      })

      // Top estudiantes por puntuación
      const topStudents = allUsers
        .filter(u => u.role === 'user')
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, 5)

      setStats({
        total: allUsers.length,
        active: allUsers.filter(u => u.active).length,
        inactive: allUsers.filter(u => !u.active).length,
        newToday: allUsers.filter(u => new Date(u.createdAt) >= today).length,
        newThisWeek: allUsers.filter(u => new Date(u.createdAt) >= weekAgo).length,
        newThisMonth: allUsers.filter(u => new Date(u.createdAt) >= thisMonth).length,
        newThisYear: allUsers.filter(u => new Date(u.createdAt) >= thisYear).length,
        totalStudents: allUsers.filter(u => u.role === 'user').length,
        totalTeachers: allUsers.filter(u => u.role === 'teacher').length,
        totalAdmins: allUsers.filter(u => u.role === 'admin').length,
        byLevel,
        byPlan,
        byRole,
        byMonth,
        recentUsers: allUsers.slice(-5).reverse(),
        topStudents,
      })

      // Stats de contenido
      const aStatsData = aStats.value?.data?.stats || {}
      const nStatsData = nStats.value?.data?.stats || {}
      const pStatsData = pStats.value?.data?.stats || {}
      const dStatsData = dStats.value?.data?.stats || {}

      setContentStats({
        totalQuestions: qRes.value?.data?.total || 0,
        totalAudiobooks: aRes.value?.data?.total || 0,
        totalNews: nRes.value?.data?.total || 0,
        totalPronunciations: pRes.value?.data?.total || 0,
        totalDictionary: dStatsData.total || 0,
        totalLeads: lRes.value?.data?.total || 0,
        totalPlays: aStatsData.totalPlays || 0,
        totalDownloads: aStatsData.totalDownloads || 0,
        totalSearches: dStatsData.totalSearches || 0,
        totalViews: nStatsData.totalViews || 0,
      })
    } catch (err) { console.error('Error:', err) }
    finally { setLoading(false) }
  }

  const getLevelColor = (l) => ({ A1: 'bg-emerald-500', A2: 'bg-blue-500', B1: 'bg-amber-500', B2: 'bg-orange-500', C1: 'bg-rose-500' })[l] || 'bg-gray-400'
  const getLevelBg = (l) => ({ A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700', B1: 'bg-amber-100 text-amber-700', B2: 'bg-orange-100 text-orange-700', C1: 'bg-rose-100 text-rose-700' })[l] || ''
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📊 Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Panel de control · EasyGo Academy</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-primary text-white' : 'bg-white border text-gray-600'}`}>
              General
            </button>
            <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'content' ? 'bg-primary text-white' : 'bg-white border text-gray-600'}`}>
              Contenido
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* ============ STATS CARDS ============ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Alumnos', value: stats.totalStudents, icon: '🎓', color: 'bg-blue-50 text-blue-700', path: '/admin/students' },
                { label: 'Profesores', value: stats.totalTeachers, icon: '👨‍🏫', color: 'bg-green-50 text-green-700', path: '/admin/teachers' },
                { label: 'Activos', value: stats.active, icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
                { label: 'Nuevos Hoy', value: stats.newToday, icon: '🆕', color: 'bg-amber-50 text-amber-700' },
                { label: 'Esta Semana', value: stats.newThisWeek, icon: '📅', color: 'bg-purple-50 text-purple-700' },
                { label: 'Este Mes', value: stats.newThisMonth, icon: '📆', color: 'bg-rose-50 text-rose-700' },
              ].map((s, i) => (
                <button key={i} onClick={() => s.path && navigate(s.path)}
                  className={`rounded-2xl p-4 text-left transition-all hover:shadow-md ${s.path ? 'cursor-pointer hover:scale-105' : ''} ${s.color} bg-opacity-60`}>
                  <p className="text-2xl mb-2">{s.icon}</p>
                  <p className="text-2xl sm:text-3xl font-black">{s.value}</p>
                  <p className="text-xs font-semibold opacity-70 mt-1">{s.label}</p>
                </button>
              ))}
            </div>

            {/* ============ GRÁFICOS PRINCIPALES ============ */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Niveles */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Alumnos por Nivel</h3>
                <div className="space-y-3">
                  {['A1', 'A2', 'B1', 'B2', 'C1'].map(level => (
                    <div key={level} className="flex items-center gap-3">
                      <span className="text-sm font-semibold w-8">{level}</span>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${getLevelColor(level)} transition-all`}
                          style={{ width: `${stats.totalStudents > 0 ? ((stats.byLevel[level] || 0) / stats.totalStudents) * 100 : 0}%` }} />
                      </div>
                      <span className="text-sm text-gray-500 w-10 text-right font-semibold">{stats.byLevel[level] || 0}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-6">
                  {['A1', 'A2', 'B1', 'B2', 'C1'].map(level => (
                    <div key={level} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className={`w-3 h-3 rounded-full ${getLevelColor(level)}`} />
                      {level}
                    </div>
                  ))}
                </div>
              </div>

              {/* Planes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Plan de Membresía</h3>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="12" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="12" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - ((stats.byPlan?.premium || 0) / (stats.totalStudents || 1)))}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-black text-amber-600">{stats.byPlan?.premium || 0}</p>
                      <p className="text-xs text-gray-400">Premium</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400" /> Básico</span>
                    <span className="font-bold">{stats.byPlan?.basic || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500" /> Premium</span>
                    <span className="font-bold">{stats.byPlan?.premium || 0}</span>
                  </div>
                </div>
              </div>

              {/* Registros por Mes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Nuevos Alumnos por Mes</h3>
                <div className="flex items-end justify-between gap-1 h-40">
                  {Array.from({ length: 12 }, (_, i) => {
                    const count = stats.byMonth?.[i] || 0
                    const maxCount = Math.max(...Object.values(stats.byMonth || {}), 1)
                    const height = (count / maxCount) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-gray-600">{count}</span>
                        <div className="w-full bg-primary/20 rounded-t-lg overflow-hidden" style={{ height: '100px' }}>
                          <div className="bg-primary w-full rounded-t-lg transition-all" style={{ height: `${height}%`, marginTop: `${100 - height}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400">{monthNames[i]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ============ TOP ESTUDIANTES + RECIENTES ============ */}
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Top Estudiantes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">🏆 Top Estudiantes</h3>
                <div className="space-y-3">
                  {stats.topStudents.map((student, i) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="text-lg w-8 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                        {student.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{student.points || 0} pts</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getLevelBg(student.assignedLevel)}`}>
                          {student.assignedLevel || '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usuarios Recientes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">🆕 Últimos Registros</h3>
                <div className="space-y-3">
                  {stats.recentUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${user.role === 'teacher' ? 'bg-green-100 text-green-700' : user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <span className="text-[10px] text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded-full">{user.role}</span>
                        </div>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ============ PESTAÑA CONTENIDO ============ */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: 'Preguntas Test', value: contentStats.totalQuestions, icon: '📝', color: 'bg-blue-50 text-blue-700', path: '/admin/questions' },
                { label: 'Audiolibros', value: contentStats.totalAudiobooks, icon: '🎧', color: 'bg-green-50 text-green-700', path: '/admin/audiobooks' },
                { label: 'Noticias', value: contentStats.totalNews, icon: '📰', color: 'bg-purple-50 text-purple-700', path: '/admin/news' },
                { label: 'Pronunciación', value: contentStats.totalPronunciations, icon: '🎤', color: 'bg-amber-50 text-amber-700', path: '/admin/pronunciation' },
                { label: 'Diccionario', value: contentStats.totalDictionary, icon: '📚', color: 'bg-rose-50 text-rose-700' },
              ].map((s, i) => (
                <button key={i} onClick={() => s.path && navigate(s.path)}
                  className={`rounded-2xl p-4 text-left transition-all hover:shadow-md ${s.path ? 'cursor-pointer hover:scale-105' : ''} ${s.color} bg-opacity-60`}>
                  <p className="text-2xl mb-2">{s.icon}</p>
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-xs font-semibold opacity-70 mt-1">{s.label}</p>
                </button>
              ))}
            </div>

            {/* Estadísticas de uso */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                <p className="text-3xl mb-2">▶️</p>
                <p className="text-2xl font-black text-primary">{contentStats.totalPlays.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Reproducciones</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                <p className="text-3xl mb-2">⬇️</p>
                <p className="text-2xl font-black text-green-600">{contentStats.totalDownloads.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Descargas</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-2xl font-black text-amber-600">{contentStats.totalSearches.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Búsquedas</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                <p className="text-3xl mb-2">👁️</p>
                <p className="text-2xl font-black text-purple-600">{contentStats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Visualizaciones</p>
              </div>
            </div>

            {/* Leads */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">📋 Leads Recientes</h3>
                <button onClick={() => navigate('/admin/leads')} className="text-primary text-sm font-semibold hover:underline">Ver todos →</button>
              </div>
              <div className="space-y-2">
                {stats.recentUsers.slice(0, 4).map(user => (
                  <div key={user.id} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-gray-400">{user.email}</span>
                    <span className="ml-auto text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Acciones rápidas (siempre visibles) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">⚡ Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/admin/students')} className="bg-primary text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
              ➕ Nuevo Alumno
            </button>
            <button onClick={() => navigate('/admin/teachers')} className="bg-green-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
              ➕ Nuevo Profesor
            </button>
            <button onClick={() => navigate('/admin/questions')} className="bg-amber-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors">
              📝 Gestionar Preguntas
            </button>
            <button onClick={() => navigate('/admin/news')} className="bg-purple-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
              📰 Gestionar Noticias
            </button>
            <button onClick={() => navigate('/admin/audiobooks')} className="bg-rose-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors">
              🎧 Gestionar Audiolibros
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}