// src/components/dashboard/LearningPath.jsx
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { progressService } from '../../services/progressService'

export const LearningPath = () => {
  const { user } = useAuthStore()
  const [progressData, setProgressData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      const res = await progressService.getMyProgress()
      if (res.data.success) {
        setProgressData(res.data.progress)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular el siguiente objetivo
  const getNextObjective = () => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
    
    for (const level of levels) {
      const levelData = progressData?.[level]
      const modules = levelData?.curriculum?.modules || []
      
      for (const module of modules) {
        if (!module.completed && module.progress < 100) {
          const completedUnits = module.units?.filter(u => u.completed).length || 0
          return {
            level,
            moduleName: module.title,
            progress: module.progress,
            totalUnits: module.totalUnits || 0,
            completedUnits,
            message: `Completar módulo: ${module.title}`,
            icon: '🚀'
          }
        }
      }
    }
    
    // Si todo está completado
    return {
      level: '🎉',
      moduleName: '¡Has completado todos los niveles!',
      progress: 100,
      totalUnits: 1,
      completedUnits: 1,
      message: '¡Felicidades! Has terminado todo el curso',
      icon: '🏆'
    }
  }

  // Calcular objetivos totales
  const getTotalObjectives = () => {
    let total = 0
    let completed = 0
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
    
    for (const level of levels) {
      const levelData = progressData?.[level]
      const modules = levelData?.curriculum?.modules || []
      total += modules.length
      completed += modules.filter(m => m.completed).length
    }
    
    return { total, completed }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-12 bg-gray-200 rounded mb-4" />
        <div className="h-2 bg-gray-200 rounded" />
      </div>
    )
  }

  const nextObjective = getNextObjective()
  const objectives = getTotalObjectives()

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h4 className="font-bold text-gray-900 mb-4">🚀 Ruta de aprendizaje</h4>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">{nextObjective.icon}</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {nextObjective.progress === 100 ? '¡Completado!' : 'Próximo objetivo'}
          </p>
          <p className="text-xs text-gray-500">
            {nextObjective.message}
            {nextObjective.level && nextObjective.level !== '🎉' && (
              <span className="block text-[10px] text-primary/70 mt-0.5">
                Nivel {nextObjective.level}
              </span>
            )}
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-primary">
            {nextObjective.progress}%
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full mb-2">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
          style={{ width: `${nextObjective.progress}%` }} 
        />
      </div>
      <p className="text-xs text-gray-400">
        {objectives.completed} de {objectives.total} objetivos completados
      </p>
    </div>
  )
}