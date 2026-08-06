import { useState, useEffect } from 'react'
import { progressService } from '../../services/progressService'
import { useAuthStore } from '../../store/useAuthStore'

export const ProgressCard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const response = await progressService.getStats()
      if (response.data.success) setStats(response.data.stats)
    } catch (err) { setError('No se pudieron cargar las estadísticas') }
    finally { setLoading(false) }
  }

  const getLevelName = (level) => {
    const names = { A1: 'Principiante', A2: 'Básico', B1: 'Intermedio', B2: 'Avanzado', C1: 'Competente' }
    return names[level] || level
  }

  const userLevel = user?.finalAssignedLevel || user?.assignedLevel || user?.levelTestResult?.recommendedLevel || null

  const getCurrentLevel = () => {
    if (userLevel) return { level: userLevel, name: getLevelName(userLevel) }
    if (!stats || !stats.levelStats) return { level: '—', name: 'Sin nivel' }
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
    for (const level of levels) {
      if (stats.levelStats[level]?.total > 0 && stats.levelStats[level]?.completed > 0) {
        return { level, name: getLevelName(level) }
      }
    }
    return { level: '—', name: 'Sin nivel' }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-5">
            <div><div className="h-4 w-24 bg-gray-200 rounded mb-2"></div><div className="h-2.5 bg-gray-200 rounded-full"></div></div>
            <div className="grid grid-cols-2 gap-3"><div className="h-20 bg-gray-100 rounded-xl"></div><div className="h-20 bg-gray-100 rounded-xl"></div></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <span className="text-3xl block mb-2">⚠️</span><p className="text-gray-500 text-sm">{error}</p>
      </div>
    )
  }

  if (!stats || stats.totalUnits === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <span className="text-4xl block mb-3">📝</span><p className="text-gray-500 text-sm">Aún no hay progreso registrado</p>
      </div>
    )
  }

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (stats.overallProgress / 100) * circumference
  const currentLevel = getCurrentLevel()
  const hours = Math.floor(stats.totalTime / 60)
  const minutes = stats.totalTime % 60

  // Calcular módulos correctamente
  const levelStats = stats.levelStats?.[userLevel] || {}
  const totalUnits = levelStats.total || stats.totalUnits
  const totalLesseon = stats.totalLessons.find(l => l.level === userLevel).count
  const completedUnits = levelStats.completed || stats.completedUnits
  const totalModules = Math.ceil(totalUnits)
  const completedModules = Math.floor(completedUnits / 4)
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} stroke="#E2E8F0" strokeWidth="8" fill="none" />
              <circle cx="60" cy="60" r={radius} stroke="url(#progressGradient)" strokeWidth="8" fill="none"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5B2ECC" /><stop offset="100%" stopColor="#e3504a" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-primary leading-none">{currentLevel.level}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-3">Nivel actual</p>
          <p className="text-sm font-bold text-gray-900">{currentLevel.name}</p>
          {user?.levelTestResult?.skipped && (
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1">Test omitido</span>
          )}
        </div>

        <div className="flex-1 space-y-5 w-full">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-700">Tu progreso</span>
              <span className="text-lg font-black text-primary">{stats.overallProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700 ease-out"
                style={{ width: `${stats.overallProgress}%` }} />
            </div>
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-gray-500">{completedUnits}</span> de{' '}
              <span className="font-semibold text-gray-500">{totalLesseon}</span> unidades completadas
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
              <p className="text-xs text-gray-500 font-medium mb-1">Módulos completados</p>
              <p className="text-xl sm:text-2xl font-black text-primary">
                {completedModules}<span className="text-sm text-gray-400 font-normal">/{totalModules}</span>
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
              <p className="text-xs text-gray-500 font-medium mb-1">Horas de estudio</p>
              <p className="text-xl sm:text-2xl font-black text-accent">
                {hours}h<span className="text-sm text-gray-400 font-normal"> {minutes}m</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>📊</span><span>Promedio: <strong className="text-gray-600">{stats.avgScore}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}