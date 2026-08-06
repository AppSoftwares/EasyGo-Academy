// src/components/teacher/TeacherChart.jsx
import { useState, useEffect } from 'react'
import { teacherService } from '../../services/teacherService'

export const TeacherChart = ({ period = 'month', title = 'Progreso de Alumnos' }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [maxValue, setMaxValue] = useState(0)

  useEffect(() => {
    loadData()
  }, [period])

  const loadData = async () => {
    try {
      const res = await teacherService.getProgressOverview(period)
      if (res.data.success) {
        const chartData = res.data.dailyProgress || []
        setData(chartData)
        const max = Math.max(...chartData.map(d => d.value), 10)
        setMaxValue(max)
      }
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getColor = (index) => {
    const colors = [
      'bg-primary',
      'bg-blue-500',
      'bg-green-500',
      'bg-amber-500',
      'bg-purple-500',
      'bg-rose-500',
      'bg-cyan-500',
      'bg-emerald-500'
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-64 flex items-end gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="flex-1 bg-gray-100 rounded-t-lg animate-pulse" style={{ height: `${30 + Math.random() * 50}px` }} />
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <span className="text-xs text-gray-400 capitalize">{period}</span>
        </div>
        <div className="text-center py-12">
          <span className="text-4xl block mb-2">📊</span>
          <p className="text-gray-500 text-sm">No hay datos disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-400 capitalize">{period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Semestre'}</span>
      </div>
      
      <div className="h-64 flex items-end gap-2">
        {data.map((item, idx) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div 
                className={`w-full ${getColor(idx)} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group`}
                style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {item.value}%
                </div>
              </div>
              <span className="text-[10px] text-gray-400 rotate-45 origin-left transform -translate-y-2">
                {item.label?.substring(0, 3)}
              </span>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Progreso general: {data.reduce((sum, d) => sum + d.value, 0) / data.length || 0}%</span>
          <span>Meta: 100%</span>
        </div>
      </div>
    </div>
  )
}