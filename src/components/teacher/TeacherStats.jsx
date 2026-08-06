// src/components/teacher/TeacherStats.jsx
import { useState, useEffect } from 'react'
import { teacherService } from '../../services/teacherService'

export const TeacherStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await teacherService.getStats()
      if (res.data.success) {
        setStats(res.data.stats)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="w-16 h-8 bg-gray-200 rounded" />
            </div>
            <div className="mt-3 h-4 bg-gray-200 rounded w-24" />
            <div className="mt-1 h-3 bg-gray-100 rounded w-32" />
          </div>
        ))}
      </div>
    )
  }

  const statItems = [
    {
      title: 'Total Alumnos',
      value: stats?.totalStudents || 0,
      icon: '👨‍🎓',
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
      subtitle: 'Activos en tu curso'
    },
    {
      title: 'Clases Impartidas',
      value: stats?.totalClasses || 0,
      icon: '📚',
      color: 'bg-green-100',
      textColor: 'text-green-600',
      subtitle: 'Este mes'
    },
    {
      title: 'Progreso Promedio',
      value: `${stats?.avgProgress || 0}%`,
      icon: '⭐',
      color: 'bg-amber-100',
      textColor: 'text-amber-600',
      subtitle: 'De tus alumnos'
    },
    {
      title: 'Tasa de Completitud',
      value: `${stats?.completionRate || 0}%`,
      icon: '✅',
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
      subtitle: 'Lecciones finalizadas'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl`}>
              {item.icon}
            </div>
            <span className={`text-2xl font-bold ${item.textColor}`}>{item.value}</span>
          </div>
          <h3 className="font-semibold text-gray-700">{item.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>
        </div>
      ))}
    </div>
  )
}