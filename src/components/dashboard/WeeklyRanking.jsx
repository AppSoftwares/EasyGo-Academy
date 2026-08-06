// src/components/dashboard/WeeklyRanking.jsx
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { progressService } from '../../services/progressService'

export const WeeklyRanking = () => {
  const { user } = useAuthStore()
  const [ranking, setRanking] = useState([])
  const [userPosition, setUserPosition] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRanking()
  }, [])

  const loadRanking = async () => {
    try {
      const res = await progressService.getRanking()
      if (res.data.success) {
        setRanking(res.data.ranking || [])
        const position = res.data.ranking?.findIndex(r => r.userId === user?.id)
        if (position !== undefined && position !== -1) {
          setUserPosition(position + 1)
        }
      }
    } catch (error) {
      console.error('Error loading ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mostrar top 3 + usuario si no está en top 3
  const displayRanking = [
    ...ranking.slice(0, 3).map((r, index) => ({
      name: r.name || 'Usuario',
      points: r.points || 0,
      avatar: r.name?.charAt(0).toUpperCase() || 'U',
      color: ['bg-yellow-100 text-yellow-700', 'bg-gray-100 text-gray-600', 'bg-amber-100 text-amber-700'][index] || 'bg-gray-100 text-gray-600',
      medal: ['🥇', '🥈', '🥉'][index] || '🏅',
      isMe: r.userId === user?.id
    })),
    // Si el usuario no está en el top 3, mostrarlo
    ...(ranking.length > 3 && !ranking.slice(0, 3).some(r => r.userId === user?.id) ? [
      {
        name: user?.name || 'Tú',
        points: ranking.find(r => r.userId === user?.id)?.points || 0,
        avatar: user?.name?.charAt(0).toUpperCase() || 'T',
        color: 'bg-primary/10 text-primary',
        medal: `#${userPosition || 4}`,
        isMe: true
      }
    ] : [])
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
              <div className="w-12 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900">🏆 Ranking semanal</h4>
        {userPosition && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
            #{userPosition}
          </span>
        )}
      </div>
      
      {displayRanking.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">
          <span className="text-3xl block mb-2">📊</span>
          Aún no hay datos de ranking
        </div>
      ) : (
        <div className="space-y-3">
          {displayRanking.map((player, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                player.isMe ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-lg w-6 text-center">{player.medal}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${player.color}`}>
                {player.avatar}
              </div>
              <span className={`flex-1 text-sm font-semibold ${player.isMe ? 'text-primary' : 'text-gray-900'}`}>
                {player.name}
                {player.isMe && ' (tú)'}
              </span>
              <span className={`text-sm font-bold ${player.isMe ? 'text-primary' : 'text-gray-600'}`}>
                {player.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}