import { useState, useEffect } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { rankingService } from '../services/rankingService'
import { useAuthStore } from '../store/useAuthStore'

export const RankingPage = () => {
  const { user } = useAuthStore()
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeLevel, setActiveLevel] = useState('all')
  const [myPosition, setMyPosition] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => { loadData(); loadMyPosition(); loadStats() }, [activeLevel])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeLevel !== 'all') params.level = activeLevel
      const res = await rankingService.getWeekly(params)
      if (res.data.success) setRankings(res.data.rankings)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const loadMyPosition = async () => {
    try {
      const res = await rankingService.getMyPosition()
      if (res.data.success) setMyPosition(res.data)
    } catch (err) {}
  }

  const loadStats = async () => {
    try {
      const res = await rankingService.getStats()
      if (res.data.success) setStats(res.data.stats)
    } catch (err) {}
  }

  const levels = [
    { id: 'all', label: 'Todos', count: stats?.total || 0 },
    { id: 'A1', label: 'A1', color: 'bg-emerald-500', count: stats?.byLevel?.A1 || 0 },
    { id: 'A2', label: 'A2', color: 'bg-blue-500', count: stats?.byLevel?.A2 || 0 },
    { id: 'B1', label: 'B1', color: 'bg-amber-500', count: stats?.byLevel?.B1 || 0 },
    { id: 'B2', label: 'B2', color: 'bg-orange-500', count: stats?.byLevel?.B2 || 0 },
    { id: 'C1', label: 'C1', color: 'bg-rose-500', count: stats?.byLevel?.C1 || 0 },
  ]

  const getMedal = (pos) => {
    if (pos === 1) return { emoji: '🥇', color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700' }
    if (pos === 2) return { emoji: '🥈', color: 'bg-gray-50 border-gray-200', text: 'text-gray-600' }
    if (pos === 3) return { emoji: '🥉', color: 'bg-amber-50 border-amber-200', text: 'text-amber-700' }
    return { emoji: pos, color: '', text: 'text-gray-400' }
  }

  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '??'

  const getLevelColor = (l) => ({ A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700', B1: 'bg-amber-100 text-amber-700', B2: 'bg-orange-100 text-orange-700', C1: 'bg-rose-100 text-rose-700' })[l] || ''

  const getRandomGradient = (seed) => {
    const gradients = [
      'from-primary to-accent',
      'from-emerald-400 to-teal-500',
      'from-blue-400 to-indigo-500',
      'from-amber-400 to-orange-500',
      'from-rose-400 to-pink-500',
      'from-violet-400 to-purple-500',
      'from-cyan-400 to-blue-500',
      'from-lime-400 to-green-500',
    ]
    return gradients[seed % gradients.length]
  }

  const podiumUsers = rankings.slice(0, 3)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🏆 Ranking</h1>
            <p className="text-gray-500 text-sm mt-1">Clasificación semanal de estudiantes</p>
          </div>
          {stats && (
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <p className="font-black text-primary text-lg">{stats.total}</p>
                <p className="text-xs text-gray-400">Participantes</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <p className="font-black text-accent text-lg">{stats.topStreak}🔥</p>
                <p className="text-xs text-gray-400">Racha máxima</p>
              </div>
            </div>
          )}
        </div>

        {/* Mi posición */}
        {myPosition && myPosition.ranking && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-5 border border-primary/20 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{user?.name || 'Tú'}</p>
              <p className="text-xs text-gray-500">Posición #{myPosition.position} de {myPosition.total}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-primary text-xl">{myPosition.ranking.points.toLocaleString()}</p>
              <p className="text-xs text-gray-400">puntos</p>
            </div>
          </div>
        )}

        {/* Podium */}
        {podiumUsers.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end">
            {/* 2do lugar */}
            <button className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl mx-auto mb-2 shadow-lg group-hover:scale-105 transition-transform">
                {getInitials(podiumUsers[1]?.user?.name)}
              </div>
              <div className="bg-gray-100 rounded-t-2xl pt-3 pb-4 px-2">
                <span className="text-2xl sm:text-3xl block">🥈</span>
                <p className="font-bold text-gray-900 text-xs sm:text-sm mt-1 truncate">{podiumUsers[1]?.user?.name || '---'}</p>
                <p className="text-gray-500 text-xs">{podiumUsers[1]?.points || 0} pts</p>
              </div>
            </button>

            {/* 1er lugar */}
            <button className="text-center group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl mx-auto mb-2 shadow-xl group-hover:scale-105 transition-transform animate-pulse-slow">
                {getInitials(podiumUsers[0]?.user?.name)}
              </div>
              <div className="bg-yellow-50 rounded-t-2xl pt-3 pb-4 px-2 border border-yellow-200">
                <span className="text-3xl sm:text-4xl block">🥇</span>
                <p className="font-bold text-gray-900 text-sm sm:text-base mt-1 truncate">{podiumUsers[0]?.user?.name || '---'}</p>
                <p className="text-amber-600 font-bold text-sm">{podiumUsers[0]?.points || 0} pts</p>
              </div>
            </button>

            {/* 3er lugar */}
            <button className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl mx-auto mb-2 shadow-lg group-hover:scale-105 transition-transform">
                {getInitials(podiumUsers[2]?.user?.name)}
              </div>
              <div className="bg-amber-50 rounded-t-2xl pt-3 pb-4 px-2 border border-amber-200">
                <span className="text-2xl sm:text-3xl block">🥉</span>
                <p className="font-bold text-gray-900 text-xs sm:text-sm mt-1 truncate">{podiumUsers[2]?.user?.name || '---'}</p>
                <p className="text-gray-500 text-xs">{podiumUsers[2]?.points || 0} pts</p>
              </div>
            </button>
          </div>
        )}

        {/* Filtros de nivel */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {levels.map(l => (
            <button key={l.id} onClick={() => setActiveLevel(l.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeLevel === l.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}>
              {l.id !== 'all' && <span className={`w-2 h-2 rounded-full ${l.color}`} />}
              {l.label} ({l.count})
            </button>
          ))}
        </div>

        {/* Tabla de clasificación */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {rankings.map((item, index) => {
              const medal = getMedal(index + 1)
              const isMe = item.user?.id === user?.id
              const gradient = getRandomGradient(index)

              return (
                <div key={item.id} className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 transition-colors ${isMe ? 'bg-primary/5' : 'hover:bg-gray-50'}`}>
                  {/* Posición */}
                  <div className="w-10 sm:w-12 text-center flex-shrink-0">
                    {index < 3 ? (
                      <span className="text-2xl sm:text-3xl">{medal.emoji}</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0 shadow-sm`}>
                    {getInitials(item.user?.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 text-sm sm:text-base truncate">
                        {item.user?.name || 'Anónimo'}
                      </p>
                      {isMe && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Tú</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getLevelColor(item.level)}`}>{item.level}</span>
                      <span>🔥 {item.streak || 0} días</span>
                      <span>📚 {item.lessonsCompleted || 0} lecciones</span>
                    </div>
                  </div>

                  {/* Puntos */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-primary text-lg sm:text-xl">{item.points.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">pts</p>
                  </div>
                </div>
              )
            })}
          </div>

          {rankings.length === 0 && (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">🏆</span>
              <p className="text-gray-500 font-medium">No hay clasificación todavía</p>
              <p className="text-gray-400 text-sm mt-1">¡Sé el primero en aparecer en el ranking!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}