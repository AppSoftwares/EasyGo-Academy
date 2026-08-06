// src/pages/teacher/TeacherProgress.jsx
import { useState, useEffect } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'

export const TeacherProgress = () => {
  const [progressData, setProgressData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    loadProgress()
  }, [selectedPeriod])

  const loadProgress = async () => {
    try {
      const res = await teacherService.getProgressOverview(selectedPeriod)
      if (res.data.success) setProgressData(res.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 Progreso de Alumnos</h1>
            <p className="text-gray-500 text-sm mt-1">Análisis detallado del rendimiento académico</p>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'semester'].map(period => (
              <button key={period} onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${selectedPeriod === period ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Semestre'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Alumnos Activos</p>
                <p className="text-3xl font-bold text-gray-900">{progressData?.activeStudents || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tasa de Completitud</p>
                <p className="text-3xl font-bold text-green-600">{progressData?.completionRate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Horas de Estudio</p>
                <p className="text-3xl font-bold text-primary">{progressData?.totalHours || 0}h</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">⏱️</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Promedio General</p>
                <p className="text-3xl font-bold text-accent">{progressData?.avgScore || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-2xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Gráfica de Progreso */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">📈 Evolución del Progreso</h2>
          <div className="h-64 flex items-end gap-2">
            {progressData?.dailyProgress?.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40" 
                  style={{ height: `${day.value}%`, minHeight: '4px' }} />
                <span className="text-xs text-gray-400 rotate-45 origin-left">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por nivel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">📊 Distribución por Nivel</h2>
            <div className="space-y-3">
              {(['A1', 'A2', 'B1', 'B2', 'C1']).map(level => {
                const count = progressData?.levelDistribution?.[level] || 0
                const percentage = progressData?.totalStudents ? (count / progressData.totalStudents) * 100 : 0
                return (
                  <div key={level}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Nivel {level}</span>
                      <span className="text-gray-500">{count} alumnos ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top alumnos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">🏆 Top Alumnos</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {progressData?.topStudents?.map((student, idx) => (
                <div key={student.id} className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{student.progress}%</p>
                    <p className="text-xs text-gray-400">{student.completedUnits} unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  )
}